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
    //sorts
    const limit = url.searchParams.get("limit");
    const page = url.searchParams.get("page");
    const sortField = url.searchParams.get("sortField");
    //sortQ pegado a title
    const sortQ = url.searchParams.get("sortQ");
    const filterCat = url.searchParams.get("filterCat");
    const filterShop = url.searchParams.get("filterShop");
    const userId = url.searchParams.get('userId');
    let designs = await getAllDesigns(limit, page, sortField, sortQ, queryKey, searchParam, filterCat, filterShop,userId);
    return NextResponse.json({ status: "success", payload: designs });
  } catch (error) {
    return NextResponse.json({ message: `error: ${error}` });
  }
};

//agregar diseno
export async function POST(req) {
  try {
    //capturar data
    const capturedForm = await req.formData();
    //enviar data al service
    const result = await createDesign(capturedForm);
    return NextResponse.json({ payload: result }, { status: 201 });
  } catch (error) {
    console.log(`desde route${stringifyError(error)}`);
    return NextResponse.json({ error: `Error:${stringifyError(error)}` }, { status: 500 });
  }
};

//actualizar diseño
export async function PUT(req) {
  try {
    //captura de data
    const capturedForm = await req.formData();
    const result = await updateDesign(capturedForm);
    return NextResponse.json({ message: "success", payload: result, status: 200  });
  } catch (error) {
    return NextResponse.json({ error: `Error:${error}` }, { status: 500 });
  }
}
