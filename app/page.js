'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import HeroScreen from '@/components/screens/HeroScreen'
import MenuScreen from '@/components/screens/MenuScreen'
import VibeScreen from '@/components/screens/VibeScreen'
import TransitionVeil from '@/components/TransitionVeil'

export default function Page() {
  const [screen, setScreen] = useState('hero')
  const [veilActive, setVeilActive] = useState(false)

  // Orchestrated navigation: veil up → swap screen → veil down
  const navigate = useCallback(
    (next) => {
      if (next === screen) return
      setVeilActive(true)
      // Swap screens right after the veil fully covers (~40% of 1.6s = 640ms)
      window.setTimeout(() => {
        setScreen(next)
        window.scrollTo({ top: 0, behavior: 'auto' })
      }, 640)
      // Drop the veil node after the full sequence
      window.setTimeout(() => {
        setVeilActive(false)
      }, 1700)
    },
    [screen]
  )

  // Lock scroll while the veil is fully covering
  useEffect(() => {
    if (veilActive) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [veilActive])

  return (
    <>
      <AnimatePresence mode="wait">
        {screen === 'hero' && <HeroScreen key="hero" onNavigate={navigate} />}
        {screen === 'menu' && <MenuScreen key="menu" onNavigate={navigate} />}
        {screen === 'vibe' && <VibeScreen key="vibe" onNavigate={navigate} />}
      </AnimatePresence>
      <TransitionVeil active={veilActive} />
    </>
  )
}
