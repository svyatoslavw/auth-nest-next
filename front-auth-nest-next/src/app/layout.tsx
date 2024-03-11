import RootProvider from "@/components/providers/root-provider"
import { Inter } from "next/font/google"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
