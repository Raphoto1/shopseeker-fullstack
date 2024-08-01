//imports propios
import cartModel from "@/models/cart.model";
import { dbConnect } from "@/utils/mongoDb";
import { mongoDbgetDesignsById } from "./design.dao";

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
    const cartClean = await mongoDbGetCartClean(idIn);
    //kick deleted designs from cart
    const chkDeletedDesigns = cartClean[0].designs.map(async (des) => {
      const chkDes = await mongoDbgetDesignsById(des.design)
      if (!chkDes) {
        const kickDesign = await mongoDbDeleteFromCart(idIn, des.design);
      } else {
        null
      }
    })
    return getCart;
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbGetCartClean= async(idIn)=>{
  try {
    await dbConnect();
    const getCart = await cartModel.find({ _id: idIn });
    return getCart;
  } catch (error) {
    throw new Error(error);
  }
}

export const mongoDbAddToCart = async (cId, dId, quantity) => {
  try {
    await dbConnect();
    const findCart = await cartModel.find({ _id: cId});
    findCart[0].designs.push({ design: dId,quantity:1 });
    return await findCart[0].save();
  } catch (error) {
      console.log(error);
    throw new Error(error);
  }
};

export const mongoDbDeleteFromCart = async (cId,dId)=>{
  try {
    await dbConnect()
    let prodToDelete = await cartModel.updateOne(
      {_id:cId},
      {$pull:{designs:{design:dId}}}
    )
    return prodToDelete
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const mongoDbDeleteCart = async (cId) => {
  try {
    await dbConnect();
    const cartToDelete = await cartModel.findByIdAndDelete(cId);
    return cartToDelete
  } catch (error) {
    throw new Error(error);
  }
}
