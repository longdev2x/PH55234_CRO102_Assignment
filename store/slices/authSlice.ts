import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/services/api';
import { signIn, signUp, signOut, updateUser } from '../thunks/authThunks';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Sign in
            .addCase(signIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to sign in';
            })
            // Sign up
            .addCase(signUp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to sign up';
            })
            // Sign out
            .addCase(signOut.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signOut.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(signOut.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to sign out';
            })
            // Update user
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update profile';
            });
    },
});

export const { setLoading, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
