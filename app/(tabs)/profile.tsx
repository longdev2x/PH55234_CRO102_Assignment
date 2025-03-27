import React from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { COLORS, SIZES } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Feather } from '@expo/vector-icons';

interface MenuItemProps {
    title: string;
    onPress: () => void;
    textColor?: string;
}

interface MenuSectionProps {
    title: string;
    children: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, onPress, textColor = '#000000' }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <ThemedText style={[styles.menuText, { color: textColor }]}>{title}</ThemedText>
    </TouchableOpacity>
);

const MenuSection: React.FC<MenuSectionProps> = ({ title, children }) => (
    <View style={styles.menuSection}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        {children}
    </View>
);

export default function ProfileScreen() {
    const { signOut } = useAuth();
    const router = useRouter();

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Feather name="chevron-left" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                    headerTitle: "PROFILE",
                    headerTitleStyle: styles.headerTitle,
                    headerTitleAlign: 'center',
                }}
            />

            <ScrollView style={styles.scrollView}>
                <View style={styles.userSection}>
                    <Image
                        source={require('@/assets/images/react-logo.png')}
                        style={styles.avatar}
                    />
                    <ThemedText style={styles.userEmail}>tranminhtri@gmail.com</ThemedText>
                </View>

                <MenuSection title="Chung">
                    <MenuItem
                        title="Chỉnh sửa thông tin"
                        onPress={() => router.push('/profile/edit')}
                    />
                    <MenuItem title="Cẩm nang trồng cây" onPress={() => { }} />
                    <MenuItem title="Lịch sử giao dịch" onPress={() => { }} />
                    <MenuItem title="Q & A" onPress={() => { }} />
                </MenuSection>

                <MenuSection title="Bảo mật và Điều khoản">
                    <MenuItem title="Điều khoản và điều kiện" onPress={() => { }} />
                    <MenuItem title="Chính sách quyền riêng tư" onPress={() => { }} />
                </MenuSection>

                <MenuItem title="Đăng xuất" onPress={signOut} textColor="#D70000" />
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    backButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    userSection: {
        alignItems: 'center',
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F6F6F6',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginBottom: 8,
    },
    userEmail: {
        fontSize: 14,
        color: '#7F7F7F',
    },
    menuSection: {
        paddingTop: 16,
    },
    sectionTitle: {
        fontSize: 12,
        color: '#7F7F7F',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuText: {
        fontSize: 14,
    },
}); 