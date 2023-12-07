import { mongoDbCreateCart } from "@/dao/cart.dao"

export const createCart = async () => {
    const newCart = mongoDbCreateCart();
    return newCart
}