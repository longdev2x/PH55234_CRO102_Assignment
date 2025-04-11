import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Image, View, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { COLORS, SIZES } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch } from '@/store/hooks';
import { signUp } from '@/store/thunks/authThunks';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSignUp = async () => {
        if (!name || !email || !phone || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            await dispatch(signUp({ email, password, name, phone })).unwrap();
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to sign up. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.bannerContainer}>
                    <Image
                        source={require('@/assets/images/login_banner.png')}
                        style={styles.banner}
                    />
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.headerContainer}>
                        <ThemedText style={styles.title}>Đăng ký</ThemedText>
                        <ThemedText style={styles.subtitle}>Tạo tài khoản</ThemedText>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    name ? styles.inputFilled : null,
                                ]}
                                placeholder="Họ tên"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor="#8B8B8B"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    email ? styles.inputFilled : null,
                                ]}
                                placeholder="E-mail"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                placeholderTextColor="#8B8B8B"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    phone ? styles.inputFilled : null,
                                ]}
                                placeholder="Số điện thoại"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                placeholderTextColor="#8B8B8B"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    password ? styles.inputFilled : null,
                                    password && !showPassword ? { fontSize: 22 } : null
                                ]}
                                placeholder="Mật khẩu"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                placeholderTextColor="#8B8B8B"
                                passwordRules="minlength: 9; required: lower; required: upper; required: digit;"
                                textContentType="password"
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Image
                                    source={require('@/assets/images/eye_password_form_field.png')}
                                    style={[
                                        styles.icon,
                                        showPassword && styles.iconActive
                                    ]}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.termsContainer}>
                            <ThemedText style={styles.termsText}>
                                Để đăng ký tài khoản, bạn đồng ý {' '}
                                <ThemedText style={styles.termsLink}>Terms & Conditions</ThemedText>
                                {' '} and {' '}
                                <ThemedText style={styles.termsLink}>Privacy Policy</ThemedText>
                            </ThemedText>
                        </View>

                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={handleSignUp}
                            disabled={!name || !email || !phone || !password}
                        >
                            <LinearGradient
                                colors={['#007537', '#4CAF50']}
                                style={[
                                    styles.button,
                                    (!name || !email || !phone || !password) && styles.buttonDisabled
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <ThemedText style={styles.buttonText}>Đăng ký</ThemedText>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.dividerContainer}>
                            <LinearGradient
                                colors={['#007537', '#4CAF50']}
                                style={styles.dividerLine}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                            <ThemedText style={styles.dividerText}>Hoặc</ThemedText>
                            <LinearGradient
                                colors={['#4CAF50', '#007537']}
                                style={styles.dividerLine}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        </View>

                        <View style={styles.socialContainer}>
                            <TouchableOpacity
                                style={styles.socialButton}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Image
                                    source={require('@/assets/images/google_icon.png')}
                                    style={styles.socialIcon}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.socialButton}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Image
                                    source={require('@/assets/images/facebook_icon.png')}
                                    style={styles.socialIcon}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.signinContainer}>
                            <ThemedText style={styles.signinText}>Tôi đã có tài khoản </ThemedText>
                            <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
                                <ThemedText style={styles.signinLink}>Đăng nhập</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        marginTop: -width * 0.45,
    },
    bannerContainer: {
        width: width,
        height: width * 0.9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    banner: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: width * 0.06,
        paddingBottom: 20,
    },
    headerContainer: {
        marginTop: 0,
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 30,
        marginBottom: 8,
        color: '#000',
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 18,
        color: '#666',
    },
    form: {
        flex: 1,
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 16,
        width: width * 0.85,
    },
    input: {
        height: 65,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#8B8B8B',
        paddingHorizontal: 20,
        fontSize: 18,
        color: '#000',
        textAlignVertical: 'center',
    },
    inputFilled: {
        borderColor: '#009245',
    },
    eyeIcon: {
        position: 'absolute',
        right: 20,
        top: '50%',
        transform: [{ translateY: -12 }],
        padding: 4,
    },
    icon: {
        width: 28,
        height: 28,
        tintColor: '#8B8B8B',
    },
    iconActive: {
        tintColor: '#009245',
    },
    termsContainer: {
        width: width * 0.85,
        alignItems: 'center',
        marginBottom: 32,
    },
    termsText: {
        fontSize: 12,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 16,
        textAlign: 'center',
        color: '#666',
    },
    termsLink: {
        color: '#009245',
        fontWeight: '500',
    },
    buttonContainer: {
        width: width * 0.85,
        marginBottom: 32,
    },
    button: {
        height: 56,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Poppins',
        fontWeight: '700',
        lineHeight: 20,
        textAlign: 'center',
    },
    dividerContainer: {
        width: width * 0.85,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#666',
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 40,
    },
    socialButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIcon: {
        width: 28,
        height: 28,
    },
    signinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    signinText: {
        fontSize: 12,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 12,
        color: '#666',
    },
    signinLink: {
        fontSize: 12,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 12,
        color: '#009245',
    },
});