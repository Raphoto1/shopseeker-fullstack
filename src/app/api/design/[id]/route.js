import { getUserInfo } from "@/service/auth.service";
import { addToCart, getCart } from "@/service/cart.service";
import { getDesignById, deleteDesign, likeDesign } from "@/service/design.service";
import { NextResponse } from "next/server";

//diseno directo
export async function GET(req, { params }) {
  try {
    const id = params.id;
    const design = await getDesignById(id);
    return NextResponse.json({ status: "success", payload: design });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` });
  }
}

//borrar diseno
export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    const design = await deleteDesign(id);
    return NextResponse.json({ status: "success", payload: design });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` }, { status: 500 });
  }
}
//like
export async function PUT(req, { params }) {
  try {
    const id = params.id;
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
