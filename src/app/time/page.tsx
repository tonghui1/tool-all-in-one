"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

// 定义时区类型
interface TimeZone {
  name: string;
  zone: string;
}

// 定义常用时区
const timeZones: TimeZone[] = [
  { name: "北京", zone: "Asia/Shanghai" },
  { name: "东京", zone: "Asia/Tokyo" },
  { name: "纽约", zone: "America/New_York" },
  { name: "伦敦", zone: "Europe/London" },
  { name: "巴黎", zone: "Europe/Paris" },
  { name: "悉尼", zone: "Australia/Sydney" },
];

// 根据时区获取城市名
const getCityByTimeZone = (userTimeZone: string): TimeZone => {
  // 尝试匹配完整时区
  const found = timeZones.find(tz => tz.zone === userTimeZone);
  if (found) return found;
  
  // 尝试匹配时区前缀（例如 "Asia/Shanghai" 匹配 "Asia/"）
  const region = userTimeZone.split('/')[0];
  if (region) {
    const regionMatch = timeZones.find(tz => tz.zone.startsWith(`${region}/`));
    if (regionMatch) return regionMatch;
  }
  
  // 默认返回北京
  return timeZones[0];
};

export default function Time() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [selectedZone, setSelectedZone] = useState<TimeZone | null>(null);

  // 初始化用户时区
  useEffect(() => {
    // 获取用户当前时区
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const defaultZone = getCityByTimeZone(userTimeZone);
      setSelectedZone(defaultZone);
    } catch (error) {
      // 如果发生错误，默认使用北京时区
      setSelectedZone(timeZones[0]);
    }
  }, []);
  
  // 根据选择的时区更新时间
  useEffect(() => {
    // 如果时区未设置，不执行
    if (!selectedZone) return;
    
    const updateTime = () => {
      const now = new Date();
      
      try {
        // 格式化时间为选定时区
        const formatter = new Intl.DateTimeFormat("zh-CN", {
          timeZone: selectedZone.zone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        
        // 格式化日期 - 确保使用正确的时区
        const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
          timeZone: selectedZone.zone,
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        });
        
        setCurrentTime(formatter.format(now));
        setCurrentDate(dateFormatter.format(now));
      } catch (error) {
        console.error("格式化时间出错:", error);
      }
    };

    // 立即更新时间
    updateTime();
    
    // 每秒更新一次
    const intervalId = setInterval(updateTime, 1000);
    
    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [selectedZone]);

  // 如果时区未设置，显示加载中
  if (!selectedZone) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* 顶部导航栏 */}
      <nav className="w-full bg-primary text-primary-foreground py-4 px-8 flex justify-center">
        <div className="container flex items-center justify-between">
          <h1 className="text-xl font-bold">世界时间</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">
                {selectedZone.name} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {timeZones.map((tz) => (
                <DropdownMenuItem 
                  key={tz.zone}
                  onClick={() => setSelectedZone(tz)}
                  className={selectedZone.zone === tz.zone ? "bg-accent" : ""}
                >
                  {tz.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      
      {/* 主内容区 - 超大字号时间显示 */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-8">{selectedZone.name}时间</h2>
        <div className="text-9xl font-mono font-bold tracking-tighter">
          {currentTime}
        </div>
        <div className="text-xl mt-6 text-muted-foreground">
          {currentDate}
        </div>
      </main>
      
      {/* 底部信息 */}
      <footer className="w-full py-4 text-center text-sm text-muted-foreground">
        基于当地时区显示的精确时间
      </footer>
    </div>
  );
}
