import { mongoDbAddToCart, mongoDbCreateCart, mongoDbGetCart, mongoDbclearCart } from "@/dao/cart.dao"

export const createCart = async () => {
    const newCart = await mongoDbCreateCart();
    return newCart
}

export const clearCart = async (cId) => {
    const result = await mongoDbclearCart(cId);
    return result
}

export const getCart = async (cId) => {
    const cart = await mongoDbGetCart(cId);
    return cart
}

export const addToCart = async (cId, dId) => {
    const cart = await getCart(cId);
    const desList = cart[0].designs
    const chkDes = desList.findIndex((des) => des.design.toString() === dId);
    console.log(chkDes);
    const result = async () => {
        if (chkDes==-1) {
            return await mongoDbAddToCart(cId, dId);    
        } else {
            return false
        }
    }
    const response = await result()
    console.log(response);
    return response
}

export const deleteFromCart = async (cId,dId) => {
    console.log('esto es el cart', cId);
    console.log('este es el design',dId);
}
