import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, View, Dimensions, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { COLORS, SIZES } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  // Khởi tạo trạng thái với tất cả danh mục mặc định là false
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    cayTrong: false,
    chauCayTrong: false,
    comboChamSoc: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Get products by category
  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  // Render a single product item
  const renderProductItem = (item: any, index: number) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.productItem, index % 2 === 0 ? { marginRight: 10 } : { marginLeft: 10 }]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
      </View>
      <View style={styles.productInfo}>
        <ThemedText style={styles.productName}>{item.name}</ThemedText>
        {item.label && (
          <ThemedText style={styles.productDetail}>{item.label}</ThemedText>
        )}
        <ThemedText style={styles.productPrice}>{item.price.toLocaleString('vi-VN')}đ</ThemedText>
      </View>
      {item.label && (
        <View style={styles.labelOverlay}>
          <ThemedText style={styles.labelText}>{item.label}</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );

  // Render products in a row (2 items per row)
  const renderProductRow = (items: any[]) => {
    return (
      <View style={styles.productRow}>
        {items.map((item, index) => renderProductItem(item, index))}
      </View>
    );
  };

  const renderCategorySection = (title: string, category: string) => {
    const isExpanded = expandedCategories[category] || false;
    const categoryProducts = getProductsByCategory(category);

    // Ban đầu hiển thị tối đa 4 sản phẩm, khi mở rộng hiển thị tất cả
    const displayProducts = isExpanded ? categoryProducts : categoryProducts.slice(0, 4);
    const rows = [];

    // Tạo các hàng, mỗi hàng 2 sản phẩm
    for (let i = 0; i < displayProducts.length; i += 2) {
      const rowItems = displayProducts.slice(i, i + 2);
      if (rowItems.length > 0) {
        rows.push(rowItems);
      }
    }

    // Hiển thị nút "Xem thêm" nếu có từ 4 sản phẩm trở lên
    const showViewMore = categoryProducts.length >= 4;

    return (
      <View style={styles.categorySection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        </View>

        <View style={styles.productsContainer}>
          {rows.map((row, index) => (
            <View key={index}>
              {renderProductRow(row)}
            </View>
          ))}
        </View>

        {showViewMore && (
          <View style={styles.viewMoreContainer}>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => toggleCategoryExpansion(category)}
            >
              <ThemedText style={styles.viewMoreButtonText} color="#007537">
                {isExpanded ? 'Thu gọn' : `Xem thêm ${title}`}
              </ThemedText>
            </TouchableOpacity>
            <View style={styles.viewMoreDivider} />
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007537" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
          <ThemedText style={styles.retryText}>Thử lại</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner with title overlay */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('@/assets/images/banner_home_removebg.png')}
            style={styles.banner}
            resizeMode="cover"
          />

          {/* Title header overlay */}
          <View style={styles.headerOverlay}>
            <View style={styles.headerTextContainer}>
              <ThemedText style={styles.headerText}>Planta - toả sáng</ThemedText>
              <ThemedText style={styles.headerText}>không gian nhà bạn</ThemedText>
            </View>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => router.push('/cart')}
            >
              <Feather name="shopping-cart" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* View new button */}
          <View style={styles.viewNewContainer}>
            <ThemedText style={styles.viewNewText}>Xem hàng mới về</ThemedText>
            <Image
              source={require('@/assets/images/arrow_right.png')}
              style={styles.arrowIcon}
            />
          </View>
        </View>

        {/* Rest of the content */}
        <View style={styles.sectionContainer}>
          {/* Cây trồng section */}
          {renderCategorySection('Cây trồng', 'cayTrong')}

          {/* Chậu cây trồng section */}
          {renderCategorySection('Chậu cây trồng', 'chauCayTrong')}

          {/* Combo chăm sóc section */}
          {renderCategorySection('Combo chăm sóc (mới)', 'comboChamSoc')}
        </View>
      </ScrollView>
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 0,
  },
  bannerContainer: {
    width: width,
    height: width * 0.8,
    backgroundColor: '#F6F6F6',
    position: 'relative',
  },
  banner: {
    position: 'absolute',
    width: '100%',
    height: '46%',
    bottom: 0,
    right: 0,
  },
  headerOverlay: {
    position: 'absolute',
    top: '15%',
    left: 0,
    right: 0,
    height: '70%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontFamily: 'Lato',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 37,
    letterSpacing: 0,
    color: '#000000',
  },
  cartButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  viewNewContainer: {
    position: 'absolute',
    top: '40%',
    left: 17,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewNewText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007537',
    marginRight: 8,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    tintColor: '#007537',
  },
  sectionContainer: {
    paddingHorizontal: 16,
  },
  categorySection: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Lato',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 34,
    letterSpacing: 0,
    color: '#000000',
    verticalAlign: 'bottom',
  },
  productsContainer: {
    marginBottom: 16,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productItem: {
    width: (width - 42) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#F6F6F6',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  labelOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#000000',
  },
  productDetail: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#007537',
    fontWeight: '700',
  },
  viewMoreContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
    paddingBottom: 16,
  },
  viewMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 4,
  },
  viewMoreButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007537',
    textAlign: 'right',
  },
  viewMoreDivider: {
    height: 1,
    backgroundColor: '#007537',
    width: 'auto',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#D70000',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007537',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
