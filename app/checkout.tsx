import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CheckoutScreen() {
    const router = useRouter();
    const { productId, quantity, totalPrice } = useLocalSearchParams();
    const [selectedDelivery, setSelectedDelivery] = useState('fast');
    const [selectedPayment, setSelectedPayment] = useState('visa');

    // Customer information state
    const [name, setName] = useState('Trần Minh Trí');
    const [email, setEmail] = useState('tranminhtri@gmail.com');
    const [address, setAddress] = useState('60 Láng Hạ, Ba Đình, Hà Nội');
    const [phone, setPhone] = useState('0123456789');

    // Format prices
    const subtotal = 500000;
    const formattedSubtotal = subtotal.toLocaleString('vi-VN') + 'đ';
    const deliveryFee = selectedDelivery === 'fast' ? 15000 : 20000;
    const formattedDeliveryFee = deliveryFee.toLocaleString('vi-VN') + 'đ';
    const totalAmount = subtotal + deliveryFee;
    const formattedTotalAmount = totalAmount.toLocaleString('vi-VN') + 'đ';

    // Check if all fields are filled
    const isFormValid = useMemo(() => {
        return (
            name.trim() !== '' &&
            email.trim() !== '' &&
            address.trim() !== '' &&
            phone.trim() !== ''
        );
    }, [name, email, address, phone]);

    const handleBack = () => {
        router.back();
    };

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
                    onPress={handleBack}
                >
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>THANH TOÁN</ThemedText>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content}>
                {/* Customer Information */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Thông tin khách hàng</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Họ và tên"
                    />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Địa chỉ"
                    />
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Số điện thoại"
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Delivery Method */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Phương thức vận chuyển</ThemedText>
                    <TouchableOpacity
                        style={styles.optionContainer}
                        onPress={() => setSelectedDelivery('fast')}
                    >
                        <View style={styles.optionLeft}>
                            <ThemedText style={styles.optionTitle}>Giao hàng Nhanh - 15.000đ</ThemedText>
                            <ThemedText style={styles.optionSubtitle}>Dự kiến giao hàng 5-7/9</ThemedText>
                        </View>
                        {selectedDelivery === 'fast' && (
                            <Feather name="check" size={20} color="#007537" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionContainer}
                        onPress={() => setSelectedDelivery('cod')}
                    >
                        <View style={styles.optionLeft}>
                            <ThemedText style={styles.optionTitle}>Giao hàng COD - 20.000đ</ThemedText>
                            <ThemedText style={styles.optionSubtitle}>Dự kiến giao hàng 4-8/9</ThemedText>
                        </View>
                        {selectedDelivery === 'cod' && (
                            <Feather name="check" size={20} color="#007537" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Hình thức thanh toán</ThemedText>
                    <TouchableOpacity
                        style={styles.optionContainer}
                        onPress={() => setSelectedPayment('visa')}
                    >
                        <ThemedText style={styles.optionTitle}>Thẻ VISA/MASTERCARD</ThemedText>
                        {selectedPayment === 'visa' && (
                            <Feather name="check" size={20} color="#007537" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionContainer}
                        onPress={() => setSelectedPayment('atm')}
                    >
                        <ThemedText style={styles.optionTitle}>Thẻ ATM</ThemedText>
                        {selectedPayment === 'atm' && (
                            <Feather name="check" size={20} color="#007537" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Summary */}
                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <ThemedText style={styles.summaryLabel}>Tạm tính</ThemedText>
                        <ThemedText style={styles.summaryValue}>{formattedSubtotal}</ThemedText>
                    </View>
                    <View style={styles.summaryRow}>
                        <ThemedText style={styles.summaryLabel}>Phí vận chuyển</ThemedText>
                        <ThemedText style={styles.summaryValue}>{formattedDeliveryFee}</ThemedText>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <ThemedText style={styles.totalLabel}>Tổng cộng</ThemedText>
                        <ThemedText style={styles.totalValue}>{formattedTotalAmount}</ThemedText>
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    isFormValid ? styles.submitButtonActive : {}
                ]}
                disabled={!isFormValid}
            >
                <ThemedText style={styles.submitButtonText}>TIẾP TỤC</ThemedText>
            </TouchableOpacity>
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
    },
    section: {
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEEEEE',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 16,
    },
    infoText: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 12,
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    optionLeft: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 4,
    },
    optionSubtitle: {
        fontSize: 12,
        color: '#898989',
    },
    summary: {
        padding: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#000000',
    },
    summaryValue: {
        fontSize: 14,
        color: '#000000',
    },
    totalRow: {
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 14,
        color: '#000000',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007537',
    },
    submitButton: {
        height: 50,
        backgroundColor: '#898989',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 16,
        borderRadius: 4,
    },
    submitButtonActive: {
        backgroundColor: '#007537',
    },
    submitButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    input: {
        width: '100%',
        height: 40,
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEEEEE',
        fontSize: 14,
        color: '#000000',
        marginBottom: 16,
        paddingVertical: 8,
    },
}); 