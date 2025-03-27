import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function EditProfileScreen() {
    const router = useRouter();
    const [name, setName] = useState('Trần Minh Trí');
    const [email, setEmail] = useState('tranminhtri@gmail.com');
    const [address, setAddress] = useState('60 Láng Hạ, Ba Đình, Hà Nội');
    const [phone, setPhone] = useState('0123456789');
    const [isSaving, setIsSaving] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            router.back();
        }, 1000);
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "CHỈNH SỬA THÔNG TIN",
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#000000',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={handleBack}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={{ paddingHorizontal: 16 }}
                        >
                            <Feather name="chevron-left" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: '#FFFFFF',
                    },
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.content}>
                        <Image
                            source={require('@/assets/images/react-logo.png')}
                            defaultSource={require('@/assets/images/react-logo.png')}
                            style={styles.avatar}
                        />

                        <ThemedText style={styles.helpText}>
                            Thông tin sẽ được lưu cho lần mua kế tiếp.{'\n'}
                            Bấm vào thông tin chi tiết để chỉnh sửa.
                        </ThemedText>

                        <View style={styles.form}>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                            />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TextInput
                                value={address}
                                onChangeText={setAddress}
                                style={styles.input}
                            />
                            <TextInput
                                value={phone}
                                onChangeText={setPhone}
                                style={styles.input}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            isSaving && styles.buttonActive
                        ]}
                        onPress={handleSave}
                        disabled={isSaving}
                    >
                        <ThemedText style={styles.buttonText}>
                            LƯU THÔNG TIN
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    helpText: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 32,
        color: '#000000',
    },
    form: {
        width: '100%',
        gap: 32,
    },
    input: {
        width: '100%',
        fontSize: 14,
        color: '#000000',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        backgroundColor: '#FFFFFF',
    },
    button: {
        height: 48,
        backgroundColor: '#898989',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonActive: {
        backgroundColor: '#007537',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },
}); 