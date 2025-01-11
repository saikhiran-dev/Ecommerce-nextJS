import { ConnectToDb } from "../db";


export async function GET(){
    // connecting to mongoDB and getting prodcust direclty from db
    const {db} = await ConnectToDb();
    const products = await db.collection('products').find({}).toArray();

    return new Response(JSON.stringify(products), {
        status:200,
        headers : {
            'Content-Type': 'application/json'
        }
    });
}