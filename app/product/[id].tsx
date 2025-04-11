import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { COLORS, SIZES } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { api } from '@/services/api';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [quantity, setQuantity] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<any>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getProductById(id as string);
            setProduct(data);
        } catch (err) {
            console.error('Error loading product:', err);
            setError('Không thể tải thông tin sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#007537" />
            </ThemedView>
        );
    }

    if (error || !product) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Feather name="chevron-left" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.notFound}>
                    <ThemedText style={styles.notFoundText}>
                        {error || 'Không tìm thấy sản phẩm'}
                    </ThemedText>
                </View>
            </ThemedView>
        );
    }

    const handleQuantityChange = (increment: boolean) => {
        setQuantity(prev => {
            const newQuantity = increment ? prev + 1 : prev - 1;
            return Math.max(0, newQuantity); // Prevent negative quantities
        });
    };

    const handleAddToCart = () => {
        if (quantity > 0) {
            const priceNumber = parseInt(product.price.replace(/\D/g, ''));
            addToCart({
                id: product.id,
                name: product.name,
                price: priceNumber.toString(),
                quantity: quantity,
                image: product.image,
                category: getCategoryName(product.category),
                label: product.label,
                size: product.details?.size,
                origin: product.details?.origin,
                status: product.details?.status,
            });
            router.push('/cart');
        }
    };

    const totalPrice = parseInt(product.price.replace(/\D/g, '')) * quantity;
    const formattedTotalPrice = totalPrice.toLocaleString('vi-VN') + 'đ';

    const getCategoryName = (category: string) => {
        switch (category) {
            case 'cayTrong':
                return 'Cây trồng';
            case 'chauCayTrong':
                return 'Chậu cây trồng';
            case 'phuKien':
                return 'Phụ kiện';
            case 'comboChamSoc':
                return 'Combo chăm sóc';
            default:
                return category;
        }
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>{product.name}</ThemedText>
                <TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartButton}>
                    <Feather name="shopping-cart" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
                    <View style={styles.dotsContainer}>
                        {[0, 1, 2].map((index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentImageIndex === index && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {/* Tags and Price */}
                    <View style={styles.tagsAndPriceContainer}>
                        <View style={styles.tagsContainer}>
                            <View style={styles.tag}>
                                <ThemedText style={styles.tagText}>{getCategoryName(product.category)}</ThemedText>
                            </View>
                            {product.label && (
                                <View style={[styles.tag, styles.labelTag]}>
                                    <ThemedText style={styles.tagText}>{product.label}</ThemedText>
                                </View>
                            )}
                        </View>
                        <ThemedText style={styles.price}>{product.price}</ThemedText>
                    </View>

                    {/* Product Details */}
                    <View style={styles.detailsContainer}>
                        <ThemedText style={styles.detailsTitle}>Chi tiết sản phẩm</ThemedText>
                        {product.details && (
                            <>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Kích cỡ</ThemedText>
                                    <ThemedText style={styles.detailValue}>{product.details.size}</ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Xuất xứ</ThemedText>
                                    <ThemedText style={styles.detailValue}>{product.details.origin}</ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Tình trạng</ThemedText>
                                    <ThemedText style={[styles.detailValue, styles.detailStatus]}>
                                        {product.details.status}
                                    </ThemedText>
                                </View>
                            </>
                        )}
                        {product.description && (
                            <View style={styles.descriptionContainer}>
                                <ThemedText style={styles.detailLabel}>Mô tả:</ThemedText>
                                <ThemedText style={styles.description}>{product.description}</ThemedText>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Quantity and Add to Cart */}
            <View style={styles.footer}>
                <View style={styles.footerRow}>
                    <ThemedText style={styles.quantityLabel}>
                        Đã chọn {quantity} sản phẩm
                    </ThemedText>
                    <ThemedText style={styles.totalLabel}>Tạm tính</ThemedText>
                </View>

                <View style={styles.footerRow}>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            onPress={() => handleQuantityChange(false)}
                            style={[styles.quantityButton, quantity === 0 && styles.quantityButtonDisabled]}
                        >
                            <ThemedText style={[
                                styles.quantityButtonText,
                                quantity === 0 && styles.quantityButtonTextDisabled
                            ]}>-</ThemedText>
                        </TouchableOpacity>
                        <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
                        <TouchableOpacity
                            onPress={() => handleQuantityChange(true)}
                            style={styles.quantityButton}
                        >
                            <ThemedText style={styles.quantityButtonText}>+</ThemedText>
                        </TouchableOpacity>
                    </View>

                    <ThemedText style={styles.totalAmount}>{formattedTotalPrice}</ThemedText>
                </View>

                <TouchableOpacity
                    style={[styles.addToCartButton, quantity === 0 && styles.addToCartButtonDisabled]}
                    onPress={handleAddToCart}
                    disabled={quantity === 0}
                >
                    <ThemedText style={styles.addToCartText}>CHỌN MUA</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
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
        fontWeight: '500',
        flex: 1,
        textAlign: 'center',
        color: '#000000',
    },
    backButton: {
        padding: 8,
    },
    cartButton: {
        padding: 8,
    },
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFoundText: {
        fontSize: SIZES.h3,
        color: '#000000',
    },
    imageContainer: {
        width: width,
        height: width * 0.7,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    dotsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.gray,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
    },
    contentContainer: {
        padding: SIZES.padding,
    },
    tagsAndPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    tag: {
        backgroundColor: '#009245',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    labelTag: {
        backgroundColor: '#009245',
    },
    tagText: {
        color: COLORS.white,
        fontSize: 14,
    },
    price: {
        fontSize: SIZES.h2,
        fontWeight: '700',
        color: '#007537',
    },
    detailsContainer: {
        marginTop: SIZES.padding,
    },
    detailsTitle: {
        fontSize: SIZES.h4,
        fontWeight: '500',
        marginBottom: SIZES.base,
        color: '#000000',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    detailLabel: {
        fontSize: 16,
        color: '#000000',
    },
    detailValue: {
        fontSize: 16,
        color: '#000000',
    },
    descriptionContainer: {
        marginTop: SIZES.padding,
    },
    description: {
        marginTop: 8,
        color: '#000000',
        lineHeight: 20,
    },
    footer: {
        padding: SIZES.padding,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        backgroundColor: COLORS.white,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    quantityLabel: {
        fontSize: SIZES.body3,
        color: '#000000',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 4,
    },
    quantityButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityButtonDisabled: {
        opacity: 1,
    },
    quantityButtonText: {
        fontSize: 20,
        color: '#009245',
    },
    quantityButtonTextDisabled: {
        color: '#ABABAB',
    },
    quantityText: {
        fontSize: SIZES.body2,
        fontWeight: '500',
        minWidth: 36,
        textAlign: 'center',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: COLORS.lightGray,
        paddingVertical: 8,
        color: '#000000',
    },
    totalLabel: {
        fontSize: SIZES.body3,
        color: '#000000',
    },
    totalAmount: {
        fontSize: SIZES.h3,
        fontWeight: '700',
        color: '#009245',
    },
    addToCartButton: {
        backgroundColor: '#009245',
        padding: SIZES.padding,
        borderRadius: 8,
        alignItems: 'center',
    },
    addToCartButtonDisabled: {
        backgroundColor: '#ABABAB',
    },
    addToCartText: {
        color: COLORS.white,
        fontSize: SIZES.h4,
        fontWeight: '600',
    },
    detailStatus: {
        color: '#007537',
    },
}); 