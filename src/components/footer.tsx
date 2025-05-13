"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { CiTwitter, CiMail } from 'react-icons/ci';
import { FaGithub } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const email = "472754759@qq.com"
  const t = useTranslations("Footer")
  const t2 = useTranslations("Home")

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault()
    toast.success(t("my_email"), {
      description: email,
      action: {
        label: t("copy"),
        onClick: () => {
          navigator.clipboard.writeText(email)
          toast.success(t("copy_success"))
        }
      },
      duration: 5000
    })
  }
  
  return (
    <footer className="w-full border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* 左侧 */}
          <div className="flex flex-col space-y-3">
            <h2 className="text-lg font-bold">Tool All In One</h2>
            <p className="text-sm text-gray-600 max-w-md">{t("describe")}</p>
            
            <div className="flex items-center space-x-3 mt-2">
              <Link 
                href="https://github.com/tonghui1/tool-all-in-one" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={18} />
              </Link>
              <Link 
                href="https://x.com/thom921104" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 transition-colors"
                aria-label="Twitter"
              >
                <CiTwitter size={18} />
              </Link>
              
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleEmailClick}
                      className="text-gray-600 hover:text-green-600 transition-colors"
                      aria-label="Email"
                    >
                      <CiMail size={18} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              © {currentYear} Tool All In One. All rights reserved.
            </p>
          </div>
          
          {/* 右侧 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold mb-2">{t2("develop")}</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/time" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {t2("time")}
                  </Link>
                </li>
                <li>
                  <Link href="/ip" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {t2("ip")}
                  </Link>
                </li>
                <li>
                  <Link href="/json" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {t2("json")}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold mb-2">{t2("video")}</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/twitter" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {t2("twitter")}
                  </Link>
                </li>
                <li>
                  <Link href="/youtube" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {t2("youtube")}
                  </Link>
                </li>
                <li>
                  <Link href="/bilibili" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {t2("bilibili")}
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* <div className="space-y-2">
              <h3 className="text-sm font-semibold mb-2">关于</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1" />
                    <span>关于我们</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                    <Shield className="w-3.5 h-3.5 mr-1" />
                    <span>隐私政策</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                    <Shield className="w-3.5 h-3.5 mr-1" />
                    <span>服务条款</span>
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                    <HelpCircle className="w-3.5 h-3.5 mr-1" />
                    <span>帮助中心</span>
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            {t("law")}
          </p>
          {/* <div className="flex space-x-4 mt-3 md:mt-0">
            <Link href="https://example1.com" className="text-xs text-gray-500 hover:text-gray-700">
              友情链接1
            </Link>
            <Link href="https://example2.com" className="text-xs text-gray-500 hover:text-gray-700">
              友情链接2
            </Link>
            <Link href="https://example3.com" className="text-xs text-gray-500 hover:text-gray-700">
              友情链接3
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  )
} 