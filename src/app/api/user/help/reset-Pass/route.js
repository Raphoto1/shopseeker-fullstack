import { generateResetPass, resetPass } from "@/service/auth.service";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const capturedForm = await req.formData();
    const userEmail = capturedForm.get("email");
    const genToken = await generateResetPass(userEmail);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    const capturedForm = await req.formData();
    const uEmail = capturedForm.get("email");
    const password = capturedForm.get("newPass");
    const token = capturedForm.get("token");
    const result = await resetPass(uEmail, password, token);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 401 });
  }
}
