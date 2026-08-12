import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteBlogById, getBlogById, setBlogPublishedState, updateBlogById } from "@/service/blog.service";

const hasBlogWriteAccess = (session) => {
	const role = session?.user?.role;
	const email = String(session?.user?.email || "").toLowerCase();
	return role === "admin" || role === "rafa" || email === "rafa@creativerafa.com";
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function GET(req, { params }) {
	try {
		const { id } = await params;

		if (!id || !isValidObjectId(id)) {
			return NextResponse.json(
				{ status: "error", error: "Invalid blog ID format" },
				{ status: 400 }
			);
		}

		const blog = await getBlogById(id);
		return NextResponse.json({ status: "success", payload: blog });
	} catch (error) {
		return NextResponse.json(
			{ status: "error", error: `Blog not found: ${error.message}` },
			{ status: 404 }
		);
	}
}

export async function PUT(req, { params }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !hasBlogWriteAccess(session)) {
			return NextResponse.json(
				{ status: "error", error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { id } = await params;
		if (!id || !isValidObjectId(id)) {
			return NextResponse.json(
				{ status: "error", error: "Invalid blog ID format" },
				{ status: 400 }
			);
		}

		const capturedForm = await req.formData();
		const action = capturedForm.get("action");

		let result;
		if (action === "publish") {
			result = await setBlogPublishedState(id, true);
		} else if (action === "unpublish") {
			result = await setBlogPublishedState(id, false);
		} else {
			result = await updateBlogById(id, capturedForm);
		}

		return NextResponse.json(
			{ status: "success", message: "Blog updated successfully", payload: result },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ status: "error", error: `Error updating blog: ${error.message}` },
			{ status: 500 }
		);
	}
}

export async function DELETE(req, { params }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !hasBlogWriteAccess(session)) {
			return NextResponse.json(
				{ status: "error", error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { id } = await params;
		if (!id || !isValidObjectId(id)) {
			return NextResponse.json(
				{ status: "error", error: "Invalid blog ID format" },
				{ status: 400 }
			);
		}

		const result = await deleteBlogById(id);
		return NextResponse.json({ status: "success", payload: result });
	} catch (error) {
		return NextResponse.json(
			{ status: "error", error: `Error deleting blog: ${error.message}` },
			{ status: 500 }
		);
	}
}
