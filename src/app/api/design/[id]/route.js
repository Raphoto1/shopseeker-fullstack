import { getDesignById, deleteDesign } from "@/service/design.service";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {
    try {
        const id = params.id;
        const design = await getDesignById(id);
      return NextResponse.json({ status: "success", payload: design });
    } catch (error) {
      return NextResponse.json({ message: `error: ${error}` });
    }
}
  
export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    const design = await deleteDesign(id);
    return NextResponse.json({ status: "success", payload: design });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` },{status:500});
  }
}