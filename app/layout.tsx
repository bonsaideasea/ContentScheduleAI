import type React from "react"
import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Marchen&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
