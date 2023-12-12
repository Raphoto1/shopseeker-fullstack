//imports propios
import cartModel from "@/models/cart.model";
import { dbConnect } from "@/utils/mongoDb";

export const mongoDbCreateCart = async () => {
    try {
        await dbConnect()
        const newCartData = {
            designs: [],
          };
        const newCart = await cartModel.create(newCartData);
        return newCart
    } catch (error) {
        throw new Error(error)
    }
}