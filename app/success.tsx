import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';

export default function SuccessScreen() {
    const router = useRouter();

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerLeft}
                    onPress={() => router.back()}
                >
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>THÔNG BÁO</ThemedText>
                <View style={styles.headerRight} />
            </View>

            {/* Success Message */}
            <View style={styles.content}>
                <ThemedText style={styles.successMessage}>
                    Bạn đã đặt hàng thành công
                </ThemedText>

                {/* Customer Information */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Thông tin khách hàng</ThemedText>
                    <ThemedText style={styles.infoText}>Trần Minh Trí</ThemedText>
                    <ThemedText style={styles.infoText}>tranminhtri@gmail.com</ThemedText>
                    <ThemedText style={styles.infoText}>60 Láng Hạ, Ba Đình, Hà Nội</ThemedText>
                    <ThemedText style={styles.infoText}>0123456789</ThemedText>
                </View>

                {/* Delivery Method */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Phương thức vận chuyển</ThemedText>
                    <ThemedText style={styles.infoText}>
                        Giao hàng Nhanh - 15.000đ
                    </ThemedText>
                    <ThemedText style={styles.subText}>
                        (Dự kiến giao hàng 5-7/9)
                    </ThemedText>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Hình thức thanh toán</ThemedText>
                    <ThemedText style={styles.infoText}>Thẻ VISA/MASTERCARD</ThemedText>
                </View>

                {/* Selected Items */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Đơn hàng đã chọn</ThemedText>
                    <ThemedText style={styles.infoText}>Cây Đế Vương</ThemedText>
                </View>

                {/* Total */}
                <ThemedText style={styles.totalText}>Đã thanh toán: 515.000đ</ThemedText>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/plant-care')}
                >
                    <ThemedText style={styles.buttonText}>Xem Cẩm nang trồng cây</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.outlineButton]}
                    onPress={() => router.push('/(tabs)')}
                >
                    <ThemedText style={styles.outlineButtonText}>Quay về Trang chủ</ThemedText>
                </TouchableOpacity>
            </View>
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
    content: {
        flex: 1,
        padding: 16,
    },
    successMessage: {
        fontSize: 16,
        color: '#007537',
        textAlign: 'center',
        marginVertical: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 4,
    },
    subText: {
        fontSize: 12,
        color: '#898989',
        marginTop: 4,
    },
    totalText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007537',
        marginTop: 16,
    },
    bottomButtons: {
        padding: 16,
    },
    button: {
        height: 50,
        backgroundColor: '#007537',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 8,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    outlineButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#007537',
    },
    outlineButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007537',
    },
}); 