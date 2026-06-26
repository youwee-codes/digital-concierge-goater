'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // WAKE UP MEMORY
  useEffect(() => {
    const savedCart = localStorage.getItem('pasay_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setIsLoaded(true)
  }, [])

  // AUTO-SAVE
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pasay_cart', JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  const addToCart = (item) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id)
      if (existingItem) {
        return prev.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  // 🛑 THE MISSING LOGIC: This teaches the cart how to subtract!
  const removeFromCart = (id) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === id)
      if (!existingItem) return prev
      
      // If there is only 1 left, remove it from the array completely
      if (existingItem.quantity === 1) {
        return prev.filter((i) => i.id !== id)
      }
      
      // Otherwise, just drop the quantity by 1
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      )
    })
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => {
    const numPrice = parseInt(item.price.replace(/[^0-9]/g, ''))
    return sum + (numPrice * item.quantity)
  }, 0)

  return (
    // 🧠 Made sure removeFromCart is exported here so the Drawer can use it!
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)