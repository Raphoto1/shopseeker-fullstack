//imports propios
import cartModel from "@/models/cart.model";
import { dbConnect } from "@/utils/mongoDb";

export const mongoDbCreateCart = async () => {
  try {
    await dbConnect();
    const newCartData = {
      designs: [],
    };
    const newCart = await cartModel.create(newCartData);
    return newCart;
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbclearCart = async (cId) => {
  try {
    await dbConnect();
    let cartToClear = await cartModel.updateOne({ _id: `${cId}` }, { $pull: { designs: {} } })
    return cartToClear
  } catch (error) {
    throw new Error(error);
  }
}

export const mongoDbGetCart = async (idIn) => {
  try {
    await dbConnect();
    const getCart = await cartModel.find({ _id: idIn }).populate("designs.design");
    return getCart;
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbAddToCart = async (cId, dId, quantity) => {
  try {
    await dbConnect();
    const findCart = await cartModel.find({ _id: cId});
    // console.log(findCart[0]);
    findCart[0].designs.push({ design: dId,quantity:1 });
    return await findCart[0].save();
  } catch (error) {
      console.log(error);
    throw new Error(error);
  }
};
