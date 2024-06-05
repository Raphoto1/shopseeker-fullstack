"use client";
import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import useSWR from "swr";

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
  let cartContent = [];

  const getCartInfo = (cartIdIn) => {
    setCartId(cartIdIn);
  };

  const loadCartInfo = async (cartId) => {
    const pathCart2 = `/api/user/cart/${cartId}`;
    const result = await fetch(pathCart2, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        cartContent = data.payload[0];
      })
      .finally(() => {
        return setCart(cartContent.designs);
      });
  };

  useEffect(() => {
    loadCartInfo(cartId);
  }, [cartId, cartUpdate]);

  return <CartContext.Provider value={{ cart, getCartInfo, cartContent, cartUpdate, setCartUpdate }}>{children}</CartContext.Provider>;
};
