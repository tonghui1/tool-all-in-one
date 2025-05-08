"use client"
// components/header.tsx
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Globe } from "lucide-react"
import { toast, Toaster } from "sonner"
import ThemeToggle from "@/components/theme/theme-toggle"
import { useTranslations, useLocale } from "next-intl"
import intlConfig from '@/../next-intl.config';

// 从配置文件导入支持的语言列表
const supportedLocalesCodes = intlConfig.locales;

// 构建带有显示名称的语言列表
const supportedLocales = supportedLocalesCodes.map(code => {
  // 根据语言代码返回对应的显示名称
  switch(code) {
    case 'en': return { code, name: 'English' };
    case 'zh-CN': return { code, name: '简体中文' };
    case 'zh-TW': return { code, name: '繁體中文' };
    case 'ja': return { code, name: '日本語' };
    case 'ko': return { code, name: '한국어' };
    case 'fr': return { code, name: 'Français' };
    case 'de': return { code, name: 'Deutsch' };
    case 'es': return { code, name: 'Español' };
    case 'ru': return { code, name: 'Русский' };
    case 'ar': return { code, name: 'العربية' };
    case 'pt': return { code, name: 'Português' };
    case 'it': return { code, name: 'Italiano' };
    default: return { code, name: code };
  }
});

// 定义导航项和关键词
const navigationItems = [
  {
    path: "/time",
    keywords: ["时间", "world time", "time", "time zone", "时区", "世界时间", "全球时间"]
  },
  {
    path: "/ip",
    keywords: ["ip", "IP地址", "IP查询", "ip lookup", "网络", "地址", "ip地址"]
  },
  {
    path: "/json",
    keywords: ["json", "json解析", "JSON格式化", "json格式", "格式化", "json formatter", "格式"]
  },
  {
    path: "/twitter",
    keywords: ["twitter", "推特", "推特下载", "推特视频", "twitter下载", "twitter视频", "x平台", "x"]
  },
  {
    path: "/youtube",
    keywords: ["youtube", "油管", "YouTube下载", "视频下载", "YouTube视频", "ytb", "yt"]
  },
  {
    path: "/bilibili",
    keywords: ["bilibili", "b站", "哔哩哔哩", "B站下载", "bilibili下载", "哔哩哔哩下载", "bili"]
  }
]

export function Header() {
  const { open } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const t = useTranslations("Header")
  
  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchTerm.trim()) return
    
    const input = searchTerm.trim().toLowerCase()
    
    // 为每个导航项计算匹配度
    let bestMatch = { path: "", score: 0 }
    
    for (const item of navigationItems) {
      // 检查完全匹配
      const exactMatch = item.keywords.some(keyword => 
        keyword.toLowerCase() === input
      )
      
      if (exactMatch) {
        bestMatch = { path: item.path, score: 100 }
        break
      }
      
      // 检查包含关系
      const partialMatches = item.keywords.filter(keyword => 
        keyword.toLowerCase().includes(input) || input.includes(keyword.toLowerCase())
      )
      
      if (partialMatches.length > 0) {
        // 计算最佳匹配得分 (匹配关键词长度越接近输入长度，得分越高)
        const bestPartialMatch = partialMatches.reduce((best, current) => {
          const currentScore = Math.min(current.length, input.length) / 
                               Math.max(current.length, input.length) * 100
          return currentScore > best.score ? { keyword: current, score: currentScore } : best
        }, { keyword: "", score: 0 })
        
        if (bestPartialMatch.score > bestMatch.score) {
          bestMatch = { path: item.path, score: bestPartialMatch.score }
        }
      }
    }
    
    // 如果找到匹配项，跳转到对应页面
    if (bestMatch.score > 0) {
      // 保持当前语言，添加到路径
      router.push(`/${currentLocale}${bestMatch.path}`)
      setSearchTerm("")
    } else {
      toast.error(t("no_match_found"))
    }
  }
  
  // 处理语言切换
  const handleLanguageChange = (locale: string) => {
    // 从当前路径中提取出不包含语言代码的部分
    let pathWithoutLocale = pathname
    
    for (const { code } of supportedLocales) {
      if (pathname.startsWith(`/${code}/`) || pathname === `/${code}`) {
        pathWithoutLocale = pathname.substring(code.length + 1) || '/'
        break
      }
    }
    
    // 构建新路径
    const newPath = pathWithoutLocale === '/' ? `/${locale}` : `/${locale}${pathWithoutLocale}`
    
    // 关闭语言菜单
    setShowLanguageMenu(false)
    
    // 导航到新路径
    router.push(newPath)
  }

  // 点击外部关闭语言菜单
  useEffect(() => {
    const handleClickOutside = () => {
      setShowLanguageMenu(false)
    }

    if (showLanguageMenu) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showLanguageMenu])
  
  // 获取当前语言名称
  const currentLanguageName = supportedLocales.find(l => l.code === currentLocale)?.name || 'English'
  
  return (
    <>
      <header className={`fixed top-0 ${open ? "left-64" : "left-0"} right-0 h-14 bg-background border-b flex items-center justify-between px-4 z-50`}>
        <div className="flex items-center gap-2 w-1/2 pl-2">
          <SidebarTrigger />
          <form onSubmit={handleSearch} className="w-full flex">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t("placeholder")}
                className="border px-3 py-1 pl-8 rounded-md text-sm w-full bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-1.5 h-4 w-4 text-muted-foreground" />
            </div>
            <button 
              type="submit"
              className="ml-2 px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
            >
              {t("query")}
            </button>
          </form>
        </div>  
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowLanguageMenu(!showLanguageMenu);
              }} 
              className="flex items-center gap-1 border px-3 py-1.5 rounded-md text-sm bg-background hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <Globe className="h-4 w-4 mr-1" />
              <span>{currentLanguageName}</span>
            </button>
            
            {showLanguageMenu && (
              <div 
                className="absolute right-0 mt-1 py-1 w-40 bg-background border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {supportedLocales.map((locale) => (
                  <button
                    key={locale.code}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors cursor-pointer ${
                      currentLocale === locale.code ? 'bg-muted/20 font-medium' : ''
                    }`}
                    onClick={() => handleLanguageChange(locale.code)}
                  >
                    {locale.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
      <Toaster position="top-center" richColors />
    </>
  )
}
