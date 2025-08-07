import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import ThemeToggle from '../components/ThemeToggle'
import ConditionalClerkProvider from '../components/ConditionalClerkProvider'
import { StartupIdeaProvider } from '../contexts/StartupIdeaContext.jsx'

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
    <ConditionalClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-background dark:bg-darkbg text-gray-900 dark:text-white transition-colors duration-300`}>
          <StartupIdeaProvider>
            <Header />
            {children}
            <ThemeToggle />
          </StartupIdeaProvider>
        </body>
      </html>
    </ConditionalClerkProvider>
  )
}
