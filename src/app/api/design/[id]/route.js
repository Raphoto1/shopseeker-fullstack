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

export async function PUT(req, { params }) {
  try {
    const id = params.id
    const url = new URL(req.url);
    const value = url.searchParams.get("value");
    const liked = await likeDesign(id, value);
    return NextResponse.json({ status: "success", payload: liked });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` }, { status: 500 });
  }
}
