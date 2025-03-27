import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { COLORS, SIZES } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { api, Notification } from '@/services/api';

export default function NotificationsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await api.getNotifications();
            setNotifications(data);
            setError(null);
        } catch (err) {
            setError('Failed to load notifications');
            console.error('Error loading notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderNotificationItem = (notification: Notification) => (
        <View key={notification.id}>
            <ThemedText style={styles.dateHeader}>{notification.date}</ThemedText>
            <TouchableOpacity style={styles.notificationItem}>
                <Image
                    source={{ uri: notification.image }}
                    style={styles.productImage}
                    defaultSource={require('@/assets/images/react-logo.png')}
                />
                <View style={styles.notificationContent}>
                    <ThemedText style={styles.successTitle}>{notification.title}</ThemedText>
                    <ThemedText style={styles.productName}>
                        {notification.productName} | <ThemedText style={styles.productCategory}>{notification.productCategory}</ThemedText>
                    </ThemedText>
                    <ThemedText style={styles.quantity}>{notification.quantity}</ThemedText>
                </View>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ThemedText>Loading...</ThemedText>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ThemedText>{error}</ThemedText>
                <TouchableOpacity style={styles.retryButton} onPress={loadNotifications}>
                    <ThemedText style={styles.retryText}>Thử lại</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Feather name="chevron-left" size={24} color="black" />
                </View>
                <ThemedText style={styles.headerTitle}>THÔNG BÁO</ThemedText>
                <View style={styles.headerRight} />
            </View>

            {notifications.length > 0 ? (
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {notifications.map(renderNotificationItem)}
                </ScrollView>
            ) : (
                <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText}>Không có thông báo nào</ThemedText>
                </View>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEEEEE',
        backgroundColor: '#FFFFFF',
    },
    headerLeft: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRight: {
        width: 50,
        height: 50,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SIZES.padding,
    },
    dateHeader: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 12,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
        gap: 12,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
        backgroundColor: '#F6F6F6',
    },
    notificationContent: {
        flex: 1,
        justifyContent: 'center',
    },
    successTitle: {
        fontSize: 14,
        color: '#007537',
        marginBottom: 4,
    },
    productName: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 4,
    },
    productCategory: {
        color: '#ABABAB',
    },
    quantity: {
        fontSize: 12,
        color: '#000000',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#000000',
        textAlign: 'center',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#007537',
        borderRadius: 4,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
}); 