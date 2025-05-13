"use client";

import { Button } from "@/components/ui/button"
import Link from "next/link";
import {
  Card
} from "@/components/ui/card"
import { Inbox, Timer, FileJson} from "lucide-react"
import { CiTwitter , CiYoutube } from 'react-icons/ci';
import { TbBrandBilibili } from "react-icons/tb";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Tool All In One
        </h1>
        <p className="text-sm text-muted-foreground">
        {t("sub_title")}
        </p>

        <div className="relative w-full">
          <Button className="absolute top-0 left-8 transform -translate-y-1/2">
          {t("develop")}
          </Button>
          <div className="grid grid-cols-4 gap-4 p-8 shadow-md rounded-lg">
            <Card className="p-0 overflow-hidden">
              <Link
                href="/time"
                title={t("sub_title")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <Timer className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                  {t("time")}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {t("time_describe")}
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="p-0 overflow-hidden">
              <Link
                href="/ip"
                title={t("ip")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <Inbox className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                  {t("ip")}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                  {t("ip_describe")}
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="p-0 overflow-hidden">
              <Link
                href="/json"
                title={t("json")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <FileJson className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                  {t("json")}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                  {t("json_describe")}
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>

        <div className="relative w-full">
          <Button className="absolute top-0 left-8 transform -translate-y-1/2">
          {t("video")}
          </Button>
          <div className="grid grid-cols-4 gap-4 p-8 shadow-md rounded-lg">
            <Card className="p-0 overflow-hidden">
              <Link
                href="/twitter"
                title={t("twitter_describe")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <CiTwitter className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                  {t("twitter")}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                  {t("twitter_describe")}
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="p-0 overflow-hidden">
              <Link
                href="/youtube"
                title={t("youtube_describe")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <CiYoutube className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                    {t("youtube")}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                  {t("youtube_describe")}
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="p-0 overflow-hidden">
              <Link
                href="/bilibili"
                title={t("bilibili_describe")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 px-4 py-3 hover:bg-accent transition-colors"
              >
                {/* 左侧图标 */}
                <TbBrandBilibili className="w-7 h-7 text-primary shrink-0" />

                {/* 右侧内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">
                  {t("bilibili")}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                  {t("bilibili_describe")}
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>

      </main>
      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer> */}
    </div>
  );
}
