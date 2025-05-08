import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req:Request){
    try {
        //接收参数
        const {phone,password} = await req.json();
        //检查手机号和密码是否存在
        if(!phone || !password){
            return NextResponse.json({error:"手机号或密码不存在"},{status:400});
        }
        //查询数据 
        const user = await prisma.user.findUnique({
            where:{phone},
        });
        if (!user) {
            return NextResponse.json({ error: "用户不存在" }, { status: 404 });
        }
        //校验密码（假设数据库里存的是 bcrypt 加密的密码）
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: "密码错误" }, { status: 401 });
        }

        // 登录成功
        return NextResponse.json({ message: "登录成功", user: { user_id: user.user_id, phone: user.nickname } });
    } catch (error: any) {
        console.error("我的服务器错误:", error);
        return NextResponse.json({ error: "服务端错误", details: error.message }, { status: 500 });
    }
}