import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthState();
    }, []);

    // Using AsyncStorage (like SharedPreferences in Flutter)
    const checkAuthState = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            setIsAuthenticated(!!token);
        } catch (error) {
            console.error('Error checking auth state:', error);
        }
    };

    // Using AsyncStorage (like SharedPreferences in Flutter)
    const signIn = async (email: string, password: string) => {
        try {
            await AsyncStorage.setItem('userToken', 'dummy-token');
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    };

    // Using AsyncStorage (like SharedPreferences in Flutter)
    const signUp = async (email: string, password: string) => {
        try {
            await AsyncStorage.setItem('userToken', 'dummy-token');
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        }
    };

    // Using AsyncStorage (like SharedPreferences in Flutter)
    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 