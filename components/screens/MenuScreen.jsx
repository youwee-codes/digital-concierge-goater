'use client'

import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

const CATEGORIES = [
  { kicker: 'I.', name: 'Pour-Overs', count: 'Six selections' },
  { kicker: 'II.', name: 'Espresso & Milk', count: 'Eight selections' },
  { kicker: 'III.', name: 'Cold Brews', count: 'Four selections' },
  { kicker: 'IV.', name: 'Tisanes & Tea', count: 'Twelve selections' },
  { kicker: 'V.', name: 'Patisserie', count: 'Daily selection' },
  { kicker: 'VI.', name: 'Reserve', count: 'By invitation' },
]

export default function MenuScreen({ onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 1.02, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
      className="relative min-h-screen bg-[#FAF9F6]"
    >
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FAF9F6]/85 backdrop-blur-md border-b border-[#C5A880]/15">
        <div className="flex items-center justify-between px-5 py-5">
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2 text-[#3E362E]/70 hover:text-[#3E362E] transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-[9px] tracking-[0.4em] uppercase" style={{ fontWeight: 400 }}>
              Back
            </span>
          </button>
          <span className="text-[9px] tracking-[0.5em] uppercase text-[#C5A880]" style={{ fontWeight: 500 }}>
            The Menu
          </span>
          <div className="w-12" />
        </div>
      </header>

      <div className="px-6 pt-12 pb-24">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="h-px w-8 bg-[#C5A880]/60" />
          <span className="text-[9px] tracking-[0.55em] uppercase text-[#C5A880]" style={{ fontWeight: 500 }}>
            The Carte
          </span>
          <span className="h-px w-8 bg-[#C5A880]/60" />
        </div>

        <h1
          className="font-serif-display text-center text-5xl text-[#3E362E] leading-[1.02] tracking-tight"
          style={{ fontWeight: 400 }}
        >
          Curated{' '}
          <em className="font-serif-elegant italic text-[#8A9A8B]" style={{ fontStyle: 'italic', fontWeight: 300 }}>
            Selections
          </em>
        </h1>

        <p className="mt-6 text-center text-[#3E362E]/65 text-sm max-w-xs mx-auto leading-relaxed" style={{ fontWeight: 300 }}>
          A quiet anthology of beans, leaves, and slow-pressed creations.
        </p>

        {/* Categories */}
        <ul className="mt-14 space-y-0">
          {CATEGORIES.map((cat, idx) => (
            <motion.li
              key={cat.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + idx * 0.07, duration: 0.7, ease: EASE }}
              className="group relative"
            >
              <button className="w-full flex items-center justify-between py-6 border-b border-[#3E362E]/10 hover:border-[#C5A880]/50 transition-all">
                <div className="flex items-baseline gap-4 text-left">
                  <span className="font-serif-elegant italic text-xs text-[#C5A880] w-6" style={{ fontWeight: 400 }}>
                    {cat.kicker}
                  </span>
                  <div>
                    <div
                      className="font-serif-display text-2xl text-[#3E362E] leading-tight transition-transform duration-500 group-hover:translate-x-1"
                      style={{ fontWeight: 400 }}
                    >
                      {cat.name}
                    </div>
                    <div className="text-[9px] tracking-[0.35em] uppercase text-[#3E362E]/45 mt-1" style={{ fontWeight: 400 }}>
                      {cat.count}
                    </div>
                  </div>
                </div>
                <span className="text-[#C5A880] text-lg opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                  →
                </span>
              </button>
            </motion.li>
          ))}
        </ul>

        <div className="mt-20 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#3E362E]/15" />
          <span className="text-[9px] tracking-[0.5em] uppercase text-[#3E362E]/40" style={{ fontWeight: 400 }}>
            ❦
          </span>
          <span className="h-px w-10 bg-[#3E362E]/15" />
        </div>
      </div>
    </motion.div>
  )
}
