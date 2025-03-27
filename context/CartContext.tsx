import React, { createContext, useContext, useState } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: string;
    quantity: number;
    image: string;
    category?: string;
    label?: string;
    size?: string;
    origin?: string;
    status?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (newItem: CartItem) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === newItem.id);
            if (existingItem) {
                // Update quantity if item exists
                return currentItems.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            // Add new item if it doesn't exist
            return [...currentItems, newItem];
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        setItems(currentItems =>
            currentItems.map(item =>
                item.id === itemId
                    ? { ...item, quantity: Math.max(0, quantity) }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getTotal = () => {
        return items.reduce((total, item) => {
            const price = parseInt(item.price.replace(/\D/g, ''));
            return total + (price * item.quantity);
        }, 0);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotal,
            }}
        >
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