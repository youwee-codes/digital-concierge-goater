'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import CheckoutDrawer from '@/components/ui/CheckoutDrawer'

// 1. THE MOODS (Step 1)
const moods = [
  { id: 'm_date', emoji: '🕯️', title: 'Date Night', subtitle: 'Rich, creamy, and perfect for sharing.' },
  { id: 'm_hang', emoji: '👯‍♀️', title: 'The Hangout', subtitle: 'Crispy, crunchy, and built for the table.' },
  { id: 'm_work', emoji: '💻', title: 'Deep Work', subtitle: 'Clean energy and focused sipping.' },
  { id: 'm_hurt', emoji: '💔', title: 'Heartbreak Remedy', subtitle: 'Sweet comfort. Calories do not count.' },
  { id: 'm_clean', emoji: '🌿', title: 'Clean & Serene', subtitle: 'Fresh, vibrant, and guilt-free.' }
]

// 2. THE CURATED ITEMS (Step 2) mapped to your WebP images
const vibeItems = {
  'm_date': [
    { id: 'v_dn1', title: 'The Romance Duo', description: 'Truffle Mushroom Risotto & Classic Chicken Alfredo. Rich, creamy, and perfect for sharing.', price: '₹1130', diet: 'non-veg', image: 'Truffle_Mushroom_Risotto.webp' },
    { id: 'v_dn2', title: 'Midnight Sweetheart', description: 'Classic Basque Cheesecake paired with two glasses of Fresh Peach Iced Tea.', price: '₹950', diet: 'veg', image: 'Classic_Basque_Cheesecake.webp' },
  ],
  'm_hang': [
    { id: 'v_ho1', title: 'The Catch-Up Platter', description: 'Artisanal Burrata Margherita, Honey Sriracha Wings, and Parmesan Truffle Fries.', price: '₹1348', diet: 'non-veg', image: 'Artisanal_Burrata_Margherita.webp' },
    { id: 'v_ho2', title: 'Crisp & Chill', description: 'Crispy Calamari Rings and Pull-Apart Garlic Bread for the table.', price: '₹798', diet: 'non-veg', image: 'Crispy_Calamari_Rings.webp' },
  ],
  'm_work': [
    { id: 'v_dw1', title: 'The Focus Fuel', description: 'Our signature Pasay Cold Brew paired with a nutrient-dense Smashed Avocado Sourdough.', price: '₹649', diet: 'veg', image: 'Pasay_Cold_Brew.webp' },
  ],
  'm_hurt': [
    { id: 'v_hr1', title: 'Sweet Comfort', description: 'Classic Basque Cheesecake, Dark Chocolate Sea Salt Cookie, and Signature Hot Chocolate.', price: '₹950', diet: 'veg', image: 'Signature_Hot_Chocolate.webp' }, // Ensure cookie and hot chocolate image mapping fits your preference
  ],
  'm_clean': [
    { id: 'v_cs1', title: 'The Reset', description: 'Chilled Acai Superfood Bowl and a Fresh Watermelon Mint Cooler.', price: '₹779', diet: 'vegan', image: 'Chilled_Acai_Superfood_Bowl.webp' },
  ]
}

