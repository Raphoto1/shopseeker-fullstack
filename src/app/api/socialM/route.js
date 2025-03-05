//imports de app
import { getInstagramPosts } from "@/service/socialM.service";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
      const instaPosts = await getInstagramPosts();
      console.log(instaPosts);
      
    return NextResponse.json({ instaPosts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching Instagram posts" }, { status: 500 });
  }
}
