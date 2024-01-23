//imports de app
import { getUserInfo, updateUserInfo } from "@/service/auth.service";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const capturedId = params.id;
    const user = await getUserInfo(capturedId);
    return NextResponse.json({ status: 200, payload: user });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` });
  }
}

export async function PUT(req, { params }) {
  try {
    const uId = params.id;
    const capturedForm = await req.formData();
      const chkUser = await getUserInfo(uId);
      if (chkUser) {
          const result = await updateUserInfo(chkUser,capturedForm);
      } else {
        throw new Error(message,'user does not exist')
      }
    return NextResponse.json({ status: 200, payload: result });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` });
  }
}
