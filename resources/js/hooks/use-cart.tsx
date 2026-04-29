import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: number;
    name: string;
    price: number | string;
    quantity: number;
    notes?: string;
}

interface CartContextType {
    items: CartItem[];
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    addItem: (item: Omit<CartItem, 'quantity' | 'notes'>) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    updateNotes: (id: number, notes: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isCartOpen, setCartOpen] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("Ocean's Resto_cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse cart:', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Persist to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("Ocean's Resto_cart", JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        setItems(current => {
            const existing = current.find(i => i.id === item.id);
            if (existing) {
                return current.map(i => 
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...current, { ...item, quantity: 1 }];
        });
        setCartOpen(true); // Auto-open cart when adding item
    };

    const removeItem = (id: number) => {
        setItems(current => current.filter(i => i.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) {
            removeItem(id);
            return;
        }
        setItems(current => 
            current.map(i => i.id === id ? { ...i, quantity } : i)
        );
    };

    const updateNotes = (id: number, notes: string) => {
        setItems(current => 
            current.map(i => i.id === id ? { ...i, notes } : i)
        );
    };

    const clearCart = () => setItems([]);

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            isCartOpen,
            setCartOpen,
            addItem,
            removeItem,
            updateQuantity,
            updateNotes,
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

