import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createBlog, getAllBlogs } from "@/service/blog.service";

const hasBlogWriteAccess = (session) => {
	const role = session?.user?.role;
	const email = String(session?.user?.email || "").toLowerCase();
	return role === "admin" || role === "rafa" || email === "rafa@creativerafa.com";
};

export async function GET(req) {
	try {
		const url = new URL(req.url);
		const limit = url.searchParams.get("limit");
		const page = url.searchParams.get("page");
		const sortField = url.searchParams.get("sortField");
		const sortQ = url.searchParams.get("sortQ");
		const filterCat = url.searchParams.get("filterCat");
		const search = url.searchParams.get("search");
		const published = url.searchParams.get("published");
		const owner = url.searchParams.get("owner");

		const blogs = await getAllBlogs(limit, page, sortField, sortQ, filterCat, search, published, owner);

		return NextResponse.json(
			{ status: "success", payload: blogs },
			{
				headers: {
					"Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
				},
			}
		);
	} catch (error) {
		console.error("Error fetching blogs:", error);
		return NextResponse.json(
			{ status: "error", error: `Error fetching blogs: ${error.message}` },
			{ status: 500 }
		);
	}
}

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !hasBlogWriteAccess(session)) {
			return NextResponse.json(
				{ status: "error", error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const capturedForm = await req.formData();

		if (!capturedForm.has("title") || !capturedForm.has("excerpt") || !capturedForm.has("cover")) {
			return NextResponse.json(
				{ status: "error", error: "Missing required fields: title, excerpt or cover" },
				{ status: 400 }
			);
		}

		const result = await createBlog(capturedForm, session.user);
		return NextResponse.json(
			{ status: "success", message: "Blog created successfully", payload: result },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating blog:", error);
		return NextResponse.json(
			{ status: "error", error: `Error creating blog: ${error.message}` },
			{ status: 500 }
		);
	}
}
