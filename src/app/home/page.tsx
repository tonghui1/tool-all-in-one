'use client'

import { Button } from "@/components/ui/button";
import { Image, Download, Code, FileType, MessageSquare, Video } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="pb-12">
      <div className="container mx-auto flex flex-col gap-10 w-full">
        {/* 图像工具组 */}
        <div className="relative rounded-xl dark:border bg-card text-card-foreground shadow px-4 pt-6 pb-6 mb-8 md:px-8 md:pt-9 md:pb-7 md:mb-12 w-full mt-8">
          <Button className="absolute -top-5" id="image">
            <Image className="mr-2 h-5 w-5" />
            图像工具
          </Button>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="border bg-card text-card-foreground shadow rounded-lg">
              <Link 
                href="/watermark" 
                title="[图像水印工具]-通过添加自定义文本或标志水印保护您的图像"
                className="relative flex items-center space-x-4 rounded-md py-3 px-4 tracking-wide hover:bg-accent"
                target="_blank"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  width="24" 
                  height="24" 
                  strokeWidth="2" 
                  className="w-7 h-7"
                >
                  <title>texture</title>
                  <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                  <path d="M10 8v6a2 2 0 1 0 4 0v-6"></path>
                </svg>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium line-clamp-1">图像水印工具</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">通过添加自定义文本或标志水印保护您的图像</div>
                </div>
              </Link>
            </div>
            <div className="border bg-card text-card-foreground shadow rounded-lg">
              <Link 
                href="/watermark-plus" 
                title="[高级图像水印工具]-使用基于画布的自定义选项进行专业水印处理"
                className="relative flex items-center space-x-4 rounded-md py-3 px-4 tracking-wide hover:bg-accent"
                target="_blank"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  className="w-7 h-7"
                >
                  <path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 16h-9v-6h9z"></path>
                </svg>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium line-clamp-1">高级图像水印工具</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">使用基于画布的自定义选项进行专业水印处理</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 开发者工具组 */}
        <div className="relative rounded-xl dark:border bg-card text-card-foreground shadow px-4 pt-6 pb-6 mb-8 md:px-8 md:pt-9 md:pb-7 md:mb-12 w-full">
          <Button className="absolute -top-5" id="dev-tools" variant="secondary">
            <Code className="mr-2 h-5 w-5" />
            开发者工具
          </Button>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="border bg-card text-card-foreground shadow rounded-lg">
              <Link 
                href="/tools/base64" 
                title="[Base64编码/解码器]-快速编码和解码文本数据"
                className="relative flex items-center space-x-4 rounded-md py-3 px-4 tracking-wide hover:bg-accent"
              >
                <FileType className="w-7 h-7" />
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium line-clamp-1">Base64编码/解码器</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">快速编码和解码文本数据</div>
                </div>
              </Link>
            </div>
            <div className="border bg-card text-card-foreground shadow rounded-lg">
              <Link 
                href="/tools/timestamp" 
                title="[时间戳转换器]-在不同时间格式之间轻松转换"
                className="relative flex items-center space-x-4 rounded-md py-3 px-4 tracking-wide hover:bg-accent"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-7 h-7"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium line-clamp-1">时间戳转换器</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">在不同时间格式之间轻松转换</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 媒体工具组 */}
        <div className="relative rounded-xl dark:border bg-card text-card-foreground shadow px-4 pt-6 pb-6 mb-8 md:px-8 md:pt-9 md:pb-7 md:mb-12 w-full">
          <Button className="absolute -top-5" id="media" variant="destructive">
            <Video className="mr-2 h-5 w-5" />
            媒体下载
          </Button>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="border bg-card text-card-foreground shadow rounded-lg">
              <Link 
                href="/media/twitter" 
                title="[Twitter视频下载]-一键保存Twitter视频到本地设备"
                className="relative flex items-center space-x-4 rounded-md py-3 px-4 tracking-wide hover:bg-accent"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-7 h-7"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium line-clamp-1">Twitter视频下载</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">一键保存Twitter视频到本地设备</div>
                </div>
              </Link>
            </div>
            <div className="border bg-card text-card-foreground shadow rounded-lg">
              <Link 
                href="/media/bilibili" 
                title="[B站视频下载]-轻松下载B站视频和音频"
                className="relative flex items-center space-x-4 rounded-md py-3 px-4 tracking-wide hover:bg-accent"
              >
                <svg viewBox="0 0 1024 1024" width="24" height="24" className="w-7 h-7">
                  <path d="M306.005333 117.632L444.330667 256h135.296l138.368-138.325333a42.666667 42.666667 0 0 1 60.373333 60.373333L700.330667 256H789.333333A149.333333 149.333333 0 0 1 938.666667 405.333333v341.333334a149.333333 149.333333 0 0 1-149.333334 149.333333h-554.666666A149.333333 149.333333 0 0 1 85.333333 746.666667v-341.333334A149.333333 149.333333 0 0 1 234.666667 256h88.96L245.632 177.962667a42.666667 42.666667 0 0 1 60.373333-60.373334zM789.333333 341.333333h-554.666666a64 64 0 0 0-63.701334 57.856L170.666667 405.333333v341.333334a64 64 0 0 0 57.856 63.701333L234.666667 810.666667h554.666666a64 64 0 0 0 63.701334-57.856L853.333333 746.666667v-341.333334A64 64 0 0 0 789.333333 341.333333zM341.333333 469.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333a42.666667 42.666667 0 0 1-85.333333 0v-85.333333a42.666667 42.666667 0 0 1 42.666666-42.666667z m341.333334 0a42.666667 42.666667 0 0 1 42.666666 42.666667v85.333333a42.666667 42.666667 0 0 1-85.333333 0v-85.333333a42.666667 42.666667 0 0 1 42.666667-42.666667z" 
                  fill="currentColor">
                  </path>
                </svg>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium line-clamp-1">B站视频下载</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">轻松下载B站视频和音频</div>
                </div>
              </Link>
            </div>
            <div className="border bg-card text-card-foreground shadow rounded-lg">
              <Link 
                href="/media/youtube" 
                title="[YouTube视频下载]-高质量下载YouTube视频"
                className="relative flex items-center space-x-4 rounded-md py-3 px-4 tracking-wide hover:bg-accent"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  className="w-7 h-7"
                >
                  <path fill="currentColor" d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73Z"></path>
                </svg>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium line-clamp-1">YouTube视频下载</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">高质量下载YouTube视频</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 内容生成器组 */}
        <div className="relative rounded-xl dark:border bg-card text-card-foreground shadow px-4 pt-6 pb-6 md:px-8 md:pt-9 md:pb-7 md:mb-12 w-full">
          <Button className="absolute -top-5" id="content-generator" variant="default">
            <MessageSquare className="mr-2 h-5 w-5" />
            内容生成器
          </Button>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="border bg-card text-card-foreground shadow rounded-lg">
              <Link 
                href="/generator/en-name" 
                title="[英文名生成]-快速生成适合您的英文名称"
                className="relative flex items-center space-x-4 rounded-md py-3 px-4 tracking-wide hover:bg-accent"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-7 h-7"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium line-clamp-1">英文名生成</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">快速生成适合您的英文名称</div>
                </div>
              </Link>
            </div>
            <div className="border bg-card text-card-foreground shadow rounded-lg">
              <Link 
                href="/generator/xiaohongshu" 
                title="[小红书文案生成器]-一键生成吸引人的小红书风格文案"
                className="relative flex items-center space-x-4 rounded-md py-3 px-4 tracking-wide hover:bg-accent"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-7 h-7"
                >
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                </svg>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium line-clamp-1">小红书文案生成器</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">一键生成吸引人的小红书风格文案</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  