import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';
import { api } from '@/services/api';

interface FAQ {
    id: number;
    question: string;
    answer: string;
}

export default function QAScreen() {
    const router = useRouter();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        loadFAQs();
    }, []);

    const loadFAQs = async () => {
        try {
            const response = await api.getFAQs();
            setFaqs(response);
        } catch (error) {
            console.error('Error loading FAQs:', error);
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
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
                    onPress={() => router.back()}
                >
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Q & A</ThemedText>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content}>
                {faqs.map((faq) => (
                    <TouchableOpacity
                        key={faq.id}
                        style={styles.faqItem}
                        onPress={() => toggleExpand(faq.id)}
                    >
                        <View style={styles.questionContainer}>
                            <ThemedText style={styles.question}>{faq.question}</ThemedText>
                            <Feather
                                name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="black"
                            />
                        </View>
                        {expandedId === faq.id && (
                            <View style={styles.answerContainer}>
                                <ThemedText style={styles.answer}>{faq.answer}</ThemedText>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
    faqItem: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEEEEE',
        paddingHorizontal: 16,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    question: {
        fontSize: 14,
        color: '#000000',
        flex: 1,
        marginRight: 16,
    },
    answerContainer: {
        paddingBottom: 16,
    },
    answer: {
        fontSize: 14,
        color: '#898989',
        lineHeight: 20,
    },
}); 