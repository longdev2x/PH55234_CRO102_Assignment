import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';
import { api, Transaction } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function TransactionHistoryScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            if (user?.id) {
                const data = await api.getTransactionHistory(user.id);
                setTransactions(data);
            }
        } catch (err) {
            setError('Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.');
            console.error('Error loading transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderTransaction = (transaction: Transaction) => (
        <TouchableOpacity
            key={transaction.id}
            style={styles.transactionItem}
            onPress={() => router.push(`/transaction-detail/${transaction.id}`)}
        >
            <View style={styles.transactionHeader}>
                <Image source={{ uri: transaction.image }} style={styles.productImage} />
                <View style={styles.transactionInfo}>
                    <View style={styles.statusContainer}>
                        <ThemedText style={[
                            styles.status,
                            { color: transaction.type === 'success' ? '#007537' : '#D70000' }
                        ]}>
                            {transaction.title}
                        </ThemedText>
                        <ThemedText style={styles.date}>{transaction.date}</ThemedText>
                    </View>
                    <ThemedText style={styles.productName}>
                        {transaction.productName} | {transaction.productCategory}
                    </ThemedText>
                    <ThemedText style={styles.quantity}>{transaction.quantity}</ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );

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
                <ThemedText style={styles.headerTitle}>LỊCH SỬ GIAO DỊCH</ThemedText>
                <View style={styles.headerRight} />
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#007537" />
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <ThemedText style={styles.errorText}>{error}</ThemedText>
                    <TouchableOpacity style={styles.retryButton} onPress={loadTransactions}>
                        <ThemedText style={styles.retryText}>Thử lại</ThemedText>
                    </TouchableOpacity>
                </View>
            ) : transactions.length === 0 ? (
                <View style={styles.centerContent}>
                    <ThemedText style={styles.emptyText}>Chưa có giao dịch nào</ThemedText>
                </View>
            ) : (
                <ScrollView style={styles.content}>
                    {transactions.map(renderTransaction)}
                </ScrollView>
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
    content: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    transactionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
        marginRight: 12,
    },
    transactionInfo: {
        flex: 1,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    status: {
        fontSize: 14,
        fontWeight: '500',
    },
    date: {
        fontSize: 12,
        color: '#898989',
    },
    productName: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 4,
    },
    quantity: {
        fontSize: 12,
        color: '#898989',
    },
    errorText: {
        color: '#D70000',
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        padding: 12,
        backgroundColor: '#007537',
        borderRadius: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    emptyText: {
        color: '#898989',
        fontSize: 14,
    },
}); 