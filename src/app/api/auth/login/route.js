//imports de app
import { NextResponse } from "next/server";

//imports propios
import { login } from "@/service/auth.service";

//30 dias 1000*60*60*24*30
//https://www.youtube.com/watch?v=md65iBX5Gxg
export async function POST(req) {
    try {
        const capturedForm = await req.formData();
        const dataToLogin = Object.fromEntries(capturedForm);
        const result = await login(dataToLogin)
        console.log(result);
        if (result) {
            console.log('entro a tokern');
            // const token = await jwt.sign({
            //     exp: Math.floor(Date.now()/1000)+60*60*24*30,
            //     userid: 'esteseriaunuseridmuylargo',
            //     role:'esteseriaelrol'
            // }, 'secrettoupdateenv')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
            // const serializedToken = serialize('creativeToken', token, {
            //     httpOnly: true,
            //     secure: false,
            //     sameSite: 'none',
            //     maxAge: 1000 * 60 * 60 * 24 * 30,
            //     path:'/'
            // });
        }
        // NextResponse.setHeader('Set-Cookie',serializedToken)
        // console.log(token);
        return NextResponse.json({status:200, message:'success'})
    } catch (error) {
        return NextResponse.json({error: `Error${error}`}, {status: 401})
    }
}