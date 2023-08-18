import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({status:"success", message:"Successfully connected to Api"})
    } catch (error) {
        return NextResponse.json({status:"failed", message:`error: ${error}`})
    }
}