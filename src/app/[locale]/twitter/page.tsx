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
import { useTranslations } from "next-intl";

export default function TwitterDownloader() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const t = useTranslations("Twitter");
  
  // 处理下载
  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error(t("empty_toast"));
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
      toast.error(t("empty_toast"));
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
            methods: [{ name: "FastAPI", error: errorData.detail }]
          });
        }
        throw new Error(errorData.detail);
      }
      
      // 解析视频信息
      const videoInfo = await response.json();
      
      if (!videoInfo.download_url) {
        throw new Error(t("api_error"));
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
        
        toast.success(t("error_toast_1"));
      } catch {
        // 如果打开失败，提供视频链接
        toast.info(t("error_toast_2"), {
          description: t("error_toast_3"),
          action: {
            label: t("error_toast_4"),
            onClick: () => {
              navigator.clipboard.writeText(videoInfo.download_url);
              toast.success(t("error_toast_5"));
            }
          }
        });
      }
    } catch (error: any) {
      toast.error(`${error.message}`);
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
            <h3 className="font-medium text-destructive">{t("error_toast_6")}</h3>
            
            {errorDetails.methods && (
              <div className="mt-2">
                <p className="text-sm font-medium">{t("error_toast_7")}</p>
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
                <span className="font-medium">{t("error_toast_8")}</span> {errorDetails.message}
              </p>
            )}
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>{t("error_toast_9")}</p>
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
          <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("sub_title")}
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>{t("card_title")}</span>
            </CardTitle>
            <CardDescription>
            {t("card_describe")}
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
                    {t("handle")}
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    {t("download")}
                  </>
                )}
              </Button>
            </div>
            
            <div className="mt-4 p-4 rounded-md bg-muted/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">{t("tip_title")}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                  {t("tip_describe")}
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
          <h2 className="text-2xl font-bold mb-6">{t("faq")}</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t("faq_use")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">{t("faq_use_content_1")}</p>
                <ol className="list-decimal list-inside my-3 ml-2 space-y-1">
                  <li>{t("faq_use_content_2")}</li>
                  <li>{t("faq_use_content_3")}</li>
                  <li>{t("faq_use_content_4")}</li>
                  <li>{t("faq_use_content_5")}</li>
                  <li>{t("faq_use_content_6")}</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>{t("faq_link")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">{t("faq_link_content_1")}</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-1">
                  <li>{t("faq_link_content_2")}</li>
                  <li>{t("faq_link_content_3")}</li>
                  <li>{t("faq_link_content_4")}</li>
                </ul>
                <p>{t("faq_link_content_5")}</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>{t("faq_quality")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">{t("faq_quality_content_1")}</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>{t("faq_quality_content_2")}</li>
                  <li>{t("faq_quality_content_3")}</li>
                  <li>{t("faq_quality_content_4")}</li>
                  <li>{t("faq_quality_content_5")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>{t("faq_law")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">{t("faq_law_content_1")}</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>{t("faq_law_content_2")}</li>
                  <li>{t("faq_law_content_3")}</li>
                  <li>{t("faq_law_content_4")}</li>
                  <li>{t("faq_law_content_5")}</li>
                  <li>{t("faq_law_content_6")}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>{t("faq_unable")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">{t("faq_unable_content_1")}</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>{t("faq_unable_content_2")}</li>
                  <li>{t("faq_unable_content_3")}</li>
                  <li>{t("faq_unable_content_4")}</li>
                  <li>{t("faq_unable_content_5")}</li>
                  <li>{t("faq_unable_content_6")}</li>
                </ul>
                <p>{t("faq_unable_content_7")}</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>{t("faq_other")}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3">{t("faq_other_content_1")}</p>
                <ul className="list-disc list-inside my-3 ml-2 space-y-2">
                  <li>{t("faq_other_content_2")}</li>
                  <li>{t("faq_other_content_3")}</li>
                  <li>{t("faq_other_content_4")}</li>
                  <li>{t("faq_other_content_5")}</li>
                  <li>{t("faq_other_content_6")}</li>
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