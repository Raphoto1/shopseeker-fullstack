import designModel from "@/models/design.model";
import { dbConnect } from "@/utils/mongoDb";

export const mongoDbGetAllDesigns = async (querySearch, options) => {
  try {
    await dbConnect();
    const designs = await designModel.paginate(querySearch, {
      ...options,
      lean: true, // ⚡ Más rápido: devuelve objetos planos sin métodos de Mongoose
    });
    return designs;
  } catch (error) {
    throw new Error(`error desde dao: ${error}`);
  }
};

export const mongoDbgetDesignsById = async (id) => {
  try {
    await dbConnect();
    const design = await designModel.findById(id).lean(); // ⚡ lean() más rápido para lectura
    return design;
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbGetDesignsByOwner = async (uId) => {
  try {
    await dbConnect(); // ⚡ Se faltaba await
    const designs = await designModel.find({ owner: uId }).lean();
    return designs;
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbCreateNewDesign = async (data) => {
  try {
    await dbConnect();
    const newDesign = await designModel.create(data);
    return newDesign;
  } catch (error) {
    throw new Error(`error desde dao: ${error}`);
  }
};

export const mongoDbUpdateDesign = async (id, field, data) => {
  try {
    if (field === "stock" || field === "price") {
      const designToUpdate = await designModel.updateOne({ _id: id }, [{ $set: { [field]: Number(data) } }]);
      return designToUpdate;
    } else {
      const designToUpdate = await designModel.updateOne({ _id: id }, [{ $set: { [field]: data } }]);
      return designToUpdate;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbUpdateDesignMultiple = async (id, pack) => {
  try {
    await dbConnect(); // ⚡ Se faltaba await
    const designToUpdate = await designModel.updateOne({ _id: id }, [{ $set: pack }]);
    return designToUpdate;
  } catch (error) {
    console.log('error desde dao', error);
    throw new Error(error);
  }
};

export const mongoDbDeleteDesign = async (id) => {
  try {
    await dbConnect(); // ⚡ Se faltaba dbConnect
    const designToDelete = await designModel.findByIdAndDelete(id);
    return designToDelete;
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbDeleteUserDesigns = async (uId) => {
  try {
    await dbConnect(); // ⚡ Agregar await
    const deleteDesigns = await designModel.deleteMany({ owner: uId }); // ⚡ Agregar await
    return deleteDesigns;
  } catch (error) {
    throw new Error(error);
  }
};
