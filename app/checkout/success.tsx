import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OrderSuccessScreen() {
    const router = useRouter();
    const { totalAmount } = useLocalSearchParams();

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            {/* Success Icon */}
            <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                    <Feather name="check" size={60} color="#FFFFFF" />
                </View>
            </View>

            {/* Success Message */}
            <View style={styles.messageContainer}>
                <ThemedText style={styles.title}>Đặt hàng thành công!</ThemedText>
                <ThemedText style={styles.subtitle}>
                    Cảm ơn bạn đã mua hàng tại GreenLife
                </ThemedText>

                <View style={styles.orderInfo}>
                    <ThemedText style={styles.orderIdLabel}>Mã đơn hàng:</ThemedText>
                    <ThemedText style={styles.orderId}>#OD{Math.floor(100000 + Math.random() * 900000)}</ThemedText>
                </View>

                <View style={styles.orderInfo}>
                    <ThemedText style={styles.totalLabel}>Tổng thanh toán:</ThemedText>
                    <ThemedText style={styles.totalAmount}>{totalAmount}</ThemedText>
                </View>

                <ThemedText style={styles.deliveryInfo}>
                    Đơn hàng của bạn sẽ được giao trong vòng 2-3 ngày tới.
                    Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi".
                </ThemedText>
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => router.push('/orders')}
                >
                    <ThemedText style={styles.secondaryButtonText}>XEM ĐƠN HÀNG</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => router.push('/')}
                >
                    <ThemedText style={styles.primaryButtonText}>TIẾP TỤC MUA SẮM</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        padding: 20,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        color: '#4CAF50',
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 24,
        textAlign: 'center',
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        width: '100%',
        justifyContent: 'center',
    },
    orderIdLabel: {
        fontSize: 14,
        color: '#666666',
        marginRight: 8,
    },
    orderId: {
        fontSize: 14,
        fontWeight: '600',
    },
    totalLabel: {
        fontSize: 16,
        color: '#333333',
        marginRight: 8,
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#007537',
    },
    deliveryInfo: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 20,
    },
    buttonsContainer: {
        width: '100%',
    },
    button: {
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    primaryButton: {
        backgroundColor: '#007537',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        backgroundColor: '#F5F5F5',
    },
    secondaryButtonText: {
        color: '#333333',
        fontSize: 16,
        fontWeight: '700',
    },
}); 