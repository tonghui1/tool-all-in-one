import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className="bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
} 