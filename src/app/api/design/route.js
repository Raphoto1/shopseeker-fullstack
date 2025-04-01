//imports propios
import { createDesign, getAllDesigns, updateDesign } from "@/service/design.service";
import { stringifyError } from "next/dist/shared/lib/utils";
//imports app
import { NextResponse } from "next/server";

//todos los productos
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParam = url.searchParams.get("search");
    const queryKey = url.searchParams.get("queryKey");
    const limit = url.searchParams.get("limit");
    const page = url.searchParams.get("page");
    const sortField = url.searchParams.get("sortField");
    const sortQ = url.searchParams.get("sortQ");
    const filterCat = url.searchParams.get("filterCat");
    const filterShop = url.searchParams.get("filterShop");
    const userId = url.searchParams.get("userId");

    const designs = await getAllDesigns(limit, page, sortField, sortQ, queryKey, searchParam, filterCat, filterShop, userId);

    return NextResponse.json({ status: "success", payload: designs });
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json({ message: `Error fetching designs: ${stringifyError(error)}` }, { status: 500 });
  }
}

//agregar diseño
export async function POST(req) {
  try {
    // Capturar datos del formulario
    const capturedForm = await req.formData();

    // Validar datos requeridos
    if (!capturedForm.has("owner") || !capturedForm.has("photo")) {
      return NextResponse.json({ error: "Missing required fields: 'owner' or 'photo'" }, { status: 400 });
    }

    // Enviar datos al servicio
    const result = await createDesign(capturedForm);
    // console.log("Design created:", result);

    return NextResponse.json({ message: "success", payload: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating design:", error);
    return NextResponse.json({ error: `Error creating design: ${stringifyError(error)}` }, { status: 500 });
  }
}

//actualizar diseño
export async function PUT(req) {
  try {
    // Capturar datos del formulario
    const capturedForm = await req.formData();

    // Validar datos requeridos
    if (!capturedForm.has("id")) {
      return NextResponse.json({ error: "Missing required field: 'id'" }, { status: 400 });
    }

    // Enviar datos al servicio
    const result = await updateDesign(capturedForm);
    console.log("Design updated:", result);

    return NextResponse.json({ message: "success", payload: result, status: 200 });
  } catch (error) {
    console.error("Error updating design:", error);
    return NextResponse.json({ error: `Error updating design: ${stringifyError(error)}` }, { status: 500 });
  }
}
