import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
} 