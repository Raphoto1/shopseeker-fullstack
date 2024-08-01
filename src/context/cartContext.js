"use client";
import { createContext, useContext, useEffect } from "react";
import { useState } from "react";

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
  let cartContent = [];
  const pathCart = `/api/user/cart/${cartId}`;
  const getCartInfo = (cartIdIn) => {
    setCartId(cartIdIn);
  };

  const loadCartInfo = async (cartId) => {
    const pathCart2 = `/api/user/cart/${cartId}`;
    const result = await fetch(pathCart2);
    if (result.status === 404) {
      cartContent = [];
    } else {
      const resJson = await result.json();
      cartContent = resJson.payload[0];
      setCartCount(cartContent.designs.length);
      return setCart(cartContent.designs);
    }
  };

  useEffect(() => {
    loadCartInfo(cartId);
  }, [cartId, cartUpdate]);

  return <CartContext.Provider value={{ cart, getCartInfo, cartContent, cartUpdate, setCartUpdate, cartCount }}>{children}</CartContext.Provider>;
};
