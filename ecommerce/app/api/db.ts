import { Db, MongoClient, ServerApiVersion } from 'mongodb';

let cachedClient : MongoClient | null = null;
let cachedDb : Db | null = null;

export async function ConnectToDb(){

    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb}
    }
    
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.60lhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });
    
    await client.connect();

    cachedClient = client;
    cachedDb = client.db('ecommerce-nextjs');
    
    return { client, db: client.db('ecommerce-nextjs') };
}
