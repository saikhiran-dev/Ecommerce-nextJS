import ProductsList from "../ProductsList";
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {

    const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL+'/api/products');
    const products = await response.json();

    const response2 = await fetch(process.env.NEXT_PUBLIC_SITE_URL+'/api/users/2/cart', {
        cache: 'no-cache',
    });
    const cartProducts = response2.json();
    return (
    <div className="container mt-4" >
        <h1 className="text-3xl mb-4">Products</h1>
        <ProductsList products={products} initialCartProducts={cartProducts} />
    </div>
    )
}