// src/context/CartContext.js
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // array of { id, name, price?, quantity, restaurant? }

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        // Increase quantity if already in cart
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Add new item
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getGroupedCart = () => {
    const groups = {};
    cartItems.forEach(item => {
      const rid = item.restaurantId;
      if (!groups[rid]) {
        groups[rid] = {
          restaurantId: rid,
          restaurantName: item.restaurantName || `Restaurant ${rid}`,
          items: [],
          subtotal: 0
        };
      }
      groups[rid].items.push(item);
      groups[rid].subtotal += (item.price || 0) * item.quantity;
    });
    return Object.values(groups);
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        getGroupedCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);