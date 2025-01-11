
import { NextRequest } from "next/server";
import { ConnectToDb } from "../../db";

type Params = {
    id: string;
}

export async function GET( request : NextRequest, {params} : {params : Params}) {
    const {db} = await ConnectToDb();
    const productId = params.id;

    // checking if the given params id can be found in products object.
    const product = await db.collection('products').findOne({id:productId});

    //  else return 404.
    if(!product) {
        return new Response('Product Not Found!', {
            status: 404,
        });
    }
    // if product is found, status 200
    return new Response(JSON.stringify(product), {
        status: 200,
        headers : {
            'Content-Type' : 'application/json',
        }
    });
}