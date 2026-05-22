import type { Metadata, Viewport } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'

import './globals.css'

const geist = Geist({
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ChefAI',
  description: 'AI-powered recipe generator',
}

export const viewport: Viewport = {
  themeColor: '#14121e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (

    <html lang="en" className="bg-background">

      <body
        className={`${geist.className} ${geistMono.className} antialiased`}
      >

        {children}

        {process.env.NODE_ENV === 'production' && (
          <Analytics />
        )}

      </body>

    </html>

  )

}