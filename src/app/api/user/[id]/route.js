//imports de app
import { getUserInfo, updateUserInfo } from "@/service/auth.service";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id: capturedId } = await params;
    
    // 🔧 Validar que capturedId existe
    if (!capturedId) {
      return NextResponse.json(
        { status: 400, message: "User ID is required" },
        { status: 400 }
      );
    }
    
    const user = await getUserInfo(capturedId);
    
    // 🔧 Validar que el usuario existe
    if (!user) {
      return NextResponse.json(
        { status: 404, message: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ status: 200, payload: user });
  } catch (error) {
    console.error("GET /api/user/[id] error:", error);
    return NextResponse.json(
      { status: 500, message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id: uId } = await params;
    const capturedForm = await req.formData();
    const chkUser = await getUserInfo(uId);
    if (chkUser) {
      const result = await updateUserInfo(chkUser, capturedForm);
      return NextResponse.json({ status: 200, payload: result });
    } else {
      throw new Error(message, "user does not exist");
    }
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` });
  }
}
