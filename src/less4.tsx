import { useState } from "react";

type RequestState =
    | { status: "loading" }
    | { status: "success"; data: number[] }
    | { status: "error"; message: string };

const getStateMessage = (state: RequestState): string => {
    if (state.status === "loading") return "Loading...";
    if (state.status === "success") return `Items received: ${state.data.length}`;
    return `Error: ${state.message}`;
}

type Role = "admin" | "user" | "guest";

interface User{
    readonly id: number;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

const getAvatar = (user: User): string => {
    return user.avatar ?? "/default-avatar.png";
}

type Currency = "USD" | "EUR" | "UAH";

const formatMoney = (amount: number, currency: Currency, showSymbol: boolean = false): string => {
    if (!showSymbol) return `${amount} ${currency}`;
    switch (currency) {
        case "USD": return `$${amount}`;
        case "EUR": return `€${amount}`;
        case "UAH": return `₴${amount}`;
    }
}

interface Product{
    id: number;
    title: string;
    price: number;
}

const filterByMaxPrice = (products: Product[], maxPrice: number): Product[] => {
    const result: Product[] = [];
    products.forEach(p => {
        if (p.price <= maxPrice) result.push(p);
    });
    return result;
}

interface ApiResponse<T>{
    data: T;
    status: number;
    timestamp: Date;
}

const getUserResponse = (): ApiResponse<User> => {
    return {
        data: { id: 1, name: "Anna", email: "anna@mail.com", role: "user" },
        status: 200,
        timestamp: new Date()
    };
}

const getProductsResponse = (): ApiResponse<Product[]> => {
    return {
        data: [{ id: 1, title: "Mouse", price: 20 }, { id: 2, title: "Keyboard", price: 50 }],
        status: 200,
        timestamp: new Date()
    };
}

class HttpError extends Error{
    readonly statusCode: number;

    constructor(message: string, statusCode: number){
        super(message);
        this.statusCode = statusCode;
    }

    getFormattedMessage(): string {
        return `[${this.statusCode}] ${this.message}`;
    }
}

class RequestService{
    private readonly baseUrl: string;
    private cache: Record<string, any> = {};

    constructor(baseUrl: string){
        this.baseUrl = baseUrl;
    }

    async getData<T>(path: string): Promise<T> {
        if (this.cache[path]) {
            return this.cache[path];
        }
        const response = await fetch(this.baseUrl + path);
        if (!response.ok) {
            throw new HttpError(response.statusText, response.status);
        }
        const data = await response.json();
        this.cache[path] = data;
        return data;
    }
}

interface CartItem{
    product: Product;
    quantity: number;
}

class Cart{
    private items: CartItem[] = [];

    add(product: Product): void {
        let found = false;
        this.items.forEach(item => {
            if (item.product.id === product.id) {
                item.quantity++;
                found = true;
            }
        });
        if (!found) {
            this.items.push({ product, quantity: 1 });
        }
    }

    remove(productId: number): void {
        const left: CartItem[] = [];
        this.items.forEach(item => {
            if (item.product.id !== productId) left.push(item);
        });
        this.items = left;
    }

    getTotal(): number {
        let total = 0;
        this.items.forEach(item => {
            total += item.product.price * item.quantity;
        });
        return total;
    }
    getItems(): Readonly<CartItem[]> {
        return this.items.map(item => ({ ...item }));
    }
}

const mouse: Product = { id: 1, title: "Mouse", price: 20 };
const keyboard: Product = { id: 2, title: "Keyboard", price: 50 };

const states: RequestState[] = [
    { status: "loading" },
    { status: "success", data: [1, 2, 3] },
    { status: "error", message: "Not found" }
];

const userNoAvatar: User = { id: 1, name: "Anna", email: "anna@mail.com", role: "admin" };
const userWithAvatar: User = { id: 2, name: "Ivan", email: "ivan@mail.com", role: "user", avatar: "/ivan.png" };

const service = new RequestService("https://dummyjson.com");
const cart = new Cart();

function App(){
    const [usersText, setUsersText] = useState<string>("Not loaded yet");
    const [items, setItems] = useState<Readonly<CartItem[]>>([]);
    const [total, setTotal] = useState<number>(0);

    const userResponse = getUserResponse();
    const productsResponse = getProductsResponse();
    const err = new HttpError("Not found", 404);

    const loadUsers = () => {
        setUsersText("Loading...");
        service.getData<{ users: User[] }>("/users")
            .then(r => setUsersText(`Users received: ${r.users.length}`))
            .catch(e => setUsersText(`Error: ${e.message}`));
    }

    const refreshCart = () => {
        setItems(cart.getItems());
        setTotal(cart.getTotal());
    }

    const addToCart = (product: Product) => {
        cart.add(product);
        refreshCart();
    }

    const removeFromCart = (id: number) => {
        cart.remove(id);
        refreshCart();
    }

    return(
        <div>
            <h2>1. Request state</h2>
            {states.map((s, i) => (
                <p key={i}>{getStateMessage(s)}</p>
            ))}

            <h2>2. Avatar</h2>
            <p>{userNoAvatar.name}: {getAvatar(userNoAvatar)}</p>
            <p>{userWithAvatar.name}: {getAvatar(userWithAvatar)}</p>

            <h2>3. Money and filter</h2>
            <p>{formatMoney(1234.5, "USD")}</p>
            <p>{formatMoney(1234.5, "UAH", true)}</p>
            <p>Products up to 30:</p>
            {filterByMaxPrice([mouse, keyboard], 30).map(p => (
                <p key={p.id}>{p.title} — {formatMoney(p.price, "USD", true)}</p>
            ))}

            <h2>4. Generic responses</h2>
            <p>User: {userResponse.data.name}, status {userResponse.status}, time {String(userResponse.timestamp)}</p>
            <p>Products: {productsResponse.data.length}, status {productsResponse.status}</p>

            <h2>5. Error</h2>
            <p>{err.getFormattedMessage()}</p>

            <h2>6. Service with cache</h2>
            <button onClick={loadUsers} className="border border-solid">Load users</button>
            <p>{usersText}</p>

            <h2>7. Cart</h2>
            {[mouse, keyboard].map(p => (
                <div key={p.id}>
                    <span>{p.title} ({p.price}) </span>
                    <button onClick={() => addToCart(p)} className="border border-solid">+</button>
                    <button onClick={() => removeFromCart(p.id)} className="border border-solid">Remove</button>
                </div>
            ))}
            {items.map(item => (
                <p key={item.product.id}>{item.product.title} × {item.quantity}</p>
            ))}
            <p>Total: {total}</p>
        </div>
    )
}

export default App;
