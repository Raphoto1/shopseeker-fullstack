import { deleteAccount, generateDeletePass } from "@/service/auth.service";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        const capturedForm = await req.formData();
        const token = capturedForm.get('token');
        const uEmail = capturedForm.get('email');
        const password = capturedForm.get('password');
        const uId = capturedForm.get('uId')
        const result = await deleteAccount(uId,token,uEmail,password)
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: `error: ${error}` }); 
    }
}