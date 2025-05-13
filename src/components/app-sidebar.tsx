'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Calendar, Home, Inbox, Timer, FileJson} from "lucide-react"
import { CiTwitter , CiYoutube } from 'react-icons/ci';
import { TbBrandBilibili } from "react-icons/tb";
import { useState } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl";

export function AppSidebar() {
  const t = useTranslations("Home");
  const locale = useLocale();
  
  // 使用国际化的分组项
  const groupedItems = [
    {
      label: t("develop"),
      icon: Home,
      children: [
        { title: t("time"), url: `/${locale}/time`, icon: Timer },
        { title: t("ip"), url: `/${locale}/ip`, icon: Inbox },
        { title: t("json"), url: `/${locale}/json`, icon: FileJson },
      ]
    },
    {
      label: t("video"),
      icon: Calendar,
      children: [
        { title: t("twitter"), url: `/${locale}/twitter`, icon: CiTwitter },
        { title: t("youtube"), url: `/${locale}/youtube`, icon: CiYoutube },
        { title: t("bilibili"), url: `/${locale}/bilibili`, icon: TbBrandBilibili },
      ]
    },
  ];

  return (
    <Sidebar className="w-64 border-r bg-sidebar text-sidebar-foreground">
      <SidebarContent className="space-y-2 p-2">
        <Link href={`/${locale}`} className="block hover:opacity-80 transition-opacity">
          <SidebarGroupLabel>Tool All In One</SidebarGroupLabel>
        </Link>
        {groupedItems.map((group, idx) => (
          <SidebarCollapsibleGroup key={idx} label={group.label} icon={<group.icon className="w-3.5 h-3.5 text-muted-foreground" />} items={group.children} />
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

function SidebarCollapsibleGroup({
  label,
  icon,
  items,
}: {
  label: string
  icon: React.ReactNode
  items: { title: string; url: string; icon: React.ElementType }[]
}) {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-2 hover:bg-muted rounded-md text-sm font-medium">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarGroupContent className="pl-6">
          <SidebarMenu>
            {items.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent text-sm"
                  >
                    <div className="w-3.5 h-3.5 text-muted-foreground">
                      <item.icon className="w-full h-full" />
                    </div>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </CollapsibleContent>
    </Collapsible>
  )
}
