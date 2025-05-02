import type React from "react"
import "./globals.css"
import "./pdf-styles.css"
import "./print-styles.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI-Powered Resume Builder",
  description: "Create tailored, ATS-friendly resumes with AI assistance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>{children}</body>
    </html>
  )
}
