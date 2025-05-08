// app/api/parse/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { url } = await req.json()

  // 简化：这里你应该替换成你自己的解析逻辑
  if (!url || !url.includes("twitter.com")) {
    return NextResponse.json({ message: "链接无效" }, { status: 400 })
  }

  // 模拟解析后的下载地址（你实际应解析后返回真实链接）
  const downloadUrl = "https://example.com/twitter_video.mp4"

  return NextResponse.json({ downloadUrl })
}
