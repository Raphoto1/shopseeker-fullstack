//imports de app
import { register } from "@/service/auth.service";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const capturedForm = await req.formData();
    const dataToLogin = Object.fromEntries(capturedForm);
    const result = await register(dataToLogin);
    const responsePack = {
      name: result.name,
      role: result.role,
      isAdmin: result.isAdmin,
    };
    return NextResponse.json({ responsePack }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 401 });
  }
}
