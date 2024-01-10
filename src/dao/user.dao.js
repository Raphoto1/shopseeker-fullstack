import usersModel from "@/models/users.model";
import { dbConnect } from "@/utils/mongoDb";

export const mongoDbUserChkEmail = async (emailIn) => {
  try {
    await dbConnect();
      const user = await usersModel.findOne({ email: emailIn });
    return user;
  } catch (error) {
    throw new Error(`error desde dao: ${error}`);
  }
};

export const mongoDbUserChkId = async (idIn) => {
  try {
    await dbConnect();
      const user = await usersModel.findOne({ _id: idIn });
      return user
  } catch (error) {
    throw new Error(`error desde dao: ${error}`);
  }
};

export const mongoDbUserRegister = async (data) => {
  try {
    await dbConnect();
    const newUser = await usersModel.create(data);
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbUserUpdate = async (id,pack) => {
  try {
    await dbConnect();
    const userUpdate = await usersModel.updateOne({ _id: id }, [{ $set: pack }])
    return userUpdate
  } catch (error) {
    throw new Error(error)
  }
}

export const mongoDbUserPassUpdate = async (id, dataUpdate) => {
  try {
    await dbConnect();
    const userUpdate = await usersModel.findOneAndUpdate({ _id: id }, dataUpdate)
    return userUpdate
  } catch (error) {
    throw new Error(error)
  }
}
