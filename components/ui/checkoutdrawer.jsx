'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

export default function CheckoutDrawer({ isOpen, onClose }) {
  const { cart, totalPrice, addToCart, removeFromCart } = useCart()
  const [step, setStep] = useState('cart') // 'cart' | 'verify' | 'kitchen'
  
  // 🛑 NEW STATE: Keeps track of which item is about to be deleted
  const [itemToRemove, setItemToRemove] = useState(null)

  useEffect(() => {
    if (isOpen && cart.length === 0) {
      onClose()
      setTimeout(() => setStep('cart'), 300)
    }
  }, [cart.length, isOpen, onClose])

  const sgst = totalPrice * 0.025
  const cgst = totalPrice * 0.025
  const grandTotal = totalPrice + sgst + cgst

  const handleSendToKitchen = () => {
    setStep('kitchen')
    setTimeout(() => {
      alert("Order accepted by staff! Kitchen KOT printed.")
      onClose()
      setStep('cart') 
    }, 2500)
  }

  // 🛑 NEW FUNCTION: Intercepts the minus click
  const handleMinusClick = (item) => {
    if (item.quantity === 1) {
      // If dropping to 0, trigger the warning popup!
      setItemToRemove(item)
    } else {
      // Otherwise, just drop the quantity safely
      removeFromCart(item.id)
    }
  }

  const confirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id)
      setItemToRemove(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && cart.length > 0 && (
        <>
          {/* Dark Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />

          {/* The Actual Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[120] px-4 pb-6 pt-2 pointer-events-none"
          >
            {/* Added 'relative' here so the popup stays inside the drawer */}
            <div className="max-w-md mx-auto pointer-events-auto bg-[#FAF9F6] rounded-t-[32px] rounded-b-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative">
              
              {/* 🛡️ THE WARNING POPUP */}
              <AnimatePresence>
                {itemToRemove && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-[#FAF9F6]/80 backdrop-blur-md flex items-center justify-center p-6"
                  >
                    <motion.div 
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="bg-[#3E362E] w-full p-6 rounded-2xl shadow-2xl text-center"
                    >
                      <h3 className="font-serif text-xl text-[#C5A880] mb-2">Remove Item?</h3>
                      <p className="text-sm text-[#FAF9F6]/80 mb-6 leading-relaxed">
                        Are you sure you want to remove <br/>
                        <span className="font-bold text-[#FAF9F6]">{itemToRemove.title}</span> <br/>
                        from your collection?
                      </p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setItemToRemove(null)}
                          className="flex-1 py-3 border border-[#C5A880]/30 text-[#C5A880] rounded-full text-[10px] font-bold tracking-[0.1em] uppercase transition-transform active:scale-95"
                        >
                          Keep It
                        </button>
                        <button 
                          onClick={confirmRemove}
                          className="flex-1 py-3 bg-[#C5A880] text-[#3E362E] rounded-full text-[10px] font-bold tracking-[0.1em] uppercase transition-transform active:scale-95 shadow-lg"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="w-full flex justify-center py-3 bg-[#FAF9F6] relative z-10">
                <div className="w-12 h-1.5 bg-[#3E362E]/20 rounded-full" />
              </div>

              <div className="overflow-y-auto px-6 pb-6 no-scrollbar">
                
                {step === 'cart' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <h2 className="font-serif text-2xl text-[#3E362E] mb-6">Your Collection</h2>
                    
                    <div className="flex flex-col gap-6 mb-8">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          
                          <div className="flex flex-col gap-0.5 flex-1 pr-4">
                            <span className="text-sm font-medium text-[#3E362E] leading-tight">{item.title}</span>
                            <span className="text-[9px] text-[#3E362E]/50 uppercase tracking-widest">{item.diet}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-[#3E362E]/5 rounded-full px-3 py-1 border border-[#3E362E]/10">
                              <button 
                                // 🛑 UPDATED: Now calls our interceptor function!
                                onClick={() => handleMinusClick(item)}
                                className="text-[#3E362E]/60 hover:text-[#3E362E] transition-colors text-lg font-light leading-none active:scale-90"
                              >
                                -
                              </button>
                              <span className="text-[#C5A880] font-bold text-xs w-3 text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => addToCart(item)}
                                className="text-[#3E362E]/60 hover:text-[#3E362E] transition-colors text-lg font-light leading-none active:scale-90"
                              >
                                +
                              </button>
                            </div>
                            
                            <span className="text-sm text-[#3E362E] w-14 text-right font-medium">
                              ₹{parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity}
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#3E362E]/10 pt-4 flex flex-col gap-2 mb-8">
                      <div className="flex justify-between text-xs text-[#3E362E]/60">
                        <span>Subtotal</span>
                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-[#3E362E]/60">
                        <span>CGST (2.5%)</span>
                        <span>₹{cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-[#3E362E]/60">
                        <span>SGST (2.5%)</span>
                        <span>₹{sgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-serif text-[#3E362E] mt-2 pt-2 border-t border-[#3E362E]/10">
                        <span>Grand Total</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setStep('verify')}
                      className="w-full py-4 bg-[#3E362E] text-[#C5A880] rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-transform active:scale-95"
                    >
                      Proceed to Checkout
                    </button>
                  </motion.div>
                )}

                {step === 'verify' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-6">
                    <div className="w-16 h-16 bg-[#C5A880]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                      📍
                    </div>
                    <h2 className="font-serif text-2xl text-[#3E362E] mb-2">Are you at Table 4?</h2>
                    <p className="text-sm text-[#3E362E]/60 mb-8 leading-relaxed">
                      Please verify your table number on the physical stand. Sending food to the wrong table will delay your experience.
                    </p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setStep('cart')}
                        className="flex-1 py-3.5 border border-[#3E362E]/20 text-[#3E362E] rounded-full text-[10px] font-bold tracking-[0.1em] uppercase active:scale-95 transition-transform"
                      >
                        Go Back
                      </button>
                      <button 
                        onClick={handleSendToKitchen}
                        className="flex-1 py-3.5 bg-[#C5A880] text-[#3E362E] rounded-full text-[10px] font-bold tracking-[0.1em] uppercase active:scale-95 transition-transform shadow-lg"
                      >
                        Yes, Confirm
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'kitchen' && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                    <div className="w-12 h-12 border-4 border-[#C5A880]/30 border-t-[#C5A880] rounded-full animate-spin mx-auto mb-6" />
                    <h2 className="font-serif text-xl text-[#3E362E] mb-2">Awaiting Staff Approval...</h2>
                    <p className="text-xs text-[#3E362E]/60">Your order has been sent to the manager's console.</p>
                  </motion.div>
                )}

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}