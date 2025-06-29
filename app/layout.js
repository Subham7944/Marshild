import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css'
import ConditionalHeader from '../components/ConditionalHeader'
import ThemeToggle from '../components/ThemeToggle'
import { ThemeProvider } from '../components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'Marshild – Validate Your Startup Idea',
  description: 'Instantly validate your startup idea with AI-powered SWOT, market fit, and risk analysis.',
  keywords: 'startup validation, AI startup, idea validation, SWOT analysis, market fit',
  openGraph: {
    title: 'Marshild – Validate Your Startup Idea',
    description: 'Instantly validate your startup idea with AI-powered SWOT, market fit, and risk analysis.',
    url: 'https://marshild.com',
    siteName: 'Marshild',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Marshild',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${inter.className} bg-background text-gray-900 transition-colors duration-300`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ConditionalHeader />
            {children}
            <ThemeToggle />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
