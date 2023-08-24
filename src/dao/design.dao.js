import designModel from "@/models/design.model";
import { dbConnect } from "@/utils/mongoDb";

export const mongoDbGetAllDesigns = async (querySearch,options) => {

  //logica de mongo
  try {
    await dbConnect();
    console.log(querySearch);
    // const pureText= 'test'
    // const textToFind = `/^${querySearch}/`
    // console.log(textToFind);
    // const convertido = new RegExp(textToFind.slice(1, -1));
    // console.log(convertido);
    const designs = await designModel.paginate(querySearch , options);
    // const designs = await designModel.find({ title: { $in: [ 'test' ] } }).paginate();
    console.log(designs);
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
    return designToDelete;
  } catch (error) {
    throw new Error(error);
  }
};
