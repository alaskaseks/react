import {createBrowserRouter, Link, NavLink, Outlet, RouterProvider,useNavigate, useParams, useSearchParams} from "react-router-dom";

type Category = "phones" | "laptops";

interface Product{
    id: number;
    name: string;
    category: Category;
    price: number;
    description: string;
}

const products: Product[] = [
    { id: 1, name: "iPhone 15", category: "phones", price: 999, description: "Apple smartphone with A16 chip." },
    { id: 2, name: "Galaxy S24", category: "phones", price: 899, description: "Samsung flagship with AMOLED display." },
    { id: 3, name: "Pixel 8", category: "phones", price: 699, description: "Google phone with a great camera." },
    { id: 4, name: "MacBook Air", category: "laptops", price: 1199, description: "Thin and light laptop with M2 chip." },
    { id: 5, name: "ThinkPad X1", category: "laptops", price: 1499, description: "Business laptop with a great keyboard." },
    { id: 6, name: "ASUS ROG", category: "laptops", price: 1799, description: "Powerful gaming laptop." }
];
const getLinkStyle = ({ isActive }: { isActive: boolean }) => {
    return {
        fontWeight: isActive ? "bold" : "normal",
        textDecoration: isActive ? "underline" : "none",
        color: isActive ? "tomato" : "inherit"
    };
}
function MainLayout(){
    return(
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", textAlign: "left" }}>
            <header style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid gray" }}>
                <NavLink to="/" end style={getLinkStyle}>Home</NavLink>
                <NavLink to="/products" style={getLinkStyle}>Catalog</NavLink>
            </header>

            <main style={{ flex: 1, width: "100%", maxWidth: 600, margin: "0 auto", padding: 16, boxSizing: "border-box" }}>
                <Outlet />
            </main>

            <footer style={{ padding: 16, textAlign: "center", borderTop: "1px solid gray" }}>
                Shop
            </footer>
        </div>
    )
}

function HomePage(){
    return(
        <div>
            <h1>Home</h1>
            <p>Welcome to our shop!</p>
        </div>
    )
}

function ProductsPage(){
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category");

    const visible = category ? products.filter(p => p.category === category) : products;

    return(
        <div>
            <h1>Catalog</h1>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button onClick={() => setSearchParams({})}>All</button>
                <button onClick={() => setSearchParams({ category: "phones" })}>Phones</button>
                <button onClick={() => setSearchParams({ category: "laptops" })}>Laptops</button>
            </div>

            {visible.map(p => (
                <div key={p.id} style={{ marginBottom: 12 }}>
                    <b>{p.name}</b> — ${p.price} <Link to={`/products/${p.id}`}>Details</Link>
                </div>
            ))}
        </div>
    )
}

function ProductPage(){
    const { id } = useParams();
    const navigate = useNavigate();

    const product = products.find(p => p.id === Number(id));

    if (!product) {
        return(
            <div>
                <h1>Product not found</h1>
                <Link to="/products">Back to catalog</Link>
            </div>
        )
    }

    return(
        <div>
            <button onClick={() => navigate(-1)}>Back</button>
            <h1>{product.name}</h1>
            <p>ID: {product.id}</p>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            <p>{product.description}</p>
        </div>
    )
}

function NotFoundPage(){
    return <h1>404 — Page not found</h1>;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "products", element: <ProductsPage /> },
            { path: "products/:id", element: <ProductPage /> },
            { path: "*", element: <NotFoundPage /> }
        ]
    }
]);

function App(){
    return <RouterProvider router={router} />;
}

export default App;
