// import { products } from "@/app/product-data";
import { NextRequest } from "next/server";
import { ConnectToDb } from "@/app/api/db";
import { ReturnDocument } from "mongodb";

type ShoppingCart = Record<string, string[]>

const carts : ShoppingCart = {
    '1' : ['123', '234'],
    '2' : ['345', '456'],
    '3' : ['234'],
}

type Params = {
    id : string,
}

export async function GET(request: NextRequest, {params}: {params: Params} ) {
    const {db} = await ConnectToDb();

    const userId = params.id; //getting userId from params
    const userCart = await db.collection('carts').findOne({userId}); // finding user's cart in DB by userId

    if(!userCart) {
        return new Response(JSON.stringify([]), {
            status:200,
            headers : {
                'Content-Type' : 'application/json',
            },
        });
    }
    const cartIds = userCart.cartIds;
    // search through products
    const cartProducts = await db.collection('products').find({id : {$in : cartIds}}).toArray();
    
    return new Response(JSON.stringify(cartProducts), {
        status:200,
        headers : {
            'Content-Type' : 'application/json',
        },
    });
}

type CartBody = {
    productId: string;
}

//add to cart endpoint
export async function POST(request: NextRequest, {params}: {params: Params}) {
    const {db} = await ConnectToDb();
    const userId=params.id;
    const body : CartBody = await request.json();
    const productId = body.productId;

    const updatedCart = await db.collection('carts').findOneAndUpdate(
        { userId },
        { $push : {cartIds : productId} },
        {upsert: true, returnDocument: 'after'},
    )
     
    const cartProducts = await db.collection('products').find({id : {$in : updatedCart.cartIds}}).toArray();
    return new Response(JSON.stringify(cartProducts), {
        status:201,
        headers : {
            'Content-Type' : 'application/json'
        },
    });
}

// remove from cart endpoint
export async function DELETE(request: NextRequest, {params}: {params: Params}) {
    const {db} = await ConnectToDb();
    const userId = params.id;
    const body = await request.json();
    const productId = body.productId;

    const updatedCart = await db.collection('carts').findOneAndUpdate(
        {userId},
        {$pull : {cartIds : productId}},
        { returnDocument: 'after' },
    )
    if(!updatedCart) {
        return new Response(JSON.stringify([]), {
            status:202,
            headers :{
                'Content-Type': 'application/json'
            },
        });
    }

    const cartProducts = await db.collection('products').find({id : {$in : updatedCart.cartIds}}).toArray();
    return new Response(JSON.stringify(cartProducts), {
        status:202,
        headers :{
            'Content-Type': 'application/json'
        },
    });
}
