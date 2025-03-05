"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("cart context error");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState("");
  const [cartUpdate, setCartUpdate] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const getCartInfo = useCallback((cartIdIn) => {
    setCartId(cartIdIn);
  }, []);

  const loadCartInfo = useCallback(async (cartId) => {
    if (!cartId) return;
    const pathCart = `/api/user/cart/${cartId}`;
    const result = await fetch(pathCart);
    if (result.status === 404) {
      setCart([]);
      setCartCount(0);
    } else {
      const resJson = await result.json();
      const cartContent = resJson.payload[0];
      setCartCount(cartContent.designs.length);
      setCart(cartContent.designs);
    }
  }, []);

  useEffect(() => {
    loadCartInfo(cartId);
  }, [cartId, cartUpdate, loadCartInfo]);

  return (
    <CartContext.Provider value={{ cart, getCartInfo, cartUpdate, setCartUpdate, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
