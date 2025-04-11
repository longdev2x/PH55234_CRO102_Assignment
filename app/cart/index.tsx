import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { COLORS, SIZES } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import Checkbox from 'expo-checkbox';

export default function CartScreen() {
    const router = useRouter();
    const { items, loading, error, removeFromCart, updateQuantity, getTotal, refreshCart } = useCart();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

    useEffect(() => {
        refreshCart();
    }, []);

    const handleSelectItem = (itemId: string) => {
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedItems.length === items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map(item => item.id));
        }
    };

    const handleQuantityChange = async (itemId: string, currentQuantity: number, increment: boolean) => {
        const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
        if (newQuantity === 0) {
            setItemToDelete(itemId);
            setShowDeleteModal(true);
        } else {
            await updateQuantity(itemId, newQuantity);
        }
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            await removeFromCart(itemToDelete);
            setItemToDelete(null);
            setShowDeleteModal(false);
        }
    };

    const handleDeleteSelected = () => {
        if (selectedItems.length > 0) {
            setShowDeleteAllModal(true);
        }
    };

    const handleDeleteAllConfirm = async () => {
        selectedItems.forEach(id => removeFromCart(id));
        setSelectedItems([]);
        setShowDeleteAllModal(false);
    };

    const selectedTotal = items
        .filter(item => selectedItems.includes(item.id))
        .reduce((sum, item) => {
            const price = parseInt(item.price.replace(/\D/g, ''));
            return sum + (price * item.quantity);
        }, 0);

    const formattedTotal = selectedTotal.toLocaleString('vi-VN') + 'đ';

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>GIỎ HÀNG</ThemedText>
                {items.length > 0 && (
                    <TouchableOpacity
                        onPress={handleDeleteSelected}
                        style={styles.deleteButton}
                        disabled={selectedItems.length === 0}
                    >
                        <Feather
                            name="trash-2"
                            size={24}
                            color={selectedItems.length === 0 ? COLORS.gray : '#000000'}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : error ? (
                <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText}>Lỗi tải giỏ hàng</ThemedText>
                    <TouchableOpacity
                        style={styles.continueShoppingButton}
                        onPress={() => refreshCart()}
                    >
                        <ThemedText style={styles.continueShoppingText}>
                            Tải lại
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            ) : items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText}>Giỏ hàng của bạn đang trống</ThemedText>
                    <TouchableOpacity
                        style={styles.continueShoppingButton}
                        onPress={() => router.push('/')}
                    >
                        <ThemedText style={styles.continueShoppingText}>
                            Tiếp tục mua sắm
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <ScrollView style={styles.scrollView}>
                        {items.map((item) => (
                            <View key={item.id} style={styles.cartItem}>
                                <Checkbox
                                    value={selectedItems.includes(item.id)}
                                    onValueChange={() => handleSelectItem(item.id)}
                                    style={styles.checkbox}
                                    color={selectedItems.includes(item.id) ? '#000000' : undefined}
                                />
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.itemImage}
                                    resizeMode="contain"
                                />
                                <View style={styles.itemDetails}>
                                    <View style={styles.itemTitleContainer}>
                                        <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                                        <ThemedText style={styles.itemCategory}>|</ThemedText>
                                        <ThemedText style={[styles.itemCategory, { marginLeft: 0 }]}>{item.label || 'Ưa bóng'}</ThemedText>
                                    </View>
                                    <ThemedText style={styles.itemPrice}>{item.price}</ThemedText>
                                    <View style={styles.bottomRow}>
                                        <View style={styles.quantityControls}>
                                            <TouchableOpacity
                                                onPress={() => handleQuantityChange(item.id, item.quantity, false)}
                                                style={styles.quantityButton}
                                            >
                                                <ThemedText style={styles.quantityButtonText}>-</ThemedText>
                                            </TouchableOpacity>
                                            <View style={styles.quantityInputContainer}>
                                                <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => handleQuantityChange(item.id, item.quantity, true)}
                                                style={styles.quantityButton}
                                            >
                                                <ThemedText style={styles.quantityButtonText}>+</ThemedText>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setItemToDelete(item.id);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            <ThemedText style={styles.deleteText}>Xoá</ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <ThemedText style={styles.totalLabel}>Tạm tính</ThemedText>
                            <ThemedText style={styles.totalAmount}>{formattedTotal}</ThemedText>
                        </View>
                        <TouchableOpacity
                            style={[styles.checkoutButton, selectedItems.length === 0 && styles.checkoutButtonDisabled]}
                            onPress={() => router.push('/checkout')}
                            disabled={selectedItems.length === 0}
                        >
                            <View style={styles.checkoutButtonContent}>
                                <ThemedText style={styles.checkoutButtonText}>Tiến hành thanh toán</ThemedText>
                                <Feather name="arrow-right" size={24} color="#FFFFFF" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Delete Confirmation Modal */}
                    <Modal
                        visible={showDeleteModal}
                        transparent={true}
                        animationType="fade"
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <ThemedText style={styles.modalTitle}>Xác nhận xoá đơn hàng?</ThemedText>
                                <ThemedText style={styles.modalText}>
                                    Thao tác này sẽ không thể khôi phục.
                                </ThemedText>
                                <TouchableOpacity
                                    style={styles.modalButtonConfirm}
                                    onPress={handleDeleteConfirm}
                                >
                                    <ThemedText style={styles.modalButtonTextConfirm}>Đồng ý</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowDeleteModal(false);
                                        setItemToDelete(null);
                                    }}
                                >
                                    <ThemedText style={styles.modalButtonTextCancel}>Huỷ bỏ</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Delete All Confirmation Modal */}
                    <Modal
                        visible={showDeleteAllModal}
                        transparent={true}
                        animationType="fade"
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <ThemedText style={styles.modalTitle}>Xác nhận xoá tất cả đơn hàng?</ThemedText>
                                <ThemedText style={styles.modalText}>
                                    Thao tác này sẽ không thể khôi phục.
                                </ThemedText>
                                <TouchableOpacity
                                    style={styles.modalButtonConfirm}
                                    onPress={handleDeleteAllConfirm}
                                >
                                    <ThemedText style={styles.modalButtonTextConfirm}>Đồng ý</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setShowDeleteAllModal(false)}
                                >
                                    <ThemedText style={styles.modalButtonTextCancel}>Huỷ bỏ</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SIZES.padding,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    headerTitle: {
        fontSize: SIZES.h4,
        fontWeight: '600',
        color: '#000000',
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        padding: 8,
    },
    deleteButton: {
        padding: 8,
    },
    emptyText: {
        marginTop: SIZES.padding * 2,
        textAlign: 'center',
        color: COLORS.gray,
        fontSize: SIZES.h4,
    },
    scrollView: {
        flex: 1,
    },
    cartItem: {
        flexDirection: 'row',
        padding: SIZES.padding,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        alignItems: 'center',
    },
    checkbox: {
        marginRight: SIZES.base,
        width: 24,
        height: 24,
        borderRadius: 4,
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: SIZES.padding,
        backgroundColor: '#F6F6F6',
    },
    itemDetails: {
        flex: 1,
    },
    itemTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
    },
    itemCategory: {
        fontSize: 16,
        color: '#ABABAB',
        marginLeft: 4,
        marginRight: 4,
    },
    itemPrice: {
        fontSize: 16,
        color: '#007537',
        fontWeight: '700',
        marginBottom: 12,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quantityButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
    },
    quantityButtonText: {
        fontSize: 20,
        color: '#000000',
        fontWeight: '600',
        marginTop: -2,
    },
    quantityInputContainer: {
        minWidth: 24,
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
    },
    deleteText: {
        fontSize: 14,
        color: '#000000',
        textDecorationLine: 'underline',
        marginLeft: SIZES.base,
    },
    footer: {
        padding: SIZES.padding,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        backgroundColor: COLORS.white,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    totalLabel: {
        fontSize: SIZES.h4,
        color: '#000000',
    },
    totalAmount: {
        fontSize: SIZES.h3,
        fontWeight: '700',
        color: '#009245',
    },
    checkoutButton: {
        backgroundColor: '#009245',
        padding: SIZES.padding,
        borderRadius: 8,
    },
    checkoutButtonDisabled: {
        backgroundColor: '#ABABAB',
    },
    checkoutButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    checkoutButtonText: {
        color: COLORS.white,
        fontSize: SIZES.h4,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueShoppingButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    continueShoppingText: {
        color: COLORS.white,
        fontSize: SIZES.body1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: SIZES.padding * 1.5,
        marginHorizontal: 20,
        marginBottom: 34,
        width: 'auto',
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 16,
        color: '#ABABAB',
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButtonConfirm: {
        backgroundColor: '#009245',
        padding: SIZES.padding,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalButtonTextConfirm: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    modalButtonTextCancel: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});