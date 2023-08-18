//imports propios
import { createDesign, getAllDesigns, updateDesign } from "@/service/design.service";
//imports app
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    let designs = await getAllDesigns();
    return NextResponse.json({ status: "success", payload: designs });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` });
  }
}

export async function POST(req) {
  try {
    //capturar data
    const capturedForm = await req.formData();
    //enviar data al service
    const result = await createDesign(capturedForm);
    return NextResponse.json({ payload: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: `Error:${error}` }, { status: 500 });
  }
}
export async function PUT(req) {
  try {
    //captura de data
    const capturedForm = await req.formData();
    const result = await updateDesign(capturedForm);
    return NextResponse.json({ message: "hola", payload: result });
  } catch (error) {
    return NextResponse.json({ error: `Error:${error}` }, { status: 500 });
  }
}
