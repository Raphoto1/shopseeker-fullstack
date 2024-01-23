//imports de app
import { clearCart, getCart } from "@/service/cart.service";
import { NextResponse } from "next/server";

export async function GET(req,{params}) {
    try {
        const cartId =  params.id
        const cart = await getCart(cartId);
        return NextResponse.json({status:200,payload:cart})
    } catch (error) {
        return NextResponse.json({ message: `error: ${error}` });
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