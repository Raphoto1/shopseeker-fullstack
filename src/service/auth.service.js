//imports de app
import { mongoDbCreateCart } from "@/dao/cart.dao";
import { mongoDbUserChkEmail, mongoDbUserChkId, mongoDbUserRegister, mongoDbUserUpdate } from "@/dao/user.dao";
import bcrypt from "bcrypt";
//imports propios
import { imageUploaderCloudinary, imageDeleterCloudinary } from "@/utils/cloudinaryUtils";

export const register = async (data) => {
  const email = data["email"];
  const name = data["name"];
  let role = data["role"];
  const password = data["password"];
  //revisar que correo no se repita
  const userChk = await mongoDbUserChkEmail(email);
  console.log(userChk);
  if (userChk) {
    throw new Error("Email already Exist");
  } else {
    if (email.endsWith("@creativerafa.com")) {
      role = "rafa";
    }
  }
  //encriptar pass
  const passHashed = await bcrypt.hash(password, 12);
  const newCart = await mongoDbCreateCart();
  //empaquetar user
  const newUser = {
    name,
    email,
    role,
    password: passHashed,
    cart: newCart,
    last_connection: new Date(),
  };

  const userCreated = await mongoDbUserRegister(newUser);
  return userCreated;
};

export const getUserInfo = async (idIn) => {
  const userChk = await mongoDbUserChkId(idIn);
  const userToWork = userChk._doc;
  delete userToWork.password;
  return userToWork;
};

export const updateUserInfo = async (user, data) => {
  const dataToUpdate = await Object.fromEntries(data);
  const photo = data.get("photo");
  const updatePack = [];
  const packingCycle = async (data) => {
    for (let item in data) {
      let field = item;
      if (data[item] === "") {
        continue;
      } else if (field === "photo") {
        if (photo.size === 0) {
          continue;
        }
        //revisar si hay avatar
        const chkAvatar = user.avatar;
        if (chkAvatar) {
          await imageDeleterCloudinary(chkAvatar);
          const updateAvatar = await imageUploaderCloudinary(photo);
          updatePack.push({ avatar: updateAvatar });
        } else {
          const newAvatar = await imageUploaderCloudinary(photo);
          updatePack.push({ avatar: newAvatar });
        }
      } else {
        updatePack.push({ [item]: data[item] });
      }
    }
  };
  const finalPack = await packingCycle(dataToUpdate);
  const objUpdate = Object.fromEntries(updatePack.map((item) => Object.entries(item)[0]));
  const userUpdate = await mongoDbUserUpdate(user._id, objUpdate);
  return userUpdate;
};

export const changeRole = async (uId) => {};

export const changePass = async (oldPass, newPass) => {};

export const generateResetPass = async (uEmail) => {};

export const resetPass = async (uEmail, code, newPass) => {};

export const deleteAccount = async (uid) => {
  //recordar borrar disenos de los artist
};
