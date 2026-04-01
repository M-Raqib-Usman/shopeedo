// src/context/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('shopeedo-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('shopeedo-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to Cart - Accepts a single object
  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) => i.id === newItem.id && i.restaurantId === newItem.restaurantId
      );

      if (existingIndex !== -1) {
        // Increase quantity
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        // Add new item
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId, restaurantId) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === itemId && item.restaurantId === restaurantId))
    );
  };

  const updateQuantity = (itemId, restaurantId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, restaurantId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.restaurantId === restaurantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getItemQuantity = (itemId, restaurantId) => {
    const item = cartItems.find(
      (i) => i.id === itemId && i.restaurantId === restaurantId
    );
    return item ? item.quantity : 0;
  };

  const getGroupedCart = () => {
    const groups = {};
    cartItems.forEach((item) => {
      const rid = item.restaurantId;
      if (!groups[rid]) {
        groups[rid] = {
          restaurantId: rid,
          restaurantName: item.restaurantName || `Restaurant ${rid}`,
          items: [],
          subtotal: 0,
        };
      }
      groups[rid].items.push(item);
      groups[rid].subtotal += (item.price || 0) * item.quantity;
    });
    return Object.values(groups);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        getGroupedCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);