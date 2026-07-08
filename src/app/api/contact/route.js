//imports de app
import { NextResponse } from "next/server";

//imports propios
import { sendContactMail } from "@/utils/mailContact";

export async function POST(req) {
  try {
    const captureInfo = await req.formData();
    const dataToPush = Object.fromEntries(captureInfo);
    const name = String(dataToPush["name"] || "").trim();
    const email = String(dataToPush["email"] || "").trim();
    const message = String(dataToPush["message"] || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message is too short" },
        { status: 400 }
      );
    }

    const response = await sendContactMail(name, email, message);
    return NextResponse.json({ status: "success", payload: response }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `Error: ${error?.message || String(error)}` }, { status: 500 });
  }
}
