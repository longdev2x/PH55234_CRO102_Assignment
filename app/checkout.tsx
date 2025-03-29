import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const { width } = Dimensions.get('window');

export default function CheckoutScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { items, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const { productId, quantity, totalPrice } = useLocalSearchParams();
    const [selectedDelivery, setSelectedDelivery] = useState('fast');
    const [selectedPayment, setSelectedPayment] = useState('visa');
    const [showCardInput, setShowCardInput] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Customer information state
    const [name, setName] = useState('Trần Minh Trí');
    const [email, setEmail] = useState('tranminhtri@gmail.com');
    const [address, setAddress] = useState('60 Láng Hạ, Ba Đình, Hà Nội');
    const [phone, setPhone] = useState('0123456789');

    // Card information state
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    // Format prices
    const subtotal = 500000;
    const formattedSubtotal = subtotal.toLocaleString('vi-VN') + 'đ';
    const deliveryFee = selectedDelivery === 'fast' ? 15000 : 20000;
    const formattedDeliveryFee = deliveryFee.toLocaleString('vi-VN') + 'đ';
    const totalAmount = subtotal + deliveryFee;
    const formattedTotalAmount = totalAmount.toLocaleString('vi-VN') + 'đ';

    // Check if all fields are filled
    const isFormValid = useMemo(() => {
        if (showCardInput) {
            return cardNumber.trim() !== '' &&
                cardHolder.trim() !== '' &&
                expiryDate.trim() !== '' &&
                cvv.trim() !== '';
        }
        return name.trim() !== '' &&
            email.trim() !== '' &&
            address.trim() !== '' &&
            phone.trim() !== '';
    }, [name, email, address, phone, cardNumber, cardHolder, expiryDate, cvv, showCardInput]);

    const handleContinue = () => {
        if (!showCardInput) {
            setShowCardInput(true);
        } else {
            setShowConfirmDialog(true);
        }
    };

    const handleConfirm = async () => {
        try {
            setLoading(true);
            setShowConfirmDialog(false);

            // Tạo transaction mới
            if (user?.id) {
                const orderId = `order_${Date.now()}`;
                const transaction = {
                    date: new Date().toISOString().split('T')[0],
                    type: 'success' as const,
                    title: 'Đặt hàng thành công',
                    productName: items[0]?.name || 'Unknown Product',
                    productCategory: items[0]?.label || 'Unknown Category',
                    quantity: `${items.length} sản phẩm`,
                    image: items[0]?.image || '',
                    userId: user.id,
                    orderId: orderId,
                    totalAmount: totalAmount
                };

                await api.createTransaction(transaction);
                clearCart(); // Xóa giỏ hàng sau khi thanh toán thành công
                router.push('/success');
            }
        } catch (error) {
            console.error('Error creating transaction:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
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
                    onPress={() => {
                        if (showCardInput) {
                            setShowCardInput(false);
                        } else {
                            router.back();
                        }
                    }}
                >
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>THANH TOÁN</ThemedText>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content}>
                {showCardInput && (
                    // Card Input Section
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Nhập thông tin thẻ</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={cardNumber}
                            onChangeText={setCardNumber}
                            placeholder="Nhập số thẻ"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={cardHolder}
                            onChangeText={setCardHolder}
                            placeholder="Tên chủ thẻ"
                        />
                        <TextInput
                            style={styles.input}
                            value={expiryDate}
                            onChangeText={setExpiryDate}
                            placeholder="Ngày hết hạn (MM/YY)"
                        />
                        <TextInput
                            style={styles.input}
                            value={cvv}
                            onChangeText={setCvv}
                            placeholder="CVV"
                            keyboardType="numeric"
                            maxLength={3}
                        />
                    </View>
                )}

                {/* Customer Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Thông tin khách hàng</ThemedText>
                        <TouchableOpacity>
                            <ThemedText style={styles.editButton}>chỉnh sửa</ThemedText>
                        </TouchableOpacity>
                    </View>
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
                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Phương thức vận chuyển</ThemedText>
                        <TouchableOpacity>
                            <ThemedText style={styles.editButton}>chỉnh sửa</ThemedText>
                        </TouchableOpacity>
                    </View>
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
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Hình thức thanh toán</ThemedText>
                        <TouchableOpacity>
                            <ThemedText style={styles.editButton}>chỉnh sửa</ThemedText>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.optionContainer}
                        onPress={() => setSelectedPayment('visa')}
                    >
                        <ThemedText style={styles.optionTitle}>Thẻ VISA/MASTERCARD</ThemedText>
                        {selectedPayment === 'visa' && (
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
                onPress={handleContinue}
            >
                <ThemedText style={styles.submitButtonText}>TIẾP TỤC</ThemedText>
            </TouchableOpacity>

            {/* Confirm Dialog */}
            <Modal
                visible={showConfirmDialog}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>Xác nhận thanh toán?</ThemedText>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleConfirm}
                        >
                            <ThemedText style={styles.modalButtonText}>Đồng ý</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalCancelButton]}
                            onPress={() => setShowConfirmDialog(false)}
                        >
                            <ThemedText style={styles.modalCancelText}>Huỷ bỏ</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    editButton: {
        fontSize: 14,
        color: '#007537',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        width: width - 32,
        padding: 16,
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 16,
    },
    modalButton: {
        height: 50,
        backgroundColor: '#007537',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 8,
    },
    modalButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    modalCancelButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#007537',
    },
    modalCancelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007537',
    },
}); 