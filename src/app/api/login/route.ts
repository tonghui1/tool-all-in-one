import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    // 查询 tl_tool 表的所有数据
    const tools = await prisma.tl_tool.findMany()

    // 返回查询结果
    return NextResponse.json(tools)
  } catch (error) {
    console.error("Error fetching tools: ", error)
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
  } finally {
    // 关闭 Prisma Client 连接
    await prisma.$disconnect()
  }
}
