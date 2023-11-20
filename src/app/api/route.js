import { NextResponse } from "next/server";

import { updateTest } from "@/service/design.service";
import { sendContactMail } from "@/utils/mailContact";

export async function GET() {
    try {
        return NextResponse.json({status:"success", message:"Successfully connected to Api"})
    } catch (error) {
        return NextResponse.json({status:"failed", message:`error: ${error}`})
    }
}

export async function PUT(req) {
    try {
      //captura de data
      const capturedForm = await req.formData();
      const result = capturedForm
      const dataToUpdate = await Object.fromEntries(capturedForm);
      return NextResponse.json({ message: "Successfully connected to Api", payload: result },{status:200});
    } catch (error) {
      return NextResponse.json({ error: `Error:${error}` }, { status: 500 });
    }
}
  
export async function POST() {
  try {
    return NextResponse.json({status:200}, {message:'successfully connected to api'})
  } catch (error) {
    return NextResponse.json({ error: `Error:${error}` }, { status: 500 });
  }
}