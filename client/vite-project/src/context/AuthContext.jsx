import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persistent login
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (gmail, password) => {
        try {
            const response = await authService.login({ gmail, password });
            if (response.status === 200) {
                const userData = response.data;

                const userToStore = {
                    id: userData.userId,
                    role: userData.role,
                    name: userData.name,
                    email: userData.email
                };
                setUser(userToStore);
                localStorage.setItem('user', JSON.stringify(userToStore));
                return { success: true };
            }
        } catch (error) {
            console.error("Login failed", error);
            return {
                success: false,
                message: error.response?.data || "Login failed"
            };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authService.signup(userData);
            if (response.status === 200) {
                const resData = response.data;
                const userToStore = {
                    id: resData.userId,
                    role: resData.role,
                    name: resData.name,
                    email: resData.email
                };
                setUser(userToStore);
                localStorage.setItem('user', JSON.stringify(userToStore));
                return { success: true };
            }
        } catch (error) {
            console.error("Signup failed", error);
            return { success: false, message: error.response?.data || "Signup failed" };
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
