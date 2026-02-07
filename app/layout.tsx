import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Poppins } from "next/font/google"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { EcosphereProvider } from "@/components/ecosphere-provider"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Ecosphere - Join the Movement for a Greener Future",
  description:
    "Interactive platform for environmental sustainability. Scan products, join events, earn rewards, and make a positive impact on our planet.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>
          <EcosphereProvider>{children}</EcosphereProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

