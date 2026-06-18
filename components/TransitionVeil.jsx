'use client'

import { motion, AnimatePresence } from 'framer-motion'

const EASE_IN = [0.7, 0, 0.3, 1]
const EASE_OUT = [0.16, 1, 0.3, 1]

/**
 * A luxurious two-stage veil:
 *  1. Walnut panel rises from below, covering the screen (with a champagne shimmer line at its leading edge)
 *  2. After a brief hold, the panel exits upward, revealing the new screen
 */
export default function TransitionVeil({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="veil"
          className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Walnut panel */}
          <motion.div
            className="absolute inset-0"
            initial={{ y: '100%' }}
            animate={{ y: ['100%', '0%', '0%', '-100%'] }}
            transition={{
              duration: 1.6,
              times: [0, 0.4, 0.55, 1],
              ease: EASE_IN,
            }}
            style={{
              background:
                'linear-gradient(180deg, #2c2620 0%, #3E362E 50%, #2c2620 100%)',
            }}
          />

          {/* Champagne shimmer line at the leading edge */}
          <motion.div
            className="absolute left-0 right-0 h-[2px]"
            initial={{ y: '100vh' }}
            animate={{ y: ['100vh', '0vh', '0vh', '-100vh'] }}
            transition={{
              duration: 1.6,
              times: [0, 0.4, 0.55, 1],
              ease: EASE_IN,
            }}
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, #C5A880 20%, #E9D9BC 50%, #C5A880 80%, transparent 100%)',
              boxShadow: '0 0 30px rgba(197, 168, 128, 0.8), 0 0 60px rgba(197, 168, 128, 0.4)',
            }}
          />

          {/* Maison wordmark briefly visible during the hold */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{
              duration: 1.6,
              times: [0, 0.38, 0.45, 0.55, 0.62],
              ease: EASE_OUT,
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="h-px w-10 bg-[#C5A880]/70" />
              <span
                className="text-[10px] tracking-[0.6em] uppercase text-[#C5A880]"
                style={{ fontWeight: 400 }}
              >
                Maison
              </span>
              <span className="h-px w-10 bg-[#C5A880]/70" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
