import { NextResponse } from "next/server";
import { getBlogBySlug } from "@/service/blog.service";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    if (!slug || slug === "undefined" || slug === "false") {
      return NextResponse.json(
        { status: "error", error: "Invalid blog slug" },
        { status: 400 }
      );
    }

    const blog = await getBlogBySlug(slug);
    return NextResponse.json({ status: "success", payload: blog });
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: `Blog not found: ${error.message}` },
      { status: 404 }
    );
  }
}
