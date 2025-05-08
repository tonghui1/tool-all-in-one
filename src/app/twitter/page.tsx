"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, AlertCircle, Loader2, Info } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster, toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function TwitterDownloader() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  
  // 处理下载
  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error("请输入推特视频链接");
      return;
    }
    
    // 清理URL - 移除可能导致问题的前缀等
    let cleanedUrl = url.trim();
    if (cleanedUrl.startsWith('@')) {
      cleanedUrl = cleanedUrl.substring(1);
    }
    
    // 确保URL有http/https前缀
    if (!cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
      cleanedUrl = 'https://' + cleanedUrl;
    }
    
    // 验证URL是否为推特链接
    if (!isTwitterUrl(cleanedUrl)) {
      toast.error("请输入有效的推特视频链接");
      return;
    }
    
    setLoading(true);
    setErrorDetails(null); // 重置错误信息
    
    try {
      // 使用FastAPI的/twitter/video接口获取视频信息
      const response = await fetch(`http://127.0.0.1:8000/twitter/video?url=${encodeURIComponent(cleanedUrl)}`);
      
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
  
  // 验证推特URL
  const isTwitterUrl = (url: string): boolean => {
    // 放宽URL验证规则，支持带或不带协议的URL
    return /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.*?\/status\/\d+/.test(url);
  };

  // 渲染错误详情
  const renderErrorDetails = () => {
    if (!errorDetails) return null;
    
    return (
      <div className="mt-6 p-4 rounded-md bg-destructive/10">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-destructive">下载错误详情</h3>
            
            {errorDetails.methods && (
              <div className="mt-2">
                <p className="text-sm font-medium">尝试的方法:</p>
                <ul className="text-sm mt-1 space-y-1">
                  {errorDetails.methods.map((method: any, index: number) => (
                    <li key={index} className="pl-2 border-l-2 border-destructive/30">
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
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>提示: 推特不断更新其视频获取机制，某些视频可能无法下载。请尝试使用原始推特应用或网站观看视频。</p>
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
          <h1 className="text-4xl font-bold mb-2">推特视频下载器</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            轻松下载推特/X平台上的视频内容
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
              粘贴推特/X视频链接，点击下载按钮即可
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                className="flex-1 text-lg p-6 h-16 bg-background"
                placeholder="https://twitter.com/username/status/123456789"
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
                    复制Twitter/X视频推文的URL，格式通常为 
                    <code className="px-1 rounded mx-1 bg-muted">
                      twitter.com/username/status/123456789
                    </code>
                  </p>
                </div>
              </div>
            </div>
            
            {/* 显示错误消息 */}
            {errorDetails && renderErrorDetails()}
          </CardContent>
        </Card>

        {/* FAQ部分 */}
        <div className="mt-12 p-6 rounded-lg bg-card text-card-foreground shadow-lg">
          <h2 className="text-2xl font-bold mb-6">常见问题解答</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>如何使用这个工具?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">使用方法非常简单：</p>
                <ol className="list-decimal list-inside my-3 ml-2 space-y-1">
                  <li>在Twitter/X上找到包含视频的推文</li>
                  <li>点击分享按钮，复制推文链接</li>
                  <li>粘贴到本工具的输入框中</li>
                  <li>点击"下载"按钮</li>
                  <li>视频将在新窗口打开，然后您可以右键点击视频选择"另存为"下载</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>支持哪些类型的推特链接？</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">本工具支持以下格式的链接：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-1">
                  <li>标准推特链接：<code className={`px-1 rounded ${darkTheme ? 'bg-gray-700' : 'bg-gray-200'}`}>https://twitter.com/username/status/1234567890</code></li>
                  <li>X平台链接：<code className={`px-1 rounded ${darkTheme ? 'bg-gray-700' : 'bg-gray-200'}`}>https://x.com/username/status/1234567890</code></li>
                  <li>带查询参数的链接也同样支持</li>
                </ul>
                <p>请确保链接指向的是包含视频的推文，而不是个人资料页或其他类型的页面。</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>下载的视频质量如何？</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">本工具尽可能提供最高质量的视频下载：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>我们会尝试下载推特视频的最高分辨率版本</li>
                  <li>通常可以获取720p或1080p的视频质量（取决于原始视频的上传质量）</li>
                  <li>视频将保留原始音频</li>
                  <li>下载的视频格式通常为MP4，兼容大多数设备和播放器</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>使用本工具下载视频合法吗？</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">下载视频时请注意以下几点：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>本工具仅供个人使用，请尊重内容创作者的权利</li>
                  <li>下载的内容应仅用于个人观看和非商业用途</li>
                  <li>请勿分发、重新上传或以任何方式商业化使用下载的内容</li>
                  <li>在某些国家/地区，即使是个人使用目的的下载也可能受到限制</li>
                  <li>用户应负责确保其行为符合当地法律法规和推特的服务条款</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>为什么有些视频无法下载？</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">可能出现无法下载的原因：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li><strong>受保护的推文</strong>：私密账号的视频无法下载</li>
                  <li><strong>地区限制</strong>：某些内容在特定地区可能无法访问</li>
                  <li><strong>已删除的内容</strong>：推文或视频已被原作者删除</li>
                  <li><strong>直播内容</strong>：当前正在直播的内容可能无法下载</li>
                  <li><strong>技术限制</strong>：推特偶尔会调整其API或网页结构，可能导致工具暂时失效</li>
                </ul>
                <p>如果遇到下载问题，请稍后再试或检查输入的URL是否正确。</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>关于推特视频的其他信息</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">一些关于推特视频的有用信息：</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>推特视频的最大长度通常为2分20秒</li>
                  <li>推特支持的最大视频分辨率为1920x1080 (1080p)</li>
                  <li>在手机应用中长按视频可以打开原生的保存选项</li>
                  <li>推特媒体内容通常在其服务器上存储很长时间，即使原推文已删除</li>
                  <li>从2023年起，X平台（前推特）增加了对较长视频的支持，付费用户可上传更长时间的视频</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}