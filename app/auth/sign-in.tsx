import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Image, View, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { COLORS, SIZES } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            await signIn(email, password);
            router.replace('/');
        } catch (error) {
            Alert.alert('Invalid email or Password. Try Again!');
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
                        <ThemedText style={styles.title}>Chào mừng bạn</ThemedText>
                        <ThemedText style={styles.subtitle}>Đăng nhập tài khoản</ThemedText>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    email ? styles.inputFilled : null,
                                ]}
                                placeholder="Email"
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
                                    password ? styles.inputFilled : null,
                                ]}
                                placeholder="Mật khẩu"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                placeholderTextColor="#8B8B8B"
                                passwordRules="minlength: 9; required: lower; required: upper; required: digit;"
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

                        <View style={styles.rememberContainer}>
                            <TouchableOpacity
                                style={styles.rememberLeft}
                                onPress={() => setRememberMe(!rememberMe)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <View style={[
                                    styles.checkboxContainer,
                                    rememberMe && styles.checkboxChecked
                                ]}>
                                    {rememberMe && (
                                        <Image
                                            source={require('@/assets/images/check_mark_remember_me.png')}
                                            style={styles.checkIcon}
                                        />
                                    )}
                                </View>
                                <ThemedText style={styles.rememberText}>Nhớ tài khoản</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <ThemedText style={styles.forgotText}>Quên mật khẩu?</ThemedText>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={handleSignIn}
                            disabled={!email || !password}
                        >
                            <LinearGradient
                                colors={['#007537', '#4CAF50']}
                                style={[
                                    styles.button,
                                    (!email || !password) && styles.buttonDisabled
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <ThemedText style={styles.buttonText}>Đăng nhập</ThemedText>
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

                        <View style={styles.signupContainer}>
                            <ThemedText style={styles.signupText}>Bạn không có tài khoản </ThemedText>
                            <TouchableOpacity onPress={() => router.push('/auth/sign-up')}>
                                <ThemedText style={styles.signupLink}>Tạo tài khoản</ThemedText>
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
        marginTop: -width * 0.2,
    },
    bannerContainer: {
        width: width,
        height: width,
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
        paddingBottom: 24,
    },
    headerContainer: {
        marginTop: 0,
        marginBottom: 40,
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
        marginBottom: 24,
        width: width * 0.85,
    },
    input: {
        height: 56,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#8B8B8B',
        paddingHorizontal: 20,
        fontSize: 18,
        color: '#000',
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
    rememberContainer: {
        width: width * 0.85,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    rememberLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkboxContainer: {
        width: 18,
        height: 18,
        borderWidth: 1.5,
        borderColor: '#007537',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#007537',
    },
    checkIcon: {
        width: 12,
        height: 12,
        tintColor: '#fff',
    },
    rememberText: {
        fontSize: 11,
        fontFamily: 'Poppins',
        fontWeight: '500',
        lineHeight: 11,
        color: '#666',
    },
    forgotText: {
        fontSize: 11,
        fontFamily: 'Poppins',
        fontWeight: '500',
        lineHeight: 11,
        color: '#007537',
    },
    buttonContainer: {
        width: width * 0.85,
        marginBottom: 32,
    },
    button: {
        height: 50,
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
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    signupText: {
        fontSize: 12,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 12,
        color: '#666',
    },
    signupLink: {
        fontSize: 12,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 12,
        color: '#009245',
    },
}); 