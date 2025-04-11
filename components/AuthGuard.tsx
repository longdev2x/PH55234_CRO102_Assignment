import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/thunks/authThunks';
import { selectIsAuthenticated } from '@/store/selectors/authSelectors';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const segments = useSegments();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    useEffect(() => {
        const inAuthGroup = segments[0] === 'auth';

        if (!isAuthenticated && !inAuthGroup) {
            router.replace('/auth/sign-in');
        } else if (isAuthenticated && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, segments]);

    return <>{children}</>;
}
