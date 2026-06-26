'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

export default function FloatingCart({ onOpenCart }) {
  const { totalItems } = useCart()

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-8 left-0 right-0 z-[100] px-6 pointer-events-none"
        >
          <div className="max-w-md mx-auto">
            <button
              onClick={onOpenCart}
              // ✨ THE 24K UPGRADE:
              // Shifted from yellow/brass to deep amber/honey gold.
              className="relative w-full pointer-events-auto flex items-center justify-center gap-3 bg-gradient-to-b from-[#F9D976] via-[#E5A93C] to-[#B07D12] text-[#3E362E] px-6 py-3.5 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_10px_25px_rgba(229,169,60,0.35)] border border-[#FCECA5]/80 transition-transform active:scale-95 overflow-hidden"
            >
              {/* Glassy diagonal shine flare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

              <span className="flex items-center justify-center bg-[#3E362E] text-[#F9D976] w-5 h-5 rounded-full text-[10px] font-bold z-10 shadow-inner">
                {totalItems}
              </span>
              
              <span className="text-[10px] tracking-[0.3em] uppercase font-bold mt-0.5 z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                View Collection
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}