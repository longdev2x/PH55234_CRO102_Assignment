import { Product } from '@/constants/mockData';
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
    phone: string;
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
    date: string;
    type: 'success' | 'cancelled';
    title: string;
    productName: string;
    productCategory: string;
    quantity: string;
    image: string;
    userId: string;
    orderId: string;
    totalAmount: number;
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

    async updateTransactionStatus(transactionId: string, type: 'success' | 'cancelled'): Promise<Transaction> {
        try {
            const response = await axios.patch(`${API_URL}/transactions/${transactionId}`, { type });
            return response.data;
        } catch (error) {
            console.error('Error updating transaction status:', error);
            throw error;
        }
    }
}; 