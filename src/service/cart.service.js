import {
  mongoDbAddToCart,
  mongoDbCreateCart,
  mongoDbDeleteCart,
  mongoDbDeleteFromCart,
  mongoDbGetCart,
  mongoDbGetCartClean,
  mongoDbclearCart,
} from "@/dao/cart.dao";

export const createCart = async () => {
  const newCart = await mongoDbCreateCart();
  return newCart;
};

export const clearCart = async (cId) => {
  const result = await mongoDbclearCart(cId);
  return result;
};

export const getCart = async (cId) => {
  const cart = await mongoDbGetCart(cId);
  return cart;
};

export const getCartClean = async (cId) => {
  const cart = await mongoDbGetCartClean(cId);
  return cart;
};

export const addToCart = async (cId, dId) => {
  const cart = await getCart(cId);
  const desList = cart[0].designs;
  const chkDes = desList.findIndex((des) => des.design.toString() === dId);
  const result = async () => {
    if (chkDes == -1) {
      return await mongoDbAddToCart(cId, dId);
    } else {
      return false;
    }
  };
  const response = await result();
  return response;
};

export const deleteFromCart = async (cId, dId) => {
  const deleteDes = await mongoDbDeleteFromCart(cId, dId);
  return deleteDes;
};

export const deleteCart = async (cId) => {
  const deleteCart = await mongoDbDeleteCart(cId);
  return deleteCart;
};