export default function VibeScreen({ onNavigate }) {
  const { cart, addToCart, removeFromCart, totalItems, totalPrice } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Controls Step 1 (Moods) vs Step 2 (Menu)
  const [selectedMood, setSelectedMood] = useState(null)
  
  // Controls the Standard Menu Accordion UI
  const [expandedId, setExpandedId] = useState(null)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-[#3E362E] font-sans pb-32"
    >
      {/* 🌑 DARK MODE HEADER */}
      <header className="sticky top-0 z-50 bg-[#3E362E]/90 backdrop-blur-md border-b border-[#C5A880]/20 px-6 py-5">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => onNavigate('home')}
            className="text-[#C5A880] text-[10px] font-bold tracking-widest uppercase flex items-center gap-2"
          >
            ← Home
          </button>
          <button 
            onClick={() => onNavigate('menu')}
            className="text-[#FAF9F6]/70 hover:text-[#FAF9F6] text-[9px] font-bold tracking-widest uppercase border border-[#FAF9F6]/20 px-4 py-2 rounded-full"
          >
            Standard Menu
          </button>
        </div>
        <h1 className="font-serif text-3xl text-[#FAF9F6]">
          {!selectedMood ? 'Set the ' : 'The '}
          <span className="italic text-[#C5A880]">
            {!selectedMood ? 'Mood' : selectedMood.title}
          </span>
        </h1>
      </header>

      {/* 🔄 DYNAMIC BODY */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: CHOOSE A MOOD */}
          {!selectedMood ? (
            <motion.div 
              key="mood-selector"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4"
            >
              <p className="text-sm text-[#FAF9F6]/60 mb-2">How is the vibe tonight?</p>
              {moods.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood)}
                  className="w-full bg-[#FAF9F6]/5 border border-[#C5A880]/20 rounded-2xl p-5 flex items-center gap-5 text-left hover:bg-[#C5A880]/10 transition-colors active:scale-[0.98]"
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif text-xl text-[#C5A880]">{mood.title}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-[#FAF9F6]/50">{mood.subtitle}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            
            /* STEP 2: ACCORDION MENU (Mimics Standard Menu) */
            <motion.div 
              key="vibe-menu"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col"
            >
             {/* ✨ EDITORIAL 'CHANGE MOOD' BUTTON */}
              <button 
                onClick={() => setSelectedMood(null)}
                className="group flex items-center gap-3 w-fit mb-10 active:scale-95 transition-transform"
              >
                {/* Circular Arrow Container */}
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FAF9F6]/5 border border-[#FAF9F6]/10 group-hover:bg-[#C5A880] group-hover:border-[#C5A880] transition-all duration-300 shadow-sm">
                  <span className="text-[#FAF9F6] group-hover:text-[#3E362E] text-lg font-light leading-none mb-0.5">
                    ←
                  </span>
                </div>
                {/* Text */}
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FAF9F6]/70 group-hover:text-[#C5A880] transition-colors duration-300">
                  Change Mood
                </span>
              </button>

              <div className="flex flex-col">
                {vibeItems[selectedMood.id].map(item => {
                  const cartItem = cart.find(c => c.id === item.id)
                  const quantity = cartItem ? cartItem.quantity : 0
                  const isExpanded = expandedId === item.id

                  return (
                    <div key={item.id} className="border-b border-[#FAF9F6]/10">
                      
                      {/* ACCORDION HEADER */}
                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="w-full py-6 flex justify-between items-center text-left"
                      >
                        <div className="flex flex-col gap-1 pr-4">
                          <h3 className="font-serif text-lg text-[#C5A880]">{item.title}</h3>
                          <span className="font-medium text-[#FAF9F6] text-sm">{item.price}</span>
                        </div>
                        <span className="text-[#C5A880] text-2xl font-light">
                          {isExpanded ? '−' : '+'}
                        </span>
                      </button>

                      {/* ACCORDION BODY (Image & Controls) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-6 flex flex-col gap-5">
                              
                              {/* 📸 THE REAL IMAGE BLOCK */}
                              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#FAF9F6]/10 bg-black/20">
                                <img 
                                  src={`/images/${item.image}`} 
                                  alt={item.title}
                                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                />
                              </div>

                              <p className="text-xs text-[#FAF9F6]/70 leading-relaxed">
                                {item.description}
                              </p>

                              <div className="flex justify-between items-center pt-2">
                                <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-sm ${
                                  item.diet === 'veg' || item.diet === 'vegan' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                                }`}>
                                  {item.diet}
                                </span>

                                {/* ADD TO CART CONTROLS */}
                                {quantity === 0 ? (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                    className="text-[10px] uppercase tracking-widest font-bold bg-[#FAF9F6]/10 text-[#C5A880] px-6 py-2.5 rounded-full hover:bg-[#C5A880] hover:text-[#3E362E] transition-colors"
                                  >
                                    Add +
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-4 bg-[#FAF9F6]/10 rounded-full px-4 py-1.5" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => removeFromCart(item.id)} className="text-[#FAF9F6]/70 hover:text-[#FAF9F6] text-lg leading-none active:scale-90">−</button>
                                    <span className="text-[#C5A880] font-bold text-xs w-4 text-center">{quantity}</span>
                                    <button onClick={() => addToCart(item)} className="text-[#FAF9F6]/70 hover:text-[#FAF9F6] text-lg leading-none active:scale-90">+</button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🛒 FLOATING CART BUTTON */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 z-40"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-[#C5A880] text-[#3E362E] py-4 px-6 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex justify-between items-center active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-[#3E362E] text-[#C5A880] rounded-full text-xs font-bold flex items-center justify-center">
                  {totalItems}
                </span>
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase">View Collection</span>
              </div>
              <span className="font-serif font-bold text-sm">₹{totalPrice.toLocaleString('en-IN')}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CheckoutDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </motion.div>
  )
}