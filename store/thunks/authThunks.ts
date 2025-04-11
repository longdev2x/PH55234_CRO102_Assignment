import { createAsyncThunk } from '@reduxjs/toolkit';
import { api, User } from '@/services/api';
import { loginSuccess, loginFailure, setLoading } from '../slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signIn = createAsyncThunk(
    'auth/signIn',
    async ({ email, password }: { email: string; password: string }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const user = await api.signIn(email, password);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            dispatch(loginSuccess(user));
            return user;
        } catch (error: any) {
            dispatch(loginFailure(error.message || 'Invalid email or password'));
            throw error;
        }
    }
);

export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({ email, password, name, phone }: { email: string; password: string; name: string; phone: string }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const user = await api.signUp({ email, password, name, phone });
            await AsyncStorage.setItem('user', JSON.stringify(user));
            dispatch(loginSuccess(user));
            return user;
        } catch (error: any) {
            dispatch(loginFailure(error.message || 'Registration failed'));
            throw error;
        }
    }
);

export const signOut = createAsyncThunk(
    'auth/signOut',
    async (_, { dispatch }) => {
        try {
            await AsyncStorage.removeItem('user');
            dispatch({ type: 'auth/logout' });
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/check',
    async (_, { dispatch }) => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                dispatch(loginSuccess(user));
                return user;
            }
            return null;
        } catch (error) {
            console.error('Error checking auth:', error);
            return null;
        }
    }
);

export const updateUser = createAsyncThunk<User, User>(
    'auth/updateUser',
    async (user) => {
        const response = await api.updateUser(user);
        return response;
    }
);
