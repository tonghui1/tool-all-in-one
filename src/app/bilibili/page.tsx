"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, AlertCircle, Loader2 } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster, toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function BilibiliDownloader() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  
  // 处理下载
  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error("请输入B站视频链接");
      return;
    }
    
    // 清理URL
    let cleanedUrl = url.trim();
    
    // 确保URL有http/https前缀
    if (!cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
      cleanedUrl = 'https://' + cleanedUrl;
    }
    
    // 验证URL是否为B站链接
    if (!isBilibiliUrl(cleanedUrl)) {
      toast.error("请输入有效的B站视频链接");
      return;
    }
    
    setLoading(true);
    setErrorDetails(null); // 重置错误信息
    
    try {
      // 使用FastAPI的接口获取视频信息
      const response = await fetch(`http://127.0.0.1:8000/bilibili/video?url=${encodeURIComponent(cleanedUrl)}`);
      
      if (!response.ok) {
        // 处理错误响应
        const errorData = await response.json();
        if (errorData.detail) {
          setErrorDetails({
            message: errorData.detail,
            methods: [{ name: "FastAPI解析", error: errorData.detail }]
          });
        }
        throw new Error(errorData.detail || '获取视频信息失败');
      }
      
      // 解析视频信息
      const videoInfo = await response.json();
      
      if (!videoInfo.download_url) {
        throw new Error('无法获取视频下载地址');
      }
      
      // 从download_url下载视频
      try {
        // 创建一个a标签，在新窗口打开视频链接
        const a = document.createElement('a');
        a.href = videoInfo.download_url;
        a.target = '_blank'; // 在新窗口打开
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast.success("视频已在新窗口打开，可右键点击视频另存为下载", {
          description: `视频标题: ${videoInfo.title || '未知'}, 分辨率: ${videoInfo.width || '?'}x${videoInfo.height || '?'}`
        });
      } catch (downloadError: any) {
        // 如果打开失败，提供视频链接
        toast.info("无法自动打开视频", {
          description: "已获取视频地址，请手动点击链接",
          action: {
            label: "复制链接",
            onClick: () => {
              navigator.clipboard.writeText(videoInfo.download_url);
              toast.success("链接已复制到剪贴板");
            }
          }
        });
      }
    } catch (error: any) {
      toast.error(`下载失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 验证Bilibili URL
  const isBilibiliUrl = (url: string): boolean => {
    return /^(https?:\/\/)?(www\.)?(bilibili\.com|b23\.tv)\/.*/.test(url);
  };

  // 渲染错误详情
  const renderErrorDetails = () => {
    if (!errorDetails) return null;
    
    return (
      <div className={`mt-6 p-4 rounded-md ${darkTheme ? 'bg-red-900/20' : 'bg-red-50'}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-red-600 dark:text-red-400">下载错误详情</h3>
            
            {errorDetails.methods && (
              <div className="mt-2">
                <p className="text-sm font-medium">尝试的方法:</p>
                <ul className="text-sm mt-1 space-y-1">
                  {errorDetails.methods.map((method: any, index: number) => (
                    <li key={index} className="pl-2 border-l-2 border-red-300">
                      <span className="font-medium">{method.name}</span>: {method.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {errorDetails.message && (
              <p className="text-sm mt-2">
                <span className="font-medium">错误消息:</span> {errorDetails.message}
              </p>
            )}
            
            <div className="mt-4 text-xs text-gray-500">
              <p>提示: B站不断更新其视频获取机制，某些视频可能无法下载。请尝试使用原始B站应用或网站观看视频。</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">哔哩哔哩视频下载器</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            轻松下载B站上的视频内容
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>视频下载</span>
              <div className="flex gap-2">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <span>暗黑模式</span>
                  <Switch 
                    checked={darkTheme} 
                    onCheckedChange={setDarkTheme} 
                  />
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              粘贴B站视频链接，点击下载按钮即可
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                className="flex-1 text-lg p-6 h-16 bg-background"
                placeholder="https://www.bilibili.com/video/BVxxxxxxxx"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
              <Button 
                className="h-16 px-8 text-lg"
                onClick={handleDownload}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    下载
                  </>
                )}
              </Button>
            </div>
            
            <div className="mt-4 p-4 rounded-md bg-muted/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">使用提示</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    复制B站视频页面的URL，格式通常为 
                    <code className="px-1 rounded mx-1 bg-muted">
                      bilibili.com/video/BVxxxxxxxxx
                    </code> 
                    或 
                    <code className="px-1 rounded mx-1 bg-muted">
                      b23.tv/xxxxxx
                    </code>
                  </p>
                </div>
              </div>
            </div>
            
            {/* 显示错误详情 */}
            {errorDetails && renderErrorDetails()}
          </CardContent>
        </Card>

        {/* FAQ部分 */}
        <div className="mt-12 p-6 rounded-lg bg-card text-card-foreground shadow-lg">
          <h2 className="text-2xl font-bold mb-6">常见问题解答</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>这个工具如何使用？</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">使用非常简单：</p>
                <ol className="list-decimal list-inside my-3 ml-2 space-y-1">
                  <li>找到你想要下载的B站视频</li>
                  <li>复制视频页面的URL（从浏览器地址栏获取）</li>
                  <li>粘贴到本工具的输入框中</li>
                  <li>点击"下载"按钮</li>
                  <li>视频将在新窗口打开，您可以右键点击视频选择"另存为"下载</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>支持哪些类型的B站链接？</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">本工具支持以下格式的链接：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-1">
                  <li>标准B站链接：<code className="px-1 rounded mx-1 bg-muted">https://www.bilibili.com/video/BVxxxxxxxxx</code></li>
                  <li>B站短链接：<code className="px-1 rounded mx-1 bg-muted">https://b23.tv/xxxxxx</code></li>
                  <li>AV号链接：<code className="px-1 rounded mx-1 bg-muted">https://www.bilibili.com/video/avxxxxxxx</code></li>
                  <li>移动应用分享的链接</li>
                </ul>
                <p>请确保链接指向的是视频页面，而不是直播、专栏或其他内容类型。</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>下载的视频质量如何？</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">本工具尽可能提供最高质量的视频：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>我们会尝试获取B站视频的最高清晰度版本</li>
                  <li>对于多P视频，需要单独下载每一个分P</li>
                  <li>视频将保留原始音频</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>为什么有些视频无法下载？</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">可能出现无法下载的原因：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li><strong>版权保护</strong>：某些视频有特殊的版权保护</li>
                  <li><strong>大会员视频</strong>：部分大会员专享内容可能无法获取</li>
                  <li><strong>地区限制</strong>：部分视频在特定地区不可访问</li>
                  <li><strong>技术限制</strong>：B站经常更新其平台和API，可能暂时影响下载功能</li>
                </ul>
                <p>如果遇到下载问题，请稍后再试或检查输入的URL是否正确。</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
} 