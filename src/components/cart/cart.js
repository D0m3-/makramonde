import React, { useState, createContext } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(new Set())
  return (
    <CartContext.Provider
      value={{
        items: [...cartItems],
        addItem: item => setCartItems(new Set([...cartItems, item])),
        empty: () => setCartItems(new Set()),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
