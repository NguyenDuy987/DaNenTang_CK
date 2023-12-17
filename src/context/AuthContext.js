// dung corejs de decode bas64
import "core-js/stable/atob";
import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();
import axios from 'axios';
import jwt_decode from 'jwt-decode'; // import sai
import { jwtDecode } from 'jwt-decode'; // import dung

const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXIiOiJtb3JfMjMxNCIsImlhdCI6MTcwMjQ1NzQ5M30.ySlvzXmBVUJJeqo5CDXVbCz4mZHQZ7Pd1DEbKfGyeEU"
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const authService = {
        login: async (username, password) => {
            const response = await axios.post('http://10.0.2.2:3000/login', {
                username: username,
                password: password,
            });
            if (response.status === 200) {
                const token = response.data.token;
                console.log(token);
                setToken(token);
                const userId = jwtDecode(token).userId;
                //const userId = jwt_decode(token).sub;
                console.log(userId);
                const userResponse = await axios.get(`http://10.0.2.2:3000/users/${userId}`);
                return userResponse.data;
            } else {
                throw new Error('Invalid credentials');
            }
        },
        logout: async () => {
            return true;
        },
        register: async (userData) => {
            try {
                const response = await axios.post('http://10.0.2.2:3000/register', userData);
                const { success, message } = response.data;

                if (success) {
                    return { success: true, message: 'Đăng ký thành công' };
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.error('Error during registration:', error.response || error.message || error);
                throw new Error(error);
            }
        },
    };

    const signIn = async (username, password) => {
        try {
            const authenticatedUser = await authService.login(username, password);
            setUser(authenticatedUser);
        } catch (error) {
            console.log(error);
            throw new Error('Authentication failed');
        }
    };

    const signOut = async () => {
        await authService.logout();
        setToken(null);
        setUser(null);
    };

    const registerUser = async (userData) => {
        try {
            await authService.register(userData);
        } catch (error) {
            console.error('Error during registration:', error.response || error.message || error);
            throw new Error('Registration failed');
        }
    };

    const profileUser = {
        user,
        token,
        signIn,
        signOut,
        registerUser
    };
    return (
        <AuthContext.Provider value={profileUser}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);