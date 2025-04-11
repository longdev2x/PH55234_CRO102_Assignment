import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { COLORS, SIZES } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/selectors/authSelectors';
import { signOut } from '@/store/thunks/authThunks';
import { storage } from '@/services/storage';

interface MenuItemProps {
    title: string;
    onPress: () => void;
    textColor?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, onPress, textColor = '#000000' }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <ThemedText style={[styles.menuText, { color: textColor }]}>{title}</ThemedText>
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const router = useRouter();
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadAvatar();
        }
    }, [user]);

    const loadAvatar = async () => {
        if (user) {
            const savedAvatar = await storage.getAvatar(user.id);
            setAvatar(savedAvatar);
        }
    };

    const handleSignOut = async () => {
        try {
            await dispatch(signOut()).unwrap();
            router.replace('/auth/sign-in');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ 
                title: 'PROFILE',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
            }} />
            
            <ScrollView style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.avatarContainer}
                        onPress={() => router.push('/profile/edit')}
                    >
                        {avatar ? (
                            <Image 
                                source={{ uri: avatar }} 
                                style={styles.avatar} 
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Feather name="user" size={40} color={COLORS.gray} />
                            </View>
                        )}
                    </TouchableOpacity>
                    <ThemedText style={styles.name}>{user?.name}</ThemedText>
                    <ThemedText style={styles.email}>{user?.email}</ThemedText>
                </View>

                <View style={styles.menuSection}>
                    <ThemedText style={styles.sectionTitle}>Chung</ThemedText>
                    {user?.email === 'admin@gmail.com' && (
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/admin/products')}
                        >
                            <View style={styles.menuItemLeft}>
                                <Ionicons name="cube-outline" size={24} color="#007AFF" />
                                <ThemedText style={styles.menuItemText}>Sửa xoá sản phẩm cho Admin</ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#999" />
                        </TouchableOpacity>
                    )}
                    <MenuItem title="Chỉnh sửa thông tin" onPress={() => router.push('/profile/edit')} />
                    <MenuItem title="Cẩm nang trồng cây" onPress={() => router.push('/guides')} />
                    <MenuItem title="Lịch sử giao dịch" onPress={() => router.push('/transactions')} />
                    <MenuItem title="Q & A" onPress={() => router.push('/faq')} />
                </View>

                <View style={styles.menuSection}>
                    <ThemedText style={styles.sectionTitle}>Bảo mật và Điều khoản</ThemedText>
                    <MenuItem title="Điều khoản và điều kiện" onPress={() => {}} />
                    <MenuItem title="Chính sách quyền riêng tư" onPress={() => {}} />
                    <MenuItem title="Đăng xuất" onPress={handleSignOut} textColor={COLORS.red} />
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    content: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: SIZES.padding,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: SIZES.base,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontSize: SIZES.h3,
        fontWeight: '600',
        marginBottom: SIZES.base / 2,
    },
    email: {
        fontSize: SIZES.body1,
        color: COLORS.gray,
    },
    menuSection: {
        paddingHorizontal: SIZES.padding,
        paddingTop: SIZES.padding,
    },
    sectionTitle: {
        fontSize: SIZES.body2,
        color: COLORS.gray,
        marginBottom: SIZES.base,
    },
    menuItem: {
        paddingVertical: SIZES.base,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.lightGray,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: SIZES.body1,
        marginLeft: SIZES.base,
    },
    menuText: {
        fontSize: SIZES.body1,
    },
});