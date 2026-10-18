import { createBrowserRouter, Link, NavLink, Outlet, RouterProvider } from "react-router-dom";
import "./less5.css";

interface Movie{
    id: number;
    title: string;
    year: number;
    genre: string;
}

const movies: Movie[] = [
    { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi" },
    { id: 2, title: "The Matrix", year: 1999, genre: "Sci-Fi" },
    { id: 3, title: "Interstellar", year: 2014, genre: "Adventure" },
    { id: 4, title: "The Godfather", year: 1972, genre: "Crime" },
    { id: 5, title: "Pulp Fiction", year: 1994, genre: "Crime" },
    { id: 6, title: "Gladiator", year: 2000, genre: "Action" }
];

const getLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return isActive ? "active" : "";
}
function RootLayout(){
    return(
        <div className="layout">
            <header>
                <h1>Movie Catalog</h1>
            </header>

            <div className="body">
                <aside className="sidebar">
                    <NavLink to="/" end className={getLinkClass}>Home</NavLink>
                    <NavLink to="/catalog" className={getLinkClass}>Catalog</NavLink>
                    <NavLink to="/about" className={getLinkClass}>About</NavLink>
                </aside>

                <main className="content">
                    <Outlet />
                </main>
            </div>

            <footer>Movie Catalog</footer>
        </div>
    )
}

function HomePage(){
    return(
        <div>
            <h2>Home</h2>
            <p>Open the catalog to see movies</p>
            <Link to="/catalog">Go to catalog</Link>
        </div>
    )
}

function CatalogPage(){
    return(
        <div>
            <h2>Catalog</h2>
            <div className="cards">
                {movies.map(movie => (
                    <div key={movie.id} className="card">
                        <h3>{movie.title}</h3>
                        <p>{movie.year}</p>
                        <p>{movie.genre}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function AboutPage(){
    return(
        <div>
            <h2>About</h2>
            <p>Nothing interesting</p>
        </div>
    )
}

function NotFoundPage(){
    return(
        <div>
            <h2>Page not found</h2>
            <Link to="/">Go home</Link>
        </div>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "catalog", element: <CatalogPage /> },
            { path: "about", element: <AboutPage /> },
            { path: "*", element: <NotFoundPage /> }
        ]
    }
]);

function App(){
    return <RouterProvider router={router} />;
}

export default App;
