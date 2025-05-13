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
import { useTranslations, useLocale, useFormatter } from "next-intl";

// 定义时区类型
interface TimeZone {
  name: string;
  zone: string;
  label: string;
}

// 定义常用时区
const timeZones: TimeZone[] = [
  { name: "beijing", zone: "Asia/Shanghai", label: "北京" },
  { name: "tokyo", zone: "Asia/Tokyo", label: "东京" },
  { name: "new_york", zone: "America/New_York", label: "纽约" },
  { name: "london", zone: "Europe/London", label: "伦敦" },
  { name: "paris", zone: "Europe/Paris", label: "巴黎" },
  { name: "sydney", zone: "Australia/Sydney", label: "悉尼" },
];

// 根据时区获取城市名
const getCityByTimeZone = (userTimeZone: string): TimeZone => {
  const found = timeZones.find(tz => tz.zone === userTimeZone);
  if (found) return found;
  
  const region = userTimeZone.split('/')[0];
  if (region) {
    const regionMatch = timeZones.find(tz => tz.zone.startsWith(`${region}/`));
    if (regionMatch) return regionMatch;
  }
  
  return timeZones[0];
};

export default function Time() {
  const t = useTranslations("Time");
  const locale = useLocale();
  const format = useFormatter();
  
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [selectedZone, setSelectedZone] = useState<TimeZone | null>(null);

  useEffect(() => {
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const defaultZone = getCityByTimeZone(userTimeZone);
      setSelectedZone(defaultZone);
    } catch {
      setSelectedZone(timeZones[0]);
    }
  }, []);
  
  useEffect(() => {
    if (!selectedZone) return;
    
    const updateTime = () => {
      const now = new Date();
      
      try {
        // 使用 next-intl 的格式化函数
        const timeString = format.dateTime(now, {
          timeZone: selectedZone.zone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: locale === 'en',
        });

        const dateString = format.dateTime(now, {
          timeZone: selectedZone.zone,
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        });
        
        setCurrentTime(timeString);
        setCurrentDate(dateString);
      } catch {
        // 忽略错误
      }
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [selectedZone, locale, format]);

  if (!selectedZone) {
    return <div className="min-h-screen flex items-center justify-center">{t("loading")}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <nav className="w-full bg-primary text-primary-foreground py-4 px-8 flex justify-center">
        <div className="container flex items-center justify-between">
          <h1 className="text-xl font-bold">{t("title")}</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">
                {t(`timezones.${selectedZone.name}`)} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {timeZones.map((tz) => (
                <DropdownMenuItem 
                  key={tz.zone}
                  onClick={() => setSelectedZone(tz)}
                  className={selectedZone.zone === tz.zone ? "bg-accent" : ""}
                >
                  {t(`timezones.${tz.name}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="text-9xl font-mono font-bold tracking-tighter">
          {currentTime}
        </div>
        <div className="text-xl mt-6 text-muted-foreground">
          {currentDate}
        </div>
      </main>
      
      <footer className="w-full py-4 text-center text-sm text-muted-foreground">
        {t("footer")}
      </footer>
    </div>
  );
}
