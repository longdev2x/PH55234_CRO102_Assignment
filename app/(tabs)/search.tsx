import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/constants/theme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/constants/mockData';
import { api } from '@/services/api';

interface SearchHistory {
    id: string;
    name: string;
    timestamp: number;
}

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadSearchHistory();
    }, []);

    const loadSearchHistory = async () => {
        try {
            const history = await AsyncStorage.getItem('searchHistory');
            if (history) {
                setRecentSearches(JSON.parse(history));
            }
        } catch (error) {
            console.error('Error loading search history:', error);
        }
    };

    const saveSearchHistory = async (query: string) => {
        try {
            const newSearch = {
                id: Date.now().toString(),
                name: query,
                timestamp: Date.now(),
            };

            const updatedHistory = [
                newSearch,
                ...recentSearches.filter(item => item.name !== query)
            ].slice(0, 5);

            await AsyncStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
            setRecentSearches(updatedHistory);
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    };

    const handleSearch = async (text: string) => {
        setSearchQuery(text);
        setShowResults(text.length > 0);

        if (text) {
            try {
                setLoading(true);
                setError(null);
                const results = await api.searchProducts(text);
                setFilteredProducts(results);
            } catch (err) {
                setError('Failed to search products');
                console.error('Error searching products:', err);
            } finally {
                setLoading(false);
            }
        } else {
            setFilteredProducts([]);
        }
    };

    const clearSearch = async (searchName: string) => {
        try {
            const updatedHistory = recentSearches.filter(item => item.name !== searchName);
            await AsyncStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
            setRecentSearches(updatedHistory);
        } catch (error) {
            console.error('Error removing search history:', error);
        }
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            saveSearchHistory(searchQuery.trim());
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Feather name="chevron-left" size={24} color="black" />
                </View>
                <ThemedText style={styles.headerTitle}>TÌM KIẾM</ThemedText>
                <View style={styles.headerRight} />
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearchSubmit}
                >
                    <Feather name="search" size={20} color="black" />
                </TouchableOpacity>
            </View>

            {!showResults ? (
                <View style={styles.recentContainer}>
                    <ThemedText style={styles.recentTitle}>Tìm kiếm gần đây</ThemedText>
                    {recentSearches.map((item) => (
                        <View key={item.id} style={styles.recentItem}>
                            <TouchableOpacity
                                style={styles.recentItemLeft}
                                onPress={() => {
                                    setSearchQuery(item.name);
                                    handleSearch(item.name);
                                }}
                            >
                                <Feather name="clock" size={16} color="#ABABAB" />
                                <ThemedText style={styles.recentItemText}>{item.name}</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => clearSearch(item.name)}>
                                <Feather name="x" size={16} color="#ABABAB" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.resultsContainer}>
                    {loading ? (
                        <ThemedText>Đang tìm kiếm...</ThemedText>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <ThemedText style={styles.errorText}>{error}</ThemedText>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={() => handleSearch(searchQuery)}
                            >
                                <ThemedText style={styles.retryText}>Thử lại</ThemedText>
                            </TouchableOpacity>
                        </View>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <TouchableOpacity
                                key={product.id}
                                style={styles.resultItem}
                                onPress={() => router.push(`/product/${product.id}`)}
                            >
                                <Image
                                    source={{ uri: product.image }}
                                    style={styles.resultImage}
                                    defaultSource={require('@/assets/images/react-logo.png')}
                                />
                                <View style={styles.resultInfo}>
                                    <ThemedText style={styles.resultName}>{product.name}</ThemedText>
                                    <ThemedText style={styles.resultPrice}>{product.price}</ThemedText>
                                    <ThemedText style={styles.resultStock}>
                                        {product.details?.status}
                                    </ThemedText>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <ThemedText>Không tìm thấy sản phẩm nào</ThemedText>
                    )}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#000000',
    },
    searchButton: {
        padding: 8,
        marginLeft: 8,
    },
    recentContainer: {
        padding: 16,
    },
    recentTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 16,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    recentItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    recentItemText: {
        fontSize: 14,
        color: '#000000',
        marginLeft: 12,
    },
    resultsContainer: {
        flex: 1,
        padding: 16,
    },
    resultItem: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    resultImage: {
        width: 80,
        height: 80,
        borderRadius: 4,
    },
    resultInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    resultName: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 4,
    },
    resultPrice: {
        fontSize: 14,
        color: '#007537',
        fontWeight: '600',
        marginBottom: 4,
    },
    resultStock: {
        fontSize: 12,
        color: '#ABABAB',
    },
    errorContainer: {
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        color: '#FF0000',
        marginBottom: 8,
    },
    retryButton: {
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