'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext' // 🧠 1. Imported the Brain
import FloatingCart from '@/components/ui/FloatingCart' // 🛒 2. Imported the Cart Button
import CheckoutDrawer from '@/components/ui/CheckoutDrawer' // 📦 3. Imported the Drawer

// Our massive, 7-star "Elevated Everyday" menu data
const menuItems = [
  // ------------------------------------
  // 01. SIGNATURES
  // ------------------------------------
  {
    id: 'm_sig1', category: '01. Signatures', title: 'Truffle Mushroom Risotto', 
    description: 'Creamy Arborio rice slow-cooked with wild mushrooms, truffle oil, and aged parmesan.', 
    price: '₹550', pairing: 'Perfect with: Iced Americano', diet: 'veg'
  },
  {
    id: 'm_sig2', category: '01. Signatures', title: 'The Signature Smash Burger', 
    description: 'Double smashed beef patties, caramelized onions, melted cheddar, and house sauce on brioche.', 
    price: '₹499', pairing: 'Perfect with: Parmesan Truffle Fries', diet: 'non-veg'
  },
  {
    id: 'm_sig3', category: '01. Signatures', title: 'Artisanal Burrata Margherita', 
    description: 'Hand-stretched sourdough pizza topped with San Marzano tomatoes, fresh basil, and creamy burrata.', 
    price: '₹650', pairing: 'Perfect with: Fresh Peach Iced Tea', diet: 'veg'
  },
  {
    id: 'm_sig4', category: '01. Signatures', title: 'Harissa Chicken Skewers', 
    description: 'Charcoal-grilled chicken marinated in smoky harissa, served with a garlic mint yogurt dip.', 
    price: '₹450', pairing: 'Perfect with: Lavender Lemonade', diet: 'non-veg'
  },
  {
    id: 'm_sig5', category: '01. Signatures', title: 'Spicy Vodka Rigatoni', 
    description: 'Al dente rigatoni tossed in a rich, creamy tomato-vodka sauce with chili flakes and parmesan.', 
    price: '₹520', pairing: 'Perfect with: Pull-Apart Garlic Bread', diet: 'veg'
  },
  {
    id: 'm_sig6', category: '01. Signatures', title: 'Classic Chicken Alfredo', 
    description: 'Fettuccine pasta and grilled chicken breast in a velvety, slow-simmered garlic cream sauce.', 
    price: '₹580', pairing: 'Perfect with: A Crisp Chardonnay', diet: 'non-veg'
  },

  // ------------------------------------
  // 02. MORNING RITUALS
  // ------------------------------------
  {
    id: 'm_mr1', category: '02. Morning Rituals', title: 'Smashed Avocado Sourdough', 
    description: 'Fresh Hass avocado, roasted cherry tomatoes, feta crumble, and chili flakes on artisan sourdough.', 
    price: '₹399', pairing: 'Perfect with: The House Iced Latte', diet: 'veg'
  },
  {
    id: 'm_mr2', category: '02. Morning Rituals', title: 'Classic Eggs Benedict', 
    description: 'Poached farm eggs and smoked chicken ham on toasted English muffins with rich hollandaise.', 
    price: '₹450', pairing: 'Perfect with: Fresh Orange Juice', diet: 'non-veg'
  },
  {
    id: 'm_mr3', category: '02. Morning Rituals', title: 'Fluffy Ricotta Pancakes', 
    description: 'Three thick, cloud-like pancakes served with warm mixed berry compote and organic maple syrup.', 
    price: '₹350', pairing: 'Perfect with: Signature Hot Chocolate', diet: 'veg'
  },
  {
    id: 'm_mr4', category: '02. Morning Rituals', title: 'Wild Mushroom Scramble', 
    description: 'Soft-folded eggs cooked with truffle butter, roasted wild mushrooms, and fresh chives.', 
    price: '₹380', pairing: 'Perfect with: Double Espresso', diet: 'veg'
  },
  {
    id: 'm_mr5', category: '02. Morning Rituals', title: 'Acai Superfood Bowl', 
    description: 'Chilled Amazonian acai blended with bananas, topped with house granola, chia seeds, and fresh berries.', 
    price: '₹499', pairing: 'Perfect with: Ceremonial Matcha Latte', diet: 'vegan'
  },

  // ------------------------------------
  // 03. THE BAKEHOUSE
  // ------------------------------------
  {
    id: 'm_bh1', category: '03. The Bakehouse', title: 'Twice-Baked Almond Croissant', 
    description: 'Flaky French butter pastry filled and topped with sweet almond frangipane and powdered sugar.', 
    price: '₹299', pairing: 'Perfect with: Ceremonial Matcha Latte', diet: 'veg'
  },
  {
    id: 'm_bh2', category: '03. The Bakehouse', title: 'Classic Basque Cheesecake', 
    description: 'Caramelized, beautifully burnt exterior with a melting, rich vanilla bean cream cheese center.', 
    price: '₹450', pairing: 'Perfect with: The Pasay Cold Brew', diet: 'veg'
  },
  {
    id: 'm_bh3', category: '03. The Bakehouse', title: 'Dark Chocolate Sea Salt Cookie', 
    description: 'Gooey center with crispy edges, loaded with premium dark chocolate chunks and Maldon sea salt.', 
    price: '₹250', pairing: 'Perfect with: Signature Hot Chocolate', diet: 'veg'
  },
  {
    id: 'm_bh4', category: '03. The Bakehouse', title: 'Classic Tiramisu', 
    description: 'Espresso-soaked ladyfingers layered with light mascarpone cream and dusted with rich cocoa.', 
    price: '₹420', pairing: 'Perfect with: Hot Latte', diet: 'veg'
  },

  // ------------------------------------
  // 04. SMALL PLATES
  // ------------------------------------
  {
    id: 'm_sp1', category: '04. Small Plates', title: 'Parmesan Truffle Fries', 
    description: 'Crispy golden fries tossed in light truffle oil and dusted with aged parmesan and parsley.', 
    price: '₹299', pairing: 'Perfect with: The Signature Smash Burger', diet: 'veg'
  },
  {
    id: 'm_sp2', category: '04. Small Plates', title: 'Honey Sriracha Wings', 
    description: 'Twice-cooked chicken wings tossed in a sweet, sticky, and spicy house glaze with toasted sesame.', 
    price: '₹399', pairing: 'Perfect with: Classic Gin & Tonic', diet: 'non-veg'
  },
  {
    id: 'm_sp3', category: '04. Small Plates', title: 'Pull-Apart Garlic Bread', 
    description: 'Warm, crusty artisanal loaf loaded with garlic confit butter and gooey melted mozzarella.', 
    price: '₹299', pairing: 'Perfect with: Creamy Tomato Soup', diet: 'veg'
  },
  {
    id: 'm_sp4', category: '04. Small Plates', title: 'Crispy Calamari Rings', 
    description: 'Lightly dusted squid fried golden, served with fresh lemon zest and house-made garlic tartare.', 
    price: '₹499', pairing: 'Perfect with: Watermelon Mint Cooler', diet: 'non-veg'
  },
  {
    id: 'm_sp5', category: '04. Small Plates', title: 'Mac & Cheese Bites', 
    description: 'Crispy panko-crusted spheres filled with creamy four-cheese macaroni, served with spicy aioli.', 
    price: '₹350', pairing: 'Perfect with: Fresh Peach Iced Tea', diet: 'veg'
  },

  // ------------------------------------
  // 05. BREADS & BOWLS
  // ------------------------------------
  {
    id: 'm_bb1', category: '05. Breads & Bowls', title: 'Spicy Fried Chicken Sando', 
    description: 'Crispy buttermilk chicken thigh, spicy slaw, and dill pickles in a toasted brioche bun.', 
    price: '₹480', pairing: 'Perfect with: Craft Pilsner', diet: 'non-veg'
  },
  {
    id: 'm_bb2', category: '05. Breads & Bowls', title: 'Truffled Grilled Cheese', 
    description: 'Melted gruyere, cheddar, and caramelized onions with truffle oil, pressed in buttery sourdough.', 
    price: '₹399', pairing: 'Perfect with: Tomato Basil Soup', diet: 'veg'
  },
  {
    id: 'm_bb3', category: '05. Breads & Bowls', title: 'Grilled Chicken Caesar', 
    description: 'Crisp romaine lettuce, herb-grilled chicken, shaved parmesan, and house-made garlic croutons.', 
    price: '₹420', pairing: 'Perfect with: Lavender Lemonade', diet: 'non-veg'
  },
  {
    id: 'm_bb4', category: '05. Breads & Bowls', title: 'Mediterranean Quinoa Bowl', 
    description: 'Warm quinoa, cucumber, cherry tomatoes, Kalamata olives, feta, and a zesty lemon-herb dressing.', 
    price: '₹450', pairing: 'Perfect with: Fresh Watermelon Juice', diet: 'veg'
  },

  // ------------------------------------
  // 06. SIPS & POURS
  // ------------------------------------
  {
    id: 'm_sip1', category: '06. Sips & Pours', title: 'The House Iced Latte', 
    description: 'Our signature espresso blend served over craft ice with creamy milk and a hint of vanilla.', 
    price: '₹280', pairing: 'Perfect with: Almond Croissant', diet: 'veg'
  },
  {
    id: 'm_sip2', category: '06. Sips & Pours', title: 'Fresh Peach Iced Tea', 
    description: 'Freshly brewed black tea infused with real crushed peaches, wild mint, and a touch of honey.', 
    price: '₹250', pairing: 'Perfect with: Burrata Margherita', diet: 'vegan'
  },
  {
    id: 'm_sip3', category: '06. Sips & Pours', title: 'The Pasay Cold Brew', 
    description: 'Our signature 24-hour steeped cold brew, served over a single hand-carved clear ice sphere.', 
    price: '₹250', pairing: 'Perfect with: Basque Cheesecake', diet: 'vegan'
  },
  {
    id: 'm_sip4', category: '06. Sips & Pours', title: 'Ceremonial Matcha Latte', 
    description: 'Premium grade Japanese matcha whisked with oat milk and lightly sweetened with agave.', 
    price: '₹350', pairing: 'Perfect with: Acai Superfood Bowl', diet: 'vegan'
  },
  {
    id: 'm_sip5', category: '06. Sips & Pours', title: 'Watermelon Mint Cooler', 
    description: 'Freshly pressed watermelon juice, muddled mint leaves, and a splash of sparkling water.', 
    price: '₹280', pairing: 'Perfect with: Crispy Calamari Rings', diet: 'vegan'
  }
];

