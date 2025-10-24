"use client";
//imports de app
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
//imports propios
import { LikesCounter } from "../extras/LikesCounter";
import { useCart } from "@/context/cartContext";

// Función simple para mostrar notificaciones
const showNotification = (message, type = 'info') => {
  console.log(`${type.toUpperCase()}: ${message}`);
  // Opcionalmente, podrías usar alert para debugging
  // alert(`${type.toUpperCase()}: ${message}`);
};

export function LikeButton({ desId, likesRecieve }) {
  //info de session
  const { data: session, status } = useSession();
  const { getCartInfo, cart, cartUpdate, setCartUpdate } = useCart();
  const userId = session?.user._id;
  const userCart = session?.cart;

  //estados
  const [liked, setLiked] = useState(false);
  const [availableBtn, setAvailableBtn] = useState(false);
  const [likesCount, setLikesCount] = useState(likesRecieve || 0);

  // Memoizar la función para evitar re-creaciones innecesarias
  const handleUserLikes = useCallback(async (cartId) => {
    if (cartId) {
      getCartInfo(cartId);
    }
  }, [getCartInfo]);

  const chkPrevLikes = useCallback((cart, desIn) => {
    if (cart !== undefined && Array.isArray(cart)) {
      const chk = cart.findIndex((des) => des.design._id.toString() === desIn);
      setLiked(chk !== -1);
    }
  }, []);

  // Effect para manejar la autenticación y cargar el carrito
  useEffect(() => {
    if (status === "authenticated" && userCart) {
      handleUserLikes(userCart);
    }
  }, [status, userCart, handleUserLikes]);

  // Effect para verificar likes previos
  useEffect(() => {
    chkPrevLikes(cart, desId);
  }, [cart, desId, chkPrevLikes, cartUpdate]);

  const handleLiked = async () => {
    if (availableBtn) return; // Prevenir múltiples clicks
    
    const formData = new FormData();
    
    // Agregar info de usuario
    if (status === "authenticated" && userId) {
      formData.append("userId", userId);
    } else {
      formData.append("userId", "null");
    }

    setLiked(!liked);
    setAvailableBtn(true);
    
    // Timeout para prevenir spam
    setTimeout(() => {
      setAvailableBtn(false);
    }, 800);

    const newLikedState = !liked;
    const value = newLikedState ? 1 : -1;
    const basePath = `/api/design/${desId}?value=${value}`;

    if (newLikedState) {
      setLikesCount(prev => prev + 1);
    } else {
      setLikesCount(prev => prev - 1);
    }

    try {
      const response = await fetch(basePath, {
        method: "PUT",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.status === 200) {
        showNotification(newLikedState ? "Liked!" : "Disliked!", 'success');
        setCartUpdate(!cartUpdate);
      } else {
        // Revertir cambios si hay error
        setLiked(liked);
        setLikesCount(likesRecieve || 0);
        showNotification("Error updating like status", 'error');
      }
    } catch (error) {
      console.error("Error updating like:", error);
      // Revertir cambios si hay error
      setLiked(liked);
      setLikesCount(likesRecieve || 0);
      showNotification("Network error", 'error');
    }
  };

  return (
    <>
      <button 
        disabled={availableBtn} 
        onClick={handleLiked}
        className="btn btn-ghost text-2xl"
        aria-label={liked ? "Unlike design" : "Like design"}
      >
        {liked ? `♥` : `♡`}
      </button>
      {likesCount > 0 && <LikesCounter likeProp={likesCount} />}
    </>
  );
}
