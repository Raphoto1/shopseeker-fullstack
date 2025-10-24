//imports de app
import { getUserInfo, updateUserInfo } from "@/service/auth.service";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id: capturedId } = await params;
    const user = await getUserInfo(capturedId);
    return NextResponse.json({ status: 200, payload: user });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` });
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
