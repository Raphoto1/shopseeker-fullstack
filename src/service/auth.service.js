//imports de app
import { mongoDbCreateCart } from "@/dao/cart.dao";
import { mongoDbUserChkEmail, mongoDbUserChkId, mongoDbUserPassUpdate, mongoDbUserRegister, mongoDbUserUpdate } from "@/dao/user.dao";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
//imports propios
import { imageUploaderCloudinary, imageDeleterCloudinary } from "@/utils/cloudinaryUtils";
import { sendDeleteToken, sendResetMailToken } from "@/utils/mailContact";
import { pageDevPath } from "@/enums/SuperVariables";

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

const getUserFull = async (idIn) => {
  const userChk = await mongoDbUserChkId(idIn);
  const userToWork = userChk._doc;
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
  console.log(objUpdate);
  const userUpdate = await mongoDbUserUpdate(user._id, objUpdate);
  return userUpdate;
};

export const changeRole = async (uId) => {};

export const changePass = async (data) => {
  const uId = data.get("uId");
  const oldPass = data.get("oldPass");
  const newPass = data.get("newPass");
  const user = await getUserFull(uId);
  const chkOldPass = await bcrypt.compare(oldPass, user.password);
  console.log("chkOldPass", chkOldPass);
  if (!chkOldPass) {
    throw new Error("Wrong Password");
  }
  const chkNewPass = await bcrypt.compare(newPass, user.password);
  if (chkNewPass) {
    throw new Error("New password can not be the same as old password");
  }
  const newPassHash = await bcrypt.hash(newPass, 12);
  const newPassPack = { password: newPassHash };
  const updatedPass = await mongoDbUserPassUpdate(uId, newPassPack);
  return true;
};

export const generateResetPass = async (uEmail) => {
  const chkEmail = await mongoDbUserChkEmail(uEmail);
  if (chkEmail) {
    const token = await v4();
    const tokenPack = { securityToken: token };
    const saveToken = await mongoDbUserPassUpdate(chkEmail._id, tokenPack);
    const recoveryPath = `${pageDevPath}/user/help/${token}`;
    const sendMail = await sendResetMailToken(chkEmail.name, uEmail, recoveryPath);
    console.log("esto es send mail", sendMail);
    return sendMail;
  } else {
    console.log("no existe mail");
    throw new Error("Email does not Exist");
  }
};

export const resetPass = async (uEmail, password, token) => {
  console.log(token);
  const chkMail = await mongoDbUserChkEmail(uEmail);
  if (chkMail) {
    if (chkMail.securityToken === token) {
      console.log("iniciamos proceso de cambio de mail");
      console.log(password);
      const hashPass = await bcrypt.hash(password, 12);
      const newPassPack = { password: hashPass };
      const passUpdate = await mongoDbUserPassUpdate(chkMail._id, newPassPack);
      if (passUpdate) {
        const tokenPack = { securityToken: "" };
        const deleteToken = await mongoDbUserPassUpdate(chkMail._id, tokenPack);
        return true;
      }
    } else {
      throw new Error("Wrong Mail or Token");
    }
  } else {
    throw new Error("Wrong Mail or Token");
  }
};

export const generateDeletePass = async (uId, uEmail, uPassword) => {
  const chkUser = internalLogIn(uId,uEmail,uPassword)
  console.log(chkUser);
  if (chkUser) {
    const token = await v4();
    const tokenPack = { securityToken: token };
    const saveToken = await mongoDbUserPassUpdate(chkEmail._id, tokenPack);
    const recoveryPath = `${pageDevPath}/user/help/delete/${token}`;
    const sendMail = await sendDeleteToken(chkUser.name, uEmail, recoveryPath);
    return sendMail
  } else {
    throw new Error('Wrong Email or password')
  }
};

export const deleteAccount = async (uEmail,uPassword,token) => {
  //recordar borrar disenos de los artist, carrito
  const chkUser = internalLogIn(uId);
};

const internalLogIn = async (uId, email, password) => {
  const userLog = await getUserFull(uId);
  console.log(userLog);
  const chkEmail = userLog.email === email ? true : false;
  const chkPass = await bcrypt.compare(password, userLog.password);
  const chkFull = chkEmail && chkPass ? true : false;
  return chkFull
};
