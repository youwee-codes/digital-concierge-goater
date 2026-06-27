import { Playfair_Display, Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Maison — The Experience',
  description: 'An ultra-luxury digital concierge experience',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased bg-black text-[#3E362E] min-h-screen" suppressHydrationWarning>
        {/* Desktop ambient backdrop — only visible behind the mobile frame */}
        <div className="fixed inset-0 -z-10 hidden md:block" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, #1a1612 0%, #0a0807 55%, #000 100%)',
            }}
          />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #C5A880 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }} />
        </div>

        {/* The mobile frame — strict 9:16 feel, centered, full width on mobile */}
        <div className="relative mx-auto w-full max-w-md min-h-screen bg-[#FAF9F6] md:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(197,168,128,0.08)] md:my-4 md:rounded-[28px] overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}