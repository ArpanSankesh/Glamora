import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevCart => {
        const existing = prevCart.find(item => item.id === product.id);
        if (existing) {
            return prevCart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                    : item
            );
        } else {
            return [...prevCart, { ...product, quantity: product.quantity || 1 }];
        }
    });
};

const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const isInCart = (id) => {
    return cartItems.some((item) => item.id === id);
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(prevCart =>
        prevCart.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
    );
};

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isInCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