// Extract unique categories
const CATEGORIES = [...new Set(menuItems.map(item => item.category))]
const DIETS = ['All', 'Veg', 'Non-Veg', 'Vegan']

export default function MenuScreen({ onNavigate }) {
  const { addToCart } = useCart()

  const [activeDiet, setActiveDiet] = useState('All')
  const [expandedIds, setExpandedIds] = useState([])
  const [activeCategory, setActiveCategory] = useState('01. Signatures')
  
  // 🔑 4. Added the state to control the Drawer visibility
  const [isCartOpen, setIsCartOpen] = useState(false)

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id)
      } else {
        const newArray = [...prev, id]
        if (newArray.length > 3) {
          newArray.shift()
        }
        return newArray
      }
    })
  }

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCategory = item.category === activeCategory
      const matchDiet = activeDiet === 'All' || item.diet.toLowerCase() === activeDiet.toLowerCase()
      return matchCategory && matchDiet
    })
  }, [activeCategory, activeDiet])

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen font-sans text-[#3E362E]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md mx-auto relative min-h-screen shadow-2xl overflow-hidden bg-[#FAF9F6] flex flex-col"
      >
        {/* Sticky Header & Navigation Bars */}
        <div className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-xl border-b border-[#C5A880]/20 pb-4">
          
          <header className="px-6 py-5 flex items-center justify-between">
            <button 
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-2 text-[#3E362E]/70 hover:text-[#3E362E] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-[10px] tracking-[0.3em] uppercase">Back</span>
            </button>
            <div className="flex flex-col items-end">
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#C5A880]">Menu</span>
              <span className="font-serif italic text-sm text-[#3E362E]">The Collection</span>
            </div>
          </header>

          <div className="px-6 overflow-x-auto no-scrollbar pb-3 flex items-center gap-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setExpandedIds([]); }}
                className={`whitespace-nowrap font-serif text-lg transition-all duration-300 relative ${
                  activeCategory === cat ? 'text-[#3E362E]' : 'text-[#3E362E]/40 hover:text-[#3E362E]/70'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="categoryIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#C5A880]" 
                  />
                )}
              </button>
            ))}
          </div>

          <div className="px-6 flex items-center gap-3 mt-2">
            {DIETS.map((diet) => (
              <button
                key={diet}
                onClick={() => { setActiveDiet(diet); setExpandedIds([]); }}
                className={`px-4 py-1.5 rounded-full text-[9px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                  activeDiet === diet 
                    ? 'bg-[#3E362E] text-[#C5A880] border-[#3E362E]' 
                    : 'bg-transparent text-[#3E362E]/60 border-[#3E362E]/15 hover:border-[#3E362E]/30'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>

        </div>

        {/* Scrollable Menu List */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center py-20 text-[#3E362E]/50 font-light text-sm"
                >
                  No items found for this selection.
                </motion.div>
              ) : (
                filteredItems.map((item) => {
                  const isExpanded = expandedIds.includes(item.id)

                  return (
                    <motion.div 
                      layout 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      key={item.id} 
                      className="w-full flex flex-col"
                    >
                      <div 
                        onClick={() => toggleExpand(item.id)}
                        className="flex items-end justify-between cursor-pointer group"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              item.diet === 'veg' ? 'bg-green-600' : item.diet === 'vegan' ? 'bg-emerald-400' : 'bg-red-800'
                            }`} />
                            <span className="text-[8px] tracking-[0.2em] uppercase text-[#3E362E]/40 font-bold">{item.diet}</span>
                          </div>
                          <h3 className="font-serif text-xl text-[#3E362E] group-hover:text-[#C5A880] transition-colors duration-300">
                            {item.title}
                          </h3>
                        </div>
                        
                        <div className="flex-1 border-b-[1.5px] border-dotted border-[#3E362E]/20 mx-4 mb-1.5 transition-colors duration-300 group-hover:border-[#C5A880]/40"></div>
                        
                        <div className="flex items-center gap-3 mb-0.5">
                          <span className="text-sm font-light text-[#3E362E] tracking-wide">{item.price}</span>
                          <motion.span 
                            animate={{ rotate: isExpanded ? 45 : 0 }}
                            className="text-[#C5A880] text-lg font-light w-3 flex justify-center"
                          >
                            +
                          </motion.span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pt-5 pb-3">
                              <div className="w-full aspect-video rounded-xl bg-gradient-to-tr from-[#3E362E]/10 via-[#C5A880]/15 to-[#FAF9F6] relative overflow-hidden mb-5 flex items-center justify-center border border-[#C5A880]/20 shadow-inner">
                                <span className="text-[9px] tracking-[0.4em] uppercase text-[#3E362E]/30 font-light">Image Loads Here</span>
                              </div>
                              <p className="text-sm text-[#3E362E]/80 font-light leading-relaxed mb-4">
                                {item.description}
                              </p>
                              
                              <button className="flex items-center gap-3 w-full group mb-6 text-left">
                                <span className="h-px w-6 bg-[#C5A880]/60 transition-all group-hover:w-8"></span>
                                <p className="text-[11px] italic font-serif text-[#C5A880] flex-1">
                                  {item.pairing}
                                </p>
                                <svg className="w-3 h-3 text-[#C5A880] opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>

                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  addToCart(item);
                                }}
                                className="w-full py-3.5 bg-[#3E362E] text-[#C5A880] rounded-full font-medium tracking-[0.3em] uppercase text-[10px] shadow-lg transition-transform active:scale-95"
                              >
                                Add to Experience
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </div>

          <div className="mt-16 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#3E362E]/15" />
            <span className="text-[9px] tracking-[0.5em] uppercase text-[#3E362E]/40 font-light">❦</span>
            <span className="h-px w-10 bg-[#3E362E]/15" />
          </div>

        </div>
      </motion.div>
      
      {/* 🟢 5. Connected the state to the Cart Button */}
      <FloatingCart onOpenCart={() => setIsCartOpen(true)} />

      {/* 📦 6. Added the Drawer itself */}
      <CheckoutDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  )
}