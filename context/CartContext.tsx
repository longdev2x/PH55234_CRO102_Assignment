import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/services/api';
import { api } from '@/services/api';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/selectors/authSelectors';

interface CartItem {
    id: string;
    name: string;
    price: string;
    quantity: number;
    image: string;
    category?: string;
}

interface CartContextType {
    items: CartItem[];
    loading: boolean;
    error: string | null;
    addToCart: (product: Product) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const user = useAppSelector(selectUser);

    const loadCartItems = async () => {
        if (!user) {
            setItems([]);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            const cart = await api.getCart(user.id);
            
            // Transform cart items
            const cartItems: CartItem[] = [];
            
            for (const item of cart.items) {
                try {
                    const product = await api.getProductById(item.productId);
                    cartItems.push({
                        id: item.productId,
                        name: product.name,
                        price: product.price,
                        quantity: item.quantity,
                        image: product.image,
                        category: product.category
                    });
                } catch (err) {
                    console.error(`Failed to load product ${item.productId}:`, err);
                }
            }
            
            setItems(cartItems);
        } catch (err) {
            console.error('Failed to load cart:', err);
            setError(err instanceof Error ? err.message : 'Failed to load cart');
            setItems([]); // Reset items on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadCartItems();
        }
    }, [user]);

    const addToCart = async (product: Product) => {
        if (!user) return;
        
        try {
            setLoading(true);
            setError(null);

            const cartItem = {
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: 1
            };

            await api.addToCart(user.id, cartItem);
            await loadCartItems();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add item to cart');
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId: string) => {
        if (!user) return;
        try {
            setLoading(true);
            setError(null);
            await api.removeFromCart(user.id, itemId);
            await loadCartItems();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (!user) return;
        try {
            setLoading(true);
            setError(null);
            await api.updateCartItem(user.id, itemId, quantity);
            await loadCartItems();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update quantity');
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        if (!user) return;
        try {
            setLoading(true);
            setError(null);
            await api.clearCart(user.id);
            setItems([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to clear cart');
        } finally {
            setLoading(false);
        }
    };

    const getTotal = () => {
        return items.reduce((total, item) => {
            return total + (parseFloat(item.price.replace('$', '')) * item.quantity);
        }, 0);
    };

    const refreshCart = async () => {
        await loadCartItems();
    };

    return (
        <CartContext.Provider
            value={{
                items,
                loading,
                error,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotal,
                refreshCart,
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