"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export default function Login() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone, password }),
            });
        
            const data = await res.json();
        
            if (!res.ok) {
              alert(data.error || "登录失败");
              return;
            }
        
            alert("登录成功");
            router.push("/home");
          } catch (error) {
            console.error("登录请求失败:", error);
            alert("水水水水水水");
          }

        console.log("登录信息:", { phone, password });
        router.push("/home"); // 登录成功后跳转到首页
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-2xl">登录</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="phone">手机号</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  登录
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )
}