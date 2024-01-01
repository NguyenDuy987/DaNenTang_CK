import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSend, setIsSend] = useState('false');
    const [isVerified, setIsVerified] = useState('false');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const handleSendCode = async () => {
        // Gọi API để gửi mã đặt lại mật khẩu đến email
        // Nếu thành công, chuyển đến màn hình nhập mã xác nhận
        try {
            const response = await axios.post('http://10.0.2.2:3000/api/forgot-password', { email });
            // Xử lý phản hồi từ server
            console.log(response.data);
            // Chuyển đến màn hình nhập mã xác nhận
            setResetCode('');
            setNewPassword('');
            setConfirmPassword('');
            setIsSend('true');
        } catch (error) {
            console.error('Error sending reset code:', error);
        }
    };

    const handleVerifyCode = async () => {
        // Gọi API để kiểm tra mã xác nhận
        // Nếu mã đúng, chuyển đến màn hình nhập mật khẩu mới
        try {
            const response = await axios.post('http://10.0.2.2:3000/api/verify-reset-code', { email, resetCode });
            // Xử lý phản hồi từ server
            console.log(response.data);
            // Chuyển đến màn hình nhập mật khẩu mới
            setNewPassword('');
            setConfirmPassword('');
            setIsVerified('true');
        } catch (error) {
            console.error('Error verifying reset code:', error);
        }
    };

    const handleResetPassword = async () => {
        // Gọi API để đặt lại mật khẩu
        // Nếu thành công, chuyển đến màn hình đăng nhập
        try {
            const response = await axios.post('http://10.0.2.2:3000/api/reset-password', { email, newPassword });
            // Xử lý phản hồi từ server
            console.log(response.data);
            setIsSend('false');
            setIsVerified('false');
            setShowSuccessModal(true);
            // Chuyển đến màn hình đăng nhập
            //navigation.navigate('Login');
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    const handleModalButtonPress = () => {
        // Xử lý khi nút trong modal được bấm
        // Chẳng hạn chuyển đến màn hình đăng nhập
        setShowSuccessModal(false);
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            {/* Màn hình nhập email */}
            {isVerified === 'false' && isSend === 'false' && resetCode === '' && newPassword === '' && confirmPassword === '' && (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <Button title="Send Code" onPress={handleSendCode} />
                </View>
            )}

            {/* Màn hình nhập mã xác nhận */}
            {isVerified === 'false' && isSend === 'true' && newPassword === '' && confirmPassword === '' && (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter verification code"
                        value={resetCode}
                        onChangeText={(text) => setResetCode(text)}
                    />
                    <Button title="Verify Code" onPress={handleVerifyCode} />
                </View>
            )}

            {/* Màn hình nhập mật khẩu mới */}
            {isVerified === 'true' && isSend === 'true' && resetCode !== '' && (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={(text) => setNewPassword(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm new password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                    />
                    <Button title="Reset Password" onPress={handleResetPassword} />
                </View>
            )}

            {/* Modal thông báo thành công */}
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Password updated successfully!</Text>
                        <TouchableOpacity onPress={handleModalButtonPress} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Go to Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        width: 300,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ForgotPasswordScreen;
