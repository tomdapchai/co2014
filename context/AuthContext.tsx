"use client";
import React, { useState, useContext, createContext, useEffect } from "react";
import {
    loginUser,
    registerUser,
    AuthResponse,
} from "@/lib/actions/auth.action";

interface AuthContextProps {
    isLoggedIn: boolean;
    userId: string;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [userId, setUserId] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    //mock data
    useEffect(() => {
        setUserId("1234");
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await loginUser(email, password);

            if (response.success && response.userId) {
                setUserId(response.userId);
                setIsLoggedIn(true);
                setError(null);
            } else {
                setError(response.message);
                throw new Error(response.message);
            }
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "An error occurred"
            );
            throw error;
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const response = await registerUser(email, password);

            if (response.success && response.userId) {
                setUserId(response.userId);
                setIsLoggedIn(true);
                setError(null);
            } else {
                setError(response.message);
                throw new Error(response.message);
            }
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "An error occurred"
            );
            throw error;
        }
    };

    const logout = async () => {
        setUserId("");
        setIsLoggedIn(false);
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{ userId, isLoggedIn, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
