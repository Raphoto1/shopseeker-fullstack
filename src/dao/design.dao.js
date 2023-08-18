import designModel from "@/models/design.model";
import { dbConnect } from "@/utils/mongoDb";

export const mongoDbGetAllDesigns = async () => {
  //logica de mongo
  try {
    await dbConnect();
    const designs = await designModel.find();
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

export const mongoDbCreateNewDesign = async (data) => {
  try {
    await dbConnect();
    const newDesign = await designModel.create(data);
    return newDesign;
  } catch (error) {
    throw new Error(error);
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

export const mongoDbDeleteDesign = async (id) => {
    try {
        const designToDelete = await designModel.findByIdAndDelete(id);
        return designToDelete
    } catch (error) {
        throw new Error(error)
    }
}
