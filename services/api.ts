import { products } from '@/constants/mockData';
import axios from 'axios';

// Thử các URL khác nhau
const API_URLS = [
    'http://10.0.2.2:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
];

const API_URL = API_URLS[0]; // Sử dụng URL đầu tiên

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
}

export interface Notification {
    id: string;
    date: string;
    type: string;
    title: string;
    productName: string;
    productCategory: string;
    quantity: string;
    image: string;
}

export interface PlantCareGuide {
    id: number;
    name: string;
    image: string;
    tags: string[];
    stages: {
        id: number;
        title: string;
        duration: string;
        details: string[];
    }[];
}

export interface FAQ {
    id: number;
    question: string;
    answer: string;
}

export interface Transaction {
    id: string;
    userId: string;
    items: CartItem[];
    totalAmount: number;
    shippingAddress: string;
    paymentMethod: string;
    status: string;
    date: string;
}

export interface CartItem {
    productId: string;
    quantity: number;
    price: string;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    total: string;
}

export type ProductCategory = 'cayTrong' | 'chauCayTrong' | 'phuKien' | 'comboChamSoc';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    category: ProductCategory;
    image: string;
    quantity: string;
}

export const api = {
    // Authentication
    async signIn(email: string, password: string): Promise<User> {
        try {
            console.log('Signing in with:', email);
            const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const users = await response.json();
            if (users.length === 0) {
                throw new Error('Invalid email or password');
            }
            console.log('Sign in successful:', users[0]);
            return users[0]; // Trả về user đầu tiên khớp
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    },

    async signUp(userData: Omit<User, 'id'>): Promise<User> {
        try {
            // Kiểm tra xem email đã tồn tại chưa
            const checkResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
            const existingUsers = await checkResponse.json();
            if (existingUsers.length > 0) {
                throw new Error('Email already exists');
            }

            // Tạo user mới
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    id: Date.now().toString(), // Tạo ID đơn giản dựa trên timestamp
                }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const newUser = await response.json();
            console.log('Sign up successful:', newUser);
            return newUser;
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        }
    },

    // Update user profile
    async updateUser(user: User): Promise<User> {
        try {
            const response = await axios.put(`${API_URL}/users/${user.id}`, user);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    // Products
    async getProducts(): Promise<Product[]> {
        try {
            console.log('Fetching products from:', API_URL);
            const response = await fetch(`${API_URL}/products`);
            console.log('Response status:', response.status);
            if (!response.ok) {
                console.error('Response not OK:', response.status, response.statusText);
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Received data:', data.length, 'products');
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    async getProductById(id: string): Promise<Product> {
        try {
            const response = await fetch(`${API_URL}/products/${id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    async getProductsByCategory(category: string): Promise<Product[]> {
        try {
            const response = await fetch(`${API_URL}/products?category=${category}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    },

    async searchProducts(query: string): Promise<Product[]> {
        try {
            const response = await fetch(`${API_URL}/products?q=${query}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    },

    // Products Management
    async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
        try {
            const response = await axios.post(`${API_URL}/products`, product);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
        try {
            const response = await axios.put(`${API_URL}/products/${id}`, product);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    async deleteProduct(id: string): Promise<void> {
        try {
            await axios.delete(`${API_URL}/products/${id}`);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    // Notifications
    async getNotifications(): Promise<Notification[]> {
        try {
            const response = await fetch(`${API_URL}/notifications`);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    async getPlantCareGuide(id: number): Promise<PlantCareGuide> {
        try {
            const response = await axios.get(`${API_URL}/plant_care_guides`);
            // Vì chỉ có 1 guide trong db, lấy phần tử đầu tiên
            return response.data[0];
        } catch (error) {
            console.error('Error fetching plant care guide:', error);
            throw error;
        }
    },

    async getFAQs(): Promise<FAQ[]> {
        try {
            const response = await axios.get(`${API_URL}/faqs`);
            return response.data;
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            throw error;
        }
    },

    // Transaction history
    async getTransactionHistory(userId: string): Promise<Transaction[]> {
        try {
            const response = await axios.get(`${API_URL}/transactions?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching transaction history:', error);
            throw error;
        }
    },

    async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        try {
            const response = await axios.post(`${API_URL}/transactions`, transaction);
            return response.data;
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    },

    async updateTransactionStatus(transactionId: string, status: string): Promise<Transaction> {
        try {
            const response = await axios.patch(`${API_URL}/transactions/${transactionId}`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating transaction status:', error);
            throw error;
        }
    },

    // Cart
    async getCart(userId: string): Promise<Cart> {
        try {
            const response = await axios.get(`${API_URL}/carts`);
            const cart = response.data.find((cart: Cart) => cart.userId === userId);
            if (!cart) {
                // Create new cart if doesn't exist
                const newCart: Omit<Cart, 'id'> = {
                    userId,
                    items: [],
                    total: '0đ'
                };
                const createResponse = await axios.post(`${API_URL}/carts`, newCart);
                return createResponse.data;
            }
            return cart;
        } catch (error) {
            console.error('Error getting cart:', error);
            throw error;
        }
    },

    async addToCart(userId: string, item: CartItem): Promise<Cart> {
        const cart = await this.getCart(userId);
        const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId);
        
        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item
            cart.items.push(item);
        }

        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^\d]/g, ''));
            return sum + (price * item.quantity);
        }, 0).toLocaleString('vi-VN') + 'đ';

        const response = await axios.put(`${API_URL}/carts/${cart.id}`, cart);
        return response.data;
    },

    async updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart> {
        const cart = await this.getCart(userId);
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        
        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }

        cart.items[itemIndex].quantity = quantity;

        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^\d]/g, ''));
            return sum + (price * item.quantity);
        }, 0).toLocaleString('vi-VN') + 'đ';

        const response = await axios.put(`${API_URL}/carts/${cart.id}`, cart);
        return response.data;
    },

    async removeFromCart(userId: string, productId: string): Promise<Cart> {
        const cart = await this.getCart(userId);
        cart.items = cart.items.filter(item => item.productId !== productId);

        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^\d]/g, ''));
            return sum + (price * item.quantity);
        }, 0).toLocaleString('vi-VN') + 'đ';

        const response = await axios.put(`${API_URL}/carts/${cart.id}`, cart);
        return response.data;
    },

    async clearCart(userId: string): Promise<void> {
        return this.getCart(userId)
            .then(cart => {
                return axios.delete(`${API_URL}/carts/${cart.id}`);
            });
    }
}; 