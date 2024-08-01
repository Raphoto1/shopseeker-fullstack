//imports de app
import { NextResponse } from "next/server";

//imports propios
import { sendContactMail } from "@/utils/mailContact";

export async function POST(req) {
  try {
    const captureInfo = await req.formData();
    const dataToPush = Object.fromEntries(captureInfo);
    const name = dataToPush["name"];
    const email = dataToPush["email"];
    const message = dataToPush["message"];
    const response = await sendContactMail(name, email, message);
    return NextResponse.json({ payload: response }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `Error: ${error}` }, { status: 500 });
  }
}
