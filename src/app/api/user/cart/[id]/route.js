//imports de app
import { clearCart, getCart } from "@/service/cart.service";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const cartId = params.id
        if (cartId==='') {
            throw new Error(message, "No Cart Id Provided");
        }
        const cart = await getCart(cartId);
        return NextResponse.json({status:200,payload:cart})
    } catch (error) {
        return NextResponse.json({message: `error: ${error}`},{status:404});
    }
}

export async function PATCH(req,{params}) {
    try {
        const cartId =  params.id
        const cart = await clearCart(cartId);
        return NextResponse.json({status:200,payload:cart})
    } catch (error) {
        return NextResponse.json({ message: `error: ${error}` });
    }
}