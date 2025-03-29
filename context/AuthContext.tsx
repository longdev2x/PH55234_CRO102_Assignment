import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api, User } from '@/services/api'; // Đường dẫn đến file api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
    user: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook để bảo vệ các route yêu cầu đăng nhập
function useProtectedRoute(user: User | null) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = segments[0] === 'auth';

        if (!user && !inAuthGroup) {
            // Chuyển hướng đến màn hình đăng nhập nếu chưa đăng nhập
            router.replace('/auth/sign-in');
        } else if (user && inAuthGroup) {
            // Chuyển hướng đến màn hình chính nếu đã đăng nhập
            router.replace('/(tabs)');
        }
    }, [user, segments]);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    useProtectedRoute(user);

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập khi khởi động app
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error checking user:', error);
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            const signedInUser = await api.signIn(email, password);
            await AsyncStorage.setItem('user', JSON.stringify(signedInUser));
            setUser(signedInUser);
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string, name: string, phone: string) => {
        try {
            const newUser = await api.signUp({ name, email, password, phone });
            await AsyncStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};