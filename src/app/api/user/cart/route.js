import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        return NextResponse.json({ error: 'No Cart provided' }, { status: 404 })
    } catch (error) {
        return NextResponse.json({message: `error: ${error}`},{status:500});
    }
}