import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';
import { api, Transaction } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/selectors/authSelectors';

const { width } = Dimensions.get('window');

export default function CheckoutScreen() {
    const router = useRouter();
    const user = useAppSelector(selectUser);
    const { items, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const { productId, quantity, totalPrice } = useLocalSearchParams();
    const [selectedDelivery, setSelectedDelivery] = useState('fast');
    const [selectedPayment, setSelectedPayment] = useState('visa');
    const [showCardInput, setShowCardInput] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Customer information state
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState(user?.phone || '');

    // Card information state
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    // Calculate total from cart items
    const subtotal = items.reduce((total, item) => {
        return total + (parseFloat(item.price.replace(/[^\d.-]/g, '')) * item.quantity);
    }, 0);
    const formattedSubtotal = subtotal.toLocaleString('vi-VN') + 'đ';
    const deliveryFee = selectedDelivery === 'fast' ? 15000 : 20000;
    const formattedDeliveryFee = deliveryFee.toLocaleString('vi-VN') + 'đ';
    const totalAmount = subtotal + deliveryFee;
    const formattedTotalAmount = totalAmount.toLocaleString('vi-VN') + 'đ';

    // Check if all fields are filled
    const isFormValid = useMemo(() => {
        const basicFieldsValid = name.trim() !== '' && 
            email.trim() !== '' && 
            address.trim() !== '' && 
            phone.trim() !== '';

        if (showCardInput) {
            return basicFieldsValid &&
                cardNumber.trim() !== '' &&
                cardHolder.trim() !== '' &&
                expiryDate.trim() !== '' &&
                cvv.trim() !== '';
        }
        return basicFieldsValid;
    }, [name, email, address, phone, showCardInput, cardNumber, cardHolder, expiryDate, cvv]);

    // Handle place order
    const handlePlaceOrder = async () => {
        if (!isFormValid) {
            Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!user?.id) {
            Alert.alert('Lỗi', 'Vui lòng đăng nhập để tiếp tục');
            return;
        }

        try {
            setLoading(true);
            // Create order
            const order: Omit<Transaction, 'id'> = {
                userId: user.id,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: totalAmount,
                shippingAddress: address,
                paymentMethod: selectedPayment,
                status: 'pending',
                date: new Date().toISOString()
            };

            await api.createTransaction(order);
            await clearCart();
            router.push('/checkout/success');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể tạo đơn hàng. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

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
                    headerTitle: "THANH TOÁN",
                    headerTitleStyle: styles.headerTitle,
                    headerTitleAlign: 'center',
                }}
            />

            <ScrollView style={styles.scrollView}>
                {/* Customer Information */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Thông tin khách hàng</ThemedText>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Họ và tên"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Địa chỉ"
                            value={address}
                            onChangeText={setAddress}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Số điện thoại"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                {/* Delivery Method */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Phương thức vận chuyển</ThemedText>
                    <TouchableOpacity
                        style={[styles.optionButton, selectedDelivery === 'fast' && styles.selectedOption]}
                        onPress={() => setSelectedDelivery('fast')}
                    >
                        <View style={styles.optionContent}>
                            <ThemedText style={styles.optionText}>Giao hàng nhanh</ThemedText>
                            <ThemedText style={styles.optionPrice}>15.000đ</ThemedText>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.optionButton, selectedDelivery === 'standard' && styles.selectedOption]}
                        onPress={() => setSelectedDelivery('standard')}
                    >
                        <View style={styles.optionContent}>
                            <ThemedText style={styles.optionText}>Giao hàng tiêu chuẩn</ThemedText>
                            <ThemedText style={styles.optionPrice}>20.000đ</ThemedText>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Phương thức thanh toán</ThemedText>
                    <TouchableOpacity
                        style={[styles.optionButton, selectedPayment === 'cod' && styles.selectedOption]}
                        onPress={() => {
                            setSelectedPayment('cod');
                            setShowCardInput(false);
                        }}
                    >
                        <View style={styles.optionContent}>
                            <ThemedText style={styles.optionText}>Thanh toán khi nhận hàng</ThemedText>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.optionButton, selectedPayment === 'visa' && styles.selectedOption]}
                        onPress={() => {
                            setSelectedPayment('visa');
                            setShowCardInput(true);
                        }}
                    >
                        <View style={styles.optionContent}>
                            <ThemedText style={styles.optionText}>Thẻ tín dụng/ghi nợ</ThemedText>
                        </View>
                    </TouchableOpacity>

                    {showCardInput && (
                        <View style={styles.cardInputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Số thẻ"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Tên chủ thẻ"
                                value={cardHolder}
                                onChangeText={setCardHolder}
                            />
                            <View style={styles.cardRow}>
                                <TextInput
                                    style={[styles.input, styles.halfInput]}
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChangeText={setExpiryDate}
                                />
                                <TextInput
                                    style={[styles.input, styles.halfInput]}
                                    placeholder="CVV"
                                    value={cvv}
                                    onChangeText={setCvv}
                                    keyboardType="numeric"
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    )}
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Tổng đơn hàng</ThemedText>
                    <View style={styles.summaryRow}>
                        <ThemedText>Tạm tính</ThemedText>
                        <ThemedText>{formattedSubtotal}</ThemedText>
                    </View>
                    <View style={styles.summaryRow}>
                        <ThemedText>Phí vận chuyển</ThemedText>
                        <ThemedText>{formattedDeliveryFee}</ThemedText>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <ThemedText style={styles.totalText}>Tổng cộng</ThemedText>
                        <ThemedText style={styles.totalAmount}>{formattedTotalAmount}</ThemedText>
                    </View>
                </View>
            </ScrollView>

            {/* Place Order Button */}
            <TouchableOpacity
                style={[styles.placeOrderButton, !isFormValid && styles.disabledButton]}
                onPress={() => setShowConfirmDialog(true)}
                disabled={!isFormValid || loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <ThemedText style={styles.placeOrderButtonText}>
                        Đặt hàng ({formattedTotalAmount})
                    </ThemedText>
                )}
            </TouchableOpacity>

            {/* Confirm Dialog */}
            <Modal
                visible={showConfirmDialog}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>Xác nhận đặt hàng</ThemedText>
                        <ThemedText style={styles.modalText}>
                            Bạn có chắc chắn muốn đặt hàng với tổng giá trị {formattedTotalAmount}?
                        </ThemedText>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowConfirmDialog(false)}
                            >
                                <ThemedText style={styles.modalButtonText}>Hủy</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={() => {
                                    setShowConfirmDialog(false);
                                    handlePlaceOrder();
                                }}
                            >
                                <ThemedText style={[styles.modalButtonText, styles.confirmButtonText]}>
                                    Xác nhận
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
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
    scrollView: {
        flex: 1,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
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
    inputContainer: {
        marginBottom: 16,
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
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEEEEE',
    },
    selectedOption: {
        backgroundColor: '#F7F7F7',
    },
    optionContent: {
        flex: 1,
    },
    optionText: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 4,
    },
    optionPrice: {
        fontSize: 12,
        color: '#898989',
    },
    cardInputContainer: {
        padding: 16,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    totalRow: {
        marginTop: 4,
    },
    totalText: {
        fontSize: 14,
        color: '#000000',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007537',
    },
    placeOrderButton: {
        height: 50,
        backgroundColor: '#007537',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 16,
        borderRadius: 4,
    },
    disabledButton: {
        backgroundColor: '#898989',
    },
    placeOrderButtonText: {
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
    modalText: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        height: 50,
        backgroundColor: '#007537',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        flex: 1,
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#007537',
    },
    confirmButton: {
        backgroundColor: '#007537',
    },
    modalButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    confirmButtonText: {
        color: '#FFFFFF',
    },
});