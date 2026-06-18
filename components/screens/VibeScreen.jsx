'use client'

import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

const VIBES = [
  { mood: 'Contemplative', hint: 'Quiet, unhurried, deep' },
  { mood: 'Effervescent', hint: 'Bright, awake, alive' },
  { mood: 'Romantic', hint: 'Warm, intimate, soft' },
  { mood: 'Restorative', hint: 'Calm, grounded, herbal' },
  { mood: 'Celebratory', hint: 'Rich, indulgent, rare' },
]

export default function VibeScreen({ onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 1.02, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
      className="relative min-h-screen bg-[#F3F0EA]"
    >
      <header className="sticky top-0 z-30 bg-[#F3F0EA]/85 backdrop-blur-md border-b border-[#C5A880]/15">
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
            The Vibe
          </span>
          <div className="w-12" />
        </div>
      </header>

      <div className="px-6 pt-12 pb-24">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="h-px w-8 bg-[#C5A880]/60" />
          <span className="text-[9px] tracking-[0.55em] uppercase text-[#C5A880]" style={{ fontWeight: 500 }}>
            Tell us
          </span>
          <span className="h-px w-8 bg-[#C5A880]/60" />
        </div>

        <h1
          className="font-serif-display text-center text-5xl text-[#3E362E] leading-[1.02] tracking-tight"
          style={{ fontWeight: 400 }}
        >
          How do you{' '}
          <em className="font-serif-elegant italic text-[#8A9A8B]" style={{ fontStyle: 'italic', fontWeight: 300 }}>
            feel
          </em>{' '}
          this hour?
        </h1>

        <p className="mt-6 text-center text-[#3E362E]/65 text-sm max-w-xs mx-auto leading-relaxed" style={{ fontWeight: 300 }}>
          Choose a mood. We will compose something in quiet harmony with it.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-3">
          {VIBES.map((v, idx) => (
            <motion.button
              key={v.mood}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + idx * 0.07, duration: 0.7, ease: EASE }}
              className="group relative w-full overflow-hidden rounded-2xl bg-[#FAF9F6] border border-[#C5A880]/20 px-6 py-5 text-left transition-all duration-500 hover:border-[#C5A880]/60 hover:shadow-[0_10px_40px_-15px_rgba(197,168,128,0.4)] active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="font-serif-display text-2xl text-[#3E362E] leading-tight"
                    style={{ fontWeight: 400 }}
                  >
                    {v.mood}
                  </div>
                  <div className="text-[9px] tracking-[0.35em] uppercase text-[#3E362E]/45 mt-1" style={{ fontWeight: 400 }}>
                    {v.hint}
                  </div>
                </div>
                <span className="text-[#C5A880] text-lg opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                  →
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-center gap-3">
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
