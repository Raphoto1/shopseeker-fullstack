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
    console.log('getcart: ', getCart[0].designs);
    const cartClean = await mongoDbGetCartClean(idIn);
    console.log('cartClean: ', cartClean[0].designs);
    const chkDeletedDesigns = cartClean[0].designs.map(async (des) => {
      console.log('des map de cart: ',des.design);
      const chkDes = await mongoDbgetDesignsById(des.design)
      console.log(chkDes);
      if (!chkDes) {
        const kickDesign = await mongoDbDeleteFromCart(idIn, des.design);
        console.log(kickDesign);
      } else {
        console.log('si esta el dise;o');
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
    // console.log(findCart[0]);
    findCart[0].designs.push({ design: dId,quantity:1 });
    return await findCart[0].save();
  } catch (error) {
      console.log(error);
    throw new Error(error);
  }
};

export const mongoDbDeleteFromCart = async (cId,dId)=>{
  try {
    let prodToDelete = await cartModel.updateOne(
      {_id:cId},
      {$pull:{designs:{design:dId}}}
    )
    console.log(prodToDelete);
    return prodToDelete
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
