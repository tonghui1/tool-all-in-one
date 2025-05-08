import { NextResponse } from 'next/server';
import { twitter } from 'video-url-link';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

// 处理推特视频下载的API
export async function POST(request: Request) {
  // 创建临时目录用于存储下载的视频
  const tempDir = path.join(os.tmpdir(), 'twitter-videos');
  try {
    await fs.mkdir(tempDir, { recursive: true });
  } catch (error) {
    console.error('创建临时目录失败:', error);
  }
  
  try {
    // 解析请求体
    const body = await request.json();
    const { url } = body;

    // 验证URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的推特视频链接' },
        { status: 400 }
      );
    }

    // 清理URL - 移除@前缀和其他不必要的字符
    let cleanedUrl = url.trim();
    if (cleanedUrl.startsWith('@')) {
      cleanedUrl = cleanedUrl.substring(1);
    }
    
    // 确保URL有http/https前缀
    if (!cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
      cleanedUrl = 'https://' + cleanedUrl;
    }
    
    // 将x.com转换为twitter.com (video-url-link可能只支持twitter.com域名)
    cleanedUrl = cleanedUrl.replace(/https?:\/\/(www\.)?x\.com/, 'https://twitter.com');
    
    // 提取状态ID并构建标准Twitter URL
    const statusMatch = cleanedUrl.match(/\/status\/(\d+)/);
    if (statusMatch && statusMatch[1]) {
      const statusId = statusMatch[1];
      // 使用标准twitter.com URL格式
      cleanedUrl = `https://twitter.com/anyuser/status/${statusId}`;
    }

    console.log('原始URL:', url);
    console.log('清理后的URL:', cleanedUrl);
    
    // 验证是否为推特链接
    const twitterRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/;
    if (!twitterRegex.test(cleanedUrl)) {
      return NextResponse.json(
        { error: '无效的推特视频链接格式' },
        { status: 400 }
      );
    }

    // 处理视频下载
    try {
      console.log('正在解析推特视频链接:', cleanedUrl);
      
      // 使用 video-url-link 解析Twitter视频
      const videoUrl = await new Promise<string>((resolve, reject) => {
        twitter.getInfo(cleanedUrl, (error: any, info: any) => {
          if (error) {
            console.error('解析Twitter链接出错:', error);
            return reject(error);
          }
          
          // 获取视频列表并选择最高质量的版本
          if (info && info.videos && info.videos.length > 0) {
            // 按照比特率排序，获取最高质量的视频
            const videos = info.videos.sort((a: any, b: any) => b.bitrate - a.bitrate);
            console.log(`找到 ${videos.length} 个视频版本，选择最高质量的版本:`, videos[0]);
            resolve(videos[0].url);
          } else {
            reject(new Error('未找到视频信息'));
          }
        });
      });
      
      if (!videoUrl) {
        throw new Error('无法获取视频URL');
      }
      
      console.log('获取到视频URL:', videoUrl);
      
      // 下载视频
      console.log('开始下载视频内容...');
      const videoResponse = await fetch(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      console.log('视频内容响应状态:', videoResponse.status);
      
      if (!videoResponse.ok) {
        throw new Error(`视频下载失败，HTTP状态: ${videoResponse.status}`);
      }
      
      // 保存到临时文件
      const uniqueId = uuidv4();
      const outputPath = path.join(tempDir, `twitter-video-${uniqueId}.mp4`);
      
      const arrayBuffer = await videoResponse.arrayBuffer();
      await fs.writeFile(outputPath, Buffer.from(arrayBuffer));
      
      console.log('视频已保存到临时文件:', outputPath);
      
      // 读取视频文件并返回
      const videoBuffer = await fs.readFile(outputPath);
      
      // 设置响应头，使浏览器直接下载文件
      const headers = new Headers();
      headers.set('Content-Disposition', 'attachment; filename="twitter-video.mp4"');
      headers.set('Content-Type', 'video/mp4');
      
      // 删除临时文件
      fs.unlink(outputPath).catch(err => {
        console.error('删除临时文件失败:', err);
      });
      
      // 直接返回视频文件
      return new Response(videoBuffer, {
        status: 200,
        headers
      });
      
    } catch (videoError) {
      console.error('获取视频出错:', videoError);
      // 提供详细的错误信息
      let errorMessage = '获取视频失败，请稍后重试';
      let errorDetails = {};
      
      if (videoError instanceof Error) {
        errorMessage = `视频下载错误: ${videoError.message}`;
        console.error('错误堆栈:', videoError.stack);
        errorDetails = { 
          message: videoError.message,
          stack: videoError.stack?.split('\n').slice(0, 3).join('\n'),
          name: videoError.name
        };
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Twitter下载处理错误:', error);
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorDetails = { 
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'),
        name: error.name
      };
    }
    
    return NextResponse.json(
      { 
        error: '处理视频时出错，请稍后重试',
        details: errorDetails
      },
      { status: 500 }
    );
  } finally {
    // 清理临时文件夹中的旧文件（超过30分钟的文件）
    try {
      const files = await fs.readdir(tempDir);
      const now = Date.now();
      const thirtyMinutesAgo = now - 30 * 60 * 1000;
      
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile() && stats.mtimeMs < thirtyMinutesAgo) {
          await fs.unlink(filePath).catch(err => {
            console.error(`删除旧临时文件失败: ${filePath}`, err);
          });
        }
      }
    } catch (error) {
      console.error('清理临时文件夹失败:', error);
    }
  }
} 