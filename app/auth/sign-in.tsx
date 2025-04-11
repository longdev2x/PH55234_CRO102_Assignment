import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Image, View, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch } from '@/store/hooks';
import { signIn } from '@/store/thunks/authThunks';

const { width, height } = Dimensions.get('window');

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            await dispatch(signIn({ email, password })).unwrap();
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Invalid email or password. Try again!');
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
                                    !showPassword ? { fontSize: 20 } : null
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
        height: height * 0.45, // Giảm tỷ lệ height để tránh chiếm quá nhiều không gian
        alignItems: 'center',
        justifyContent: 'center',
    },
    banner: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain', // Thay 'contain' bằng 'cover' để đảm bảo hình ảnh đầy khung
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: width * 0.05, // Giảm padding để phù hợp với màn hình nhỏ
        paddingBottom: height * 0.03, // Dùng height để padding linh hoạt hơn
        // borderTopLeftRadius: 30, // Thêm bo góc trên để khớp với design hiện đại
        borderTopRightRadius: 30,
        marginTop: 10, // Kéo form lên để chồng lấn nhẹ với banner
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
        marginBottom: 20, // Giảm khoảng cách để UI gọn hơn
        width: width * 0.88, // Tăng nhẹ để tận dụng không gian
    },
    input: {
        height: 65,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#8B8B8B',
        paddingHorizontal: 18,
        fontSize: 18,
        color: '#000',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        textAlignVertical: 'center',
    },
    inputFilled: {
        borderColor: '#009245',
        borderWidth: 2,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15, // Giảm right để gần mép hơn
        top: '50%',
        transform: [{ translateY: -14 }], // Điều chỉnh theo height mới của input
    },
    icon: {
        width: 24, // Giảm kích thước để tinh tế hơn
        height: 24,
    },
    iconActive: {
        tintColor: '#009245',
    },
    rememberContainer: {
        width: width * 0.88,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
    },
    checkboxContainer: {
        width: 20, // Tăng kích thước checkbox
        height: 20,
        borderWidth: 2,
        borderColor: '#007537',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        width: 14,
        height: 14,
    },
    rememberText: {
        fontSize: 13, // Tăng fontSize để dễ đọc
        color: '#555', // Đổi màu để nổi bật hơn
    },
    forgotText: {
        fontSize: 13,
        color: '#007537',
        fontWeight: '600', // Tăng độ đậm để nhấn mạnh
    },
    rememberLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkboxChecked: {
        backgroundColor: '#007537',
    },
    buttonContainer: {
        width: width * 0.88, // Tăng nhẹ để đồng bộ với input
        marginBottom: 28,
    },
    button: {
        height: 52, // Tăng nhẹ để dễ bấm hơn
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4, // Thêm shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18, // Giảm fontSize để cân đối
        fontFamily: 'Poppins',
        fontWeight: '600', // Giảm weight để nhẹ nhàng hơn
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    dividerContainer: {
        width: width * 0.88,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
    },
    dividerLine: {
        flex: 1,
        height: 1.5, // Tăng độ dày để rõ hơn
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#777',
        fontSize: 15,
        fontWeight: '500',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24, // Tăng gap để thoáng hơn
        marginBottom: 36,
    },
    socialButton: {
        width: 56, // Tăng kích thước để dễ bấm
        height: 56,
        borderRadius: 28,
        // backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        // elevation: 2, // Thêm shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    socialIcon: {
        width: 30,
        height: 30,
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