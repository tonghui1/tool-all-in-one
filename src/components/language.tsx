// components/Header.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function Language() {
  const [language, setLanguage] = useState("EN")

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 shadow-sm border-b">
      {/* 左边文字 */}
      <div className="text-xl font-bold">DownloadTwitter</div>

      {/* 右边语言切换 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{language}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLanguage("EN")}>English</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("中文")}>中文</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("日本語")}>日本語</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("Español")}>Español</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
