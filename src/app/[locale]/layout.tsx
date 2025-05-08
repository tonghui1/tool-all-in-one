// app/[locale]/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import ThemeProvider from "@/components/theme/theme-provider"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import intlConfig from '@/../next-intl.config';
import '../globals.css';

const { locales, defaultLocale } = intlConfig;

export const metadata = {
  title: "tool",
  description: "tool all in one",
}

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { children, params } = props;
  const locale = params.locale;

  // 检查locale是否合法
  if (!locales.includes(locale)) {
    console.log(`不支持的语言: ${locale}，默认使用: ${defaultLocale}`);
    notFound();
  }
  
  // 简化消息获取逻辑
  try {
    const messages = await getMessages({ locale });
    
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SidebarProvider>
            <AppSidebar />
            <Header />
            <main className="flex flex-col w-full min-h-screen pt-14 bg-background">
              {children}
              <Footer />
            </main>
          </SidebarProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    )
  } catch (error) {
    console.error(`加载 ${locale} 语言消息出错:`, error);
    notFound();
  }
}
