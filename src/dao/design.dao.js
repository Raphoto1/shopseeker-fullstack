import designModel from "@/models/design.model";
import { dbConnect } from "@/utils/mongoDb";

export const mongoDbGetAllDesigns = async (querySearch, options) => {
  //logica de mongo
  try {
    await dbConnect();
    const designs = await designModel.paginate(querySearch, options);
    // const designs = await designModel.paginate({'title':/golden/i}, options);
    // console.log(designs);
    return designs;
  } catch (error) {
    throw new Error(`error desde dao: ${error}`);
  }
};

export const mongoDbgetDesignsById = async (id) => {
  try {
    await dbConnect();
    const design = await designModel.findById(id);
    return design;
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbGetDesignsByOwner = async (uId) => {
  try {
    const designs = designModel.find({ owner: uId });
    return designs
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbCreateNewDesign = async (data) => {
  try {
    await dbConnect();
    console.log('coneccion a mongoDb establecida desde dao en createDesign');
    
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
    const designToUpdate = designModel.updateOne({ _id: id }, [{ $set: pack }]);
    return designToUpdate;
  } catch (error) {
    console.log('error desde dao', error);
    
    throw new Error(error);
  }
};

export const mongoDbDeleteDesign = async (id) => {
  try {
    const designToDelete = await designModel.findByIdAndDelete(id);
    return designToDelete;
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbDeleteUserDesigns = async (uId) => {
  try {
    dbConnect();
    const deleteDesigns = designModel.deleteMany({ owner: uId });
    return deleteDesigns;
  } catch (error) {
    throw new Error(error);
  }
};
