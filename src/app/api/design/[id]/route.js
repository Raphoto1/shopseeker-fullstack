import { getUserInfo } from "@/service/auth.service";
import { addToCart, getCart } from "@/service/cart.service";
import { getDesignById, deleteDesign, likeDesign } from "@/service/design.service";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

//diseno directo
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    // Validar que el ID sea válido
    if (!id || id === 'undefined' || id === 'false') {
      return NextResponse.json(
        { status: "error", message: "Invalid design ID" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { status: "error", message: "Design ID format is invalid" },
        { status: 400 }
      );
    }

    const design = await getDesignById(id);
    
    if (!design) {
      console.warn(`DEBUG: No design found for ID: ${id}`);
      return NextResponse.json(
        { status: "error", message: "Design not found" },
        { status: 404 }
      );
    }

    // Changed to return 200 explicitly
    return NextResponse.json({ status: "success", payload: design }, { status: 200 });
  } catch (error) {
    console.error("DEBUG: Error fetching design:", error);
    return NextResponse.json(
      { status: "error", message: `Design not found: ${error.message}` },
      { status: 404 }
    );
  }
}

//borrar diseno
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const design = await deleteDesign(id);
    return NextResponse.json({ status: "success", payload: design });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` }, { status: 500 });
  }
}
//like
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const value = url.searchParams.get("value");
    const capturedForm = await req.formData();
    const userId = capturedForm.get("userId");
    let userCart = null;
    if (userId === 'null') {
      console.log("no hay user");
    } else {
      const user = await getUserInfo(userId);
      userCart = user.cart;
    }
    const liked = await likeDesign(id, value, userCart);
    return NextResponse.json({ status: 200, payload: liked });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` }, { status: 500 });
  }
}
