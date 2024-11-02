"use client";
import React, { useState, useContext, createContext } from "react";

interface AuthContextProps {
    isLoggedIn: boolean;
    userId: string;
    login: (email: string, password: string) => void;
    logout: () => Promise<void>;
    register: (email: string, password: string) => void;
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

    const login = async (email: string, password: string) => {
        try {
            // do login request here, send credentials to server

            // after login success
            setUserId(userId);
            setIsLoggedIn(true);
        } catch (error) {
            throw new Error("Invalid credentials");
        }
    };

    const register = async (email: string, password: string) => {
        try {
            // do register request here, send credentials to server
        } catch (error) {
            throw new Error("Invalid credentials");
        }
    };

    const logout = async () => {};

    return (
        <AuthContext.Provider
            value={{ userId, isLoggedIn, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
