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
//https://swr.vercel.app/docs/subscription
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState("");
  const [cartUpdate, setCartUpdate] = useState(false);
  let cartContent = [];

  const getCartInfo = (cartIdIn) => {
    setCartId(cartIdIn);
    // console.log("llame a cart", cartIdIn);
  };

  const loadCartInfo = (cartId) => {
    const pathCart2 = `/api/user/cart/${cartId}`;
    const result = fetch(pathCart2, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.payload)
        cartContent = data.payload[0];
      }).finally(() => {
        return setCart(cartContent.designs);
      });
  };

  useEffect(() => {
    console.log("entro al effect");
    loadCartInfo(cartId);
    console.log(cart);
  }, [cartId, cartUpdate]);

  return <CartContext.Provider value={{ cart, getCartInfo, cartContent, cartUpdate,setCartUpdate }}>{children}</CartContext.Provider>;
};
