import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('shopeedo-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('shopeedo-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart (with restaurant info)
  const addToCart = (item, restaurantId, restaurantName) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) => i.id === item.id && i.restaurantId === restaurantId
      );

      if (existingIndex !== -1) {
        // Item already exists from same restaurant → increase quantity
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        // New item
        return [
          ...prevItems,
          {
            ...item,
            restaurantId,
            restaurantName: restaurantName || `Restaurant ${restaurantId}`,
            quantity: 1,
          },
        ];
      }
    });
  };

  // Remove item
  const removeFromCart = (itemId, restaurantId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === itemId && item.restaurantId === restaurantId)
      )
    );
  };

  // Update quantity
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

  // Get quantity of a specific item from specific restaurant
  const getItemQuantity = (itemId, restaurantId) => {
    const item = cartItems.find(
      (i) => i.id === itemId && i.restaurantId === restaurantId
    );
    return item ? item.quantity : 0;
  };

  // Grouped cart (existing logic - improved)
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
        getItemQuantity,        // ← NEW: Very important for RestaurantDetail
        getGroupedCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);