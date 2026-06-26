'use client'

import { useState } from 'react'
import HeroScreen from '@/components/screens/HeroScreen'
import MenuScreen from '@/components/screens/MenuScreen'
import VibeScreen from '@/components/screens/VibeScreen' // ✨ 1. Imported the new Vibe Screen
import { CartProvider } from '@/context/CartContext' 

export default function Page() {
  const [screen, setScreen] = useState('hero')

  // The Raw, Unfiltered Native Swap
  const navigate = (next) => {
    // ✨ Safety catch: If a component asks for 'home', route it to 'hero'
    const targetScreen = next === 'home' ? 'hero' : next;

    if (targetScreen === screen) return
    
    // 1. Instantly snap the scrollbar to the top
    window.scrollTo({ top: 0, behavior: 'instant' })
    
    // 2. Instantly swap the React component
    setScreen(targetScreen)
  }

  return (
    /* 🧠 Wrapped the main router directly so all screens share the same memory */
    <CartProvider>
      <main className="bg-[#FAF9F6] min-h-screen">
        {screen === 'hero' && <HeroScreen onNavigate={navigate} />}
        {screen === 'menu' && <MenuScreen onNavigate={navigate} />}
        
        {/* ✨ 2. Added the Vibe Screen route */}
        {screen === 'vibe' && <VibeScreen onNavigate={navigate} />}
      </main>
    </CartProvider>
  )
}