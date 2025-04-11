import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { COLORS, SIZES } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/selectors/authSelectors';
import { storage } from '@/services/storage';
import * as ImagePicker from 'expo-image-picker';
import { api } from '@/services/api';
import { updateUser } from '@/store/thunks/authThunks';

export default function EditProfileScreen() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const router = useRouter();
    const [avatar, setAvatar] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (user) {
            loadAvatar();
            setName(user.name || '');
            setEmail(user.email || '');
            setAddress(user.address || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const loadAvatar = async () => {
        if (user) {
            const savedAvatar = await storage.getAvatar(user.id);
            setAvatar(savedAvatar);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant permission to access your photos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets[0].uri) {
            if (user) {
                await storage.saveAvatar(user.id, result.assets[0].uri);
                setAvatar(result.assets[0].uri);
            }
        }
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            const updatedUser = {
                ...user,
                name,
                email,
                address,
                phone,
            };

            await dispatch(updateUser(updatedUser)).unwrap();
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen 
                options={{
                    title: 'CHỈNH SỬA THÔNG TIN',
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Feather name="chevron-left" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.content}>
                <ThemedText style={styles.hint}>
                    Thông tin sẽ được lưu cho lần mua kế tiếp.
                    Bấm vào thông tin chỉ tiết để chỉnh sửa.
                </ThemedText>

                <TouchableOpacity 
                    style={styles.avatarContainer}
                    onPress={pickImage}
                >
                    {avatar ? (
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarOverlay} />
                            <View style={styles.checkerPattern} />
                        </View>
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Feather name="user" size={40} color={COLORS.gray} />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Họ và tên"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Địa chỉ"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Số điện thoại"
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <ThemedText style={styles.saveButtonText}>LƯU THÔNG TIN</ThemedText>
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
    content: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
    },
    hint: {
        fontSize: SIZES.body2,
        color: COLORS.gray,
        textAlign: 'center',
        marginVertical: SIZES.padding,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignSelf: 'center',
        marginBottom: SIZES.padding * 2,
        overflow: 'hidden',
    },
    avatarWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    avatarOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1,
    },
    checkerPattern: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.lightGray,
        zIndex: 0,
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        gap: SIZES.base,
    },
    inputContainer: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray,
    },
    input: {
        fontSize: SIZES.body1,
        paddingVertical: SIZES.base,
    },
    saveButton: {
        backgroundColor: COLORS.green,
        paddingVertical: SIZES.base * 1.5,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        marginTop: SIZES.padding * 2,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: SIZES.body1,
        fontWeight: '600',
    },
});