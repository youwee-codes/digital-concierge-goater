'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

const vibes = [
  {
    id: 'v1',
    emoji: '🍔',
    title: 'Starving & Serious',
    subtitle: 'Heavy, comforting, and deeply satisfying.',
    items: [
      { id: 'm_sig2', title: 'The Signature Smash Burger', price: '₹499', diet: 'non-veg' },
      { id: 'm_sp1', title: 'Parmesan Truffle Fries', price: '₹299', diet: 'veg' }
    ]
  },
  {
    id: 'v2',
    emoji: '☕️',
    title: 'Coffee & Conversations',
    subtitle: 'Light sipping and sweet sharing.',
    items: [
      { id: 'm_sip1', title: 'The House Iced Latte', price: '₹280', diet: 'veg' },
      { id: 'm_bh2', title: 'Classic Basque Cheesecake', price: '₹450', diet: 'veg' }
    ]
  },
  {
    id: 'v3',
    emoji: '🍃',
    title: 'Light & Breezy',
    subtitle: 'Fresh, vibrant, and guilt-free.',
    items: [
      { id: 'm_mr1', title: 'Smashed Avocado Sourdough', price: '₹399', diet: 'veg' },
      { id: 'm_sip2', title: 'Fresh Peach Iced Tea', price: '₹250', diet: 'vegan' }
    ]
  }
]

export default function MatchMyVibe({ isOpen, onClose }) {
  const { addToCart } = useCart()
  const [selectedVibe, setSelectedVibe] = useState(null)

  const handleAddBundle = () => {
    selectedVibe.items.forEach(item => {
      addToCart({ ...item, quantity: 1 }) 
    })
    alert('Vibe added to your collection! ✨')
    onClose()
    setSelectedVibe(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[130]" />
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed bottom-0 left-0 right-0 z-[140] px-4 pb-6 pt-2 pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto bg-[#3E362E] rounded-[32px] shadow-2xl overflow-hidden flex flex-col p-6 text-[#FAF9F6]">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-[#C5A880]">Match My Vibe</h2>
                <button onClick={onClose} className="text-[#FAF9F6]/50 hover:text-[#FAF9F6]">✕</button>
              </div>

              {!selectedVibe ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-[#FAF9F6]/70 mb-2">How are you feeling right now?</p>
                  {vibes.map(vibe => (
                    <button key={vibe.id} onClick={() => setSelectedVibe(vibe)} className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF9F6]/5 border border-[#C5A880]/20 hover:bg-[#C5A880]/10 transition-colors text-left">
                      <span className="text-3xl">{vibe.emoji}</span>
                      <div>
                        <h3 className="font-serif text-lg text-[#C5A880]">{vibe.title}</h3>
                        <p className="text-[10px] text-[#FAF9F6]/60 tracking-wider uppercase">{vibe.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <button onClick={() => setSelectedVibe(null)} className="text-[10px] uppercase tracking-widest text-[#C5A880] mb-4">← Back to Vibes</button>
                  <h3 className="font-serif text-xl mb-4">We recommend:</h3>
                  <div className="flex flex-col gap-4 mb-8 bg-[#FAF9F6]/5 p-4 rounded-2xl border border-[#FAF9F6]/10">
                    {selectedVibe.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-sm">{item.title}</span>
                        <span className="text-[#C5A880] text-sm">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleAddBundle} className="w-full py-4 bg-[#C5A880] text-[#3E362E] rounded-full text-xs font-bold tracking-[0.2em] uppercase active:scale-95 transition-transform shadow-[0_0_20px_rgba(197,168,128,0.3)]">
                    Add Bundle to Cart
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}