import { generateDeletePass } from "@/service/auth.service";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        const capturedForm = await req.formData();
        const uId = capturedForm.get('uId');
        const uEmail = capturedForm.get('email');
        const password = capturedForm.get('password')
        const result = await generateDeletePass(uId,uEmail,password)
        return NextResponse.json({ status: 200 ,payload:result});
    } catch (error) {
        return NextResponse.json({ message: `error: ${error}` }); 
    }
}