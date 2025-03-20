import { changePass } from "@/service/auth.service";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const capturedForm = await req.formData();
        const result = await changePass(capturedForm);
        return NextResponse.json({ payload:result,status:200 }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: `error: ${error}` },{status:401});
    }
}