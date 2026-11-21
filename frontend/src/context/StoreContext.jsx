import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

import { products as seedProducts } from '../data';

const Store = createContext(null);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const normalize = p => ({
    ...p,
    id: p._id || p.id,
    price: Number(p.price || 0),
    image: p.image || p.images?.[0] || ''
});

export function StoreProvider({ children }) {

    const [cart, setCart] = useState(
        () => JSON.parse(localStorage.getItem('av_jewellery-cart') || '[]')
    );

    const [wish, setWish] = useState(
        () => JSON.parse(localStorage.getItem('av_jewellery-wish') || '[]')
    );

    const [user, setUser] = useState(
        () => JSON.parse(localStorage.getItem('av_user') || 'null')
    );

    const [token, setToken] = useState(
        () => localStorage.getItem('av_token')
    );

    const [products, setProducts] = useState(seedProducts);
    const [apiReady, setApiReady] = useState(false);

    const authHeaders = () =>
        token ? { Authorization: `Bearer ${token}` } : {};

    useEffect(() => {
        localStorage.setItem('av_jewellery-cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('av_jewellery-wish', JSON.stringify(wish));
    }, [wish]);

    useEffect(() => {
        fetch(`${API}/products`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.length > 0) {
                    setProducts(data.map(normalize));
                } else {
                    setProducts(seedProducts.map(normalize));
                }

                setApiReady(true);
            })
            .catch((error) => {
                console.error('Products API Error:', error);
                setProducts(seedProducts.map(normalize));
                setApiReady(false);
            });
    }, []);

    const refreshProducts = async () => {
        try {
            const r = await fetch(`${API}/products`);

            if (r.ok) {
                setProducts((await r.json()).map(normalize));
                setApiReady(true);
            }
        } catch { }
    };

    const saveAuth = data => {
        setToken(data.token);
        setUser(data.user);

        localStorage.setItem('av_token', data.token);
        localStorage.setItem('av_user', JSON.stringify(data.user));
    };

    const login = async payload => {
        const r = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const d = await r.json();

        if (!r.ok) throw new Error(d.message || 'Login failed');

        saveAuth(d);
        return d;
    };

    const signup = async payload => {
        const r = await fetch(`${API}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const d = await r.json();

        if (!r.ok) throw new Error(d.message || 'Sign up failed');

        saveAuth(d);
        return d;
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem('av_token');
        localStorage.removeItem('av_user');
    };

    const add = p => setCart(old => {
        const id = p.id || p._id;
        const f = old.find(x => String(x.id) === String(id));

        return f
            ? old.map(x =>
                String(x.id) === String(id)
                    ? { ...x, qty: x.qty + 1 }
                    : x
            )
            : [...old, { ...normalize(p), qty: 1 }];
    });

    const remove = id =>
        setCart(old => old.filter(x => String(x.id) !== String(id)));

    const qty = (id, n) =>
        setCart(old => old.map(x =>
            String(x.id) === String(id)
                ? { ...x, qty: Math.max(1, Number(n) || 1) }
                : x
        ));

    const toggleWish = p =>
        setWish(old =>
            old.some(x => String(x.id) === String(p.id || p._id))
                ? old.filter(x => String(x.id) !== String(p.id || p._id))
                : [...old, normalize(p)]
        );

    const placeOrder = async customer => {
        if (!token) throw new Error('Please log in to place your order');

        const r = await fetch(`${API}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders()
            },
            body: JSON.stringify({
                customer,
                items: cart.map(x => ({
                    productId: x.id,
                    qty: x.qty
                }))
            })
        });

        const d = await r.json();

        if (!r.ok) throw new Error(d.message || 'Order failed');

        setCart([]);
        await refreshProducts();

        return d;
    };

    return (
        <Store.Provider value={{
            cart,
            wish,
            user,
            token,
            products,
            apiReady,
            authHeaders,
            login,
            signup,
            logout,
            add,
            remove,
            qty,
            toggleWish,
            refreshProducts,
            placeOrder,
            setUser
        }}>
            {children}
        </Store.Provider>
    );
}

export const useStore = () => useContext(Store);
