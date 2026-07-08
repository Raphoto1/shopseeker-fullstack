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
    // 🚀 Obtener carrito con populate - una sola query
    const getCart = await cartModel.find({ _id: idIn }).populate("designs.design").lean();
    
    // 🚀 Verificar diseños eliminados en paralelo (sin bloquear)
    if (getCart[0]?.designs?.length > 0) {
      const validDesigns = await Promise.all(
        getCart[0].designs.map(async (des) => {
          const chkDes = await mongoDbgetDesignsById(des.design);
          return chkDes ? des : null; // Retorna null si el diseño fue eliminado
        })
      );
      
      // Eliminar diseños nulos en paralelo
      const deletedDesigns = getCart[0].designs.filter((des, idx) => !validDesigns[idx]);
      if (deletedDesigns.length > 0) {
        await Promise.all(
          deletedDesigns.map(des => mongoDbDeleteFromCart(idIn, des.design))
        );
      }
    }
    
    return getCart;
  } catch (error) {
    throw new Error(error);
  }
};

// ❌ ELIMINADA: Esta función ya no es necesaria - se consolidó en mongoDbGetCart
// export const mongoDbGetCartClean = async(idIn) => { ... }

export const mongoDbAddToCart = async (cId, dId, quantity) => {
  try {
    await dbConnect();
    // 🚀 Usar $push en lugar de find + push + save (más eficiente)
    const updatedCart = await cartModel.findByIdAndUpdate(
      cId,
      { $push: { designs: { design: dId, quantity: quantity || 1 } } },
      { new: true }
    );
    return updatedCart;
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
    return cartToDelete;
  } catch (error) {
    throw new Error(error);
  }
};
