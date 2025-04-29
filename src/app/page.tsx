// app/page.tsx
import { Button } from "@/components/ui/button"
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { FileText, PenTool } from "lucide-react"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Tool All In One
        </h1>
        <p className="text-sm text-muted-foreground">
          面向内容创作者、程序开发者的在线生产力工具集合
        </p>

        <div className="relative w-full">
          <Button className="absolute top-0 left-8 transform -translate-y-1/2">
            <PenTool /> 开发者工具
          </Button>
          <div className="grid grid-cols-4 gap-4 p-8 shadow-md rounded-lg">
            <Card className="p-0 overflow-hidden">
              <Link
                href="/time"
                title="世界时间"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <FileText className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                    世界时间
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    世界范围内各个时区的时间
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="p-0 overflow-hidden">
              <Link
                href="/ip"
                title="IP查询"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <FileText className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                    IP查询
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    查询IP地址信息
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="p-0 overflow-hidden">
              <Link
                href="/json"
                title="JSON解析"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <FileText className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                    JSON解析
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    JSON在线解析格式化验证
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>

        <div className="relative w-full">
          <Button className="absolute top-0 left-8 transform -translate-y-1/2">
            <PenTool /> 媒体下载器
          </Button>
          <div className="grid grid-cols-4 gap-4 p-8 shadow-md rounded-lg">
            <Card className="p-0 overflow-hidden">
              <Link
                href="/twitter"
                title="推特视频下载"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <FileText className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                  推特视频下载
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                  推特视频下载
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="p-0 overflow-hidden">
              <Link
                href="/youtube"
                title="YouTube视频下载"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <FileText className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                  YouTube视频下载
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                  YouTube视频下载
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="p-0 overflow-hidden">
              <Link
                href="/json"
                title="JSON解析"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <FileText className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                    JSON解析
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    JSON在线解析格式化验证
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
