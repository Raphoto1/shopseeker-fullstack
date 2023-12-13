//imports de app
import { getUserInfo } from "@/service/auth.service";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {
    try {
        const capturedId = params.id;
        const user = await getUserInfo(capturedId);
        return NextResponse.json({ status: 200, payload: user });
    } catch (error) {
        return NextResponse.json({ message: `error: ${error}` });
    }
}