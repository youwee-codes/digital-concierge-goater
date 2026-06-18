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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#FAF9F6] text-[#3E362E]">
        {children}
      </body>
    </html>
  )
}
