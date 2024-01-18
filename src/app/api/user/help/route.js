import { deleteAccount, generateDeletePass } from "@/service/auth.service";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        console.log('llego a borrar');
        const capturedForm = await req.formData();
        const token = capturedForm.get('token');
        const uEmail = capturedForm.get('email');
        const password = capturedForm.get('password');
        const uId = capturedForm.get('uId')
        console.log(capturedForm);
        const result = await deleteAccount(uId,token,uEmail,password)
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: `error: ${error}` }); 
    }
}