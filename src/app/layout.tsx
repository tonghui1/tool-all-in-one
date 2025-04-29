// app/layout.tsx
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import ThemeProvider from "@/components/theme/theme-provider"
import "./globals.css" // 如果有全局样式的话

export const metadata = {
  title: "tool",
  description: "tool all in one",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SidebarProvider>
          <AppSidebar />
          <Header />
          <main className="flex-grow pt-14 bg-background">
            {children}
            <Footer />
          </main>
        </SidebarProvider>
       </ThemeProvider>
      </body>
    </html>
  )
}
