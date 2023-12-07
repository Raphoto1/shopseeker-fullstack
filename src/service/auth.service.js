//imports de app
import { mongoDbCreateCart } from "@/dao/cart.dao";
import { mongoDbUserChkEmail, mongoDbUserRegister } from "@/dao/user.dao";
import bcrypt from "bcrypt";
//imports propios

export const login = async (data) => {
    const pass = data['password'];
    if (pass=='123') {
        return true
    }
    return pass
}

export const register = async (data) => {
    const email = data['email'];
    const name = data['name'];
    let role = data['role'];
    const password = data['password']
    
    //revisar que correo no se repita
    const userChk = await mongoDbUserChkEmail(email);
    console.log(userChk);
    if (userChk) {
        console.log('correo ya existe');
        throw new Error('Email already Exist');
    } else {
        if (email.endsWith('@creativerafa.com')) {
            role = "rafa"
        }
    }
    //encriptar pass
    const passHashed = await bcrypt.hash(password, 12);
    const newCart = await mongoDbCreateCart();
    //empaquetar user

    const newUser = {
        name,email,role,password:passHashed,cart:newCart, last_connection:new Date()
    }

    const userCreated = await mongoDbUserRegister(newUser);
    return userCreated
}