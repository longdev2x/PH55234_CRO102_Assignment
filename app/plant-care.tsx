import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';
import { api } from '@/services/api';
import type { PlantCareGuide } from '@/services/api';

const { width } = Dimensions.get('window');

export default function PlantCareScreen() {
    const router = useRouter();
    const [guide, setGuide] = useState<PlantCareGuide | null>(null);
    const [expandedStage, setExpandedStage] = useState(1);

    useEffect(() => {
        loadGuide();
    }, []);

    const loadGuide = async () => {
        try {
            const data = await api.getPlantCareGuide(1); // Get first guide
            setGuide(data);
        } catch (error) {
            console.error('Error loading plant care guide:', error);
        }
    };

    if (!guide) {
        return null; // Or loading indicator
    }

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
                <ThemedText style={styles.headerTitle}>{guide.name}</ThemedText>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content}>
                {/* Plant Image */}
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.arrowButton}>
                        <Feather name="chevron-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: guide.image }}
                        style={styles.plantImage}
                        resizeMode="contain"
                    />
                    <TouchableOpacity style={styles.arrowButton}>
                        <Feather name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Tags */}
                <View style={styles.tagContainer}>
                    {guide.tags.map((tag: string, index: number) => (
                        <View key={index} style={styles.tag}>
                            <ThemedText style={styles.tagText}>{tag}</ThemedText>
                        </View>
                    ))}
                </View>

                {/* Basic Knowledge Section */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Kiến thức cơ bản</ThemedText>
                        <Feather name="plus" size={20} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Stages Section */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Các giai đoạn</ThemedText>
                        <Feather name="minus" size={20} color="black" />
                    </TouchableOpacity>

                    {guide.stages.map((stage) => (
                        <TouchableOpacity
                            key={stage.id}
                            style={styles.stageItem}
                            onPress={() => setExpandedStage(stage.id)}
                        >
                            <View style={styles.stageHeader}>
                                <ThemedText style={styles.stageTitle}>
                                    {stage.id}. {stage.title} ({stage.duration})
                                </ThemedText>
                                <Feather
                                    name={expandedStage === stage.id ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="black"
                                />
                            </View>
                            {expandedStage === stage.id && (
                                <View style={styles.stageDetails}>
                                    {stage.details.map((detail: string, index: number) => (
                                        <ThemedText key={index} style={styles.detailText}>
                                            {detail}
                                        </ThemedText>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
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
    imageContainer: {
        height: 300,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    arrowButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plantImage: {
        width: width - 120,
        height: 250,
    },
    tagContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 8,
    },
    tag: {
        backgroundColor: '#007537',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    section: {
        borderTopWidth: 0.5,
        borderTopColor: '#EEEEEE',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    stageItem: {
        borderTopWidth: 0.5,
        borderTopColor: '#EEEEEE',
    },
    stageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    stageTitle: {
        fontSize: 14,
        color: '#000000',
    },
    stageDetails: {
        padding: 16,
        paddingTop: 0,
    },
    detailText: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 8,
    },
}); 