// src/context/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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
    let success = false;
    setCartItems((prevItems) => {
      // Check for mixed restaurants
      if (prevItems.length > 0) {
        const existingRestaurantId = prevItems[0].restaurantId;
        if (existingRestaurantId !== newItem.restaurantId) {
          toast.error("You can only order from one restaurant at a time. Please clear your cart first.");
          return prevItems; // Do not modify the cart
        }
      }

      const existingIndex = prevItems.findIndex(
        (i) => i.id === newItem.id && i.restaurantId === newItem.restaurantId
      );

      success = true;
      if (existingIndex !== -1) {
        // Increase quantity
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        toast.success("Added to cart!");
        return updated;
      } else {
        // Add new item
        toast.success("Added to cart!");
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
    return success;
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