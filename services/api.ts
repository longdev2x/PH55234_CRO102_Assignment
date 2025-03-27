import { Product } from '@/constants/mockData';

const API_URL = 'http://10.0.2.2:3000';

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

export const api = {
    // Products
    async getProducts(): Promise<Product[]> {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
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
    }
}; 