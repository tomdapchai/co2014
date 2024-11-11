"use client";
import React, { useState, useContext, createContext, useEffect } from "react";
import Cookies from "js-cookie";
import {
    loginUser,
    registerUser,
    AuthResponse,
} from "@/lib/actions/auth.action";

interface AuthContextProps {
    isLoggedIn: boolean;
    userId: string;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
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

const COOKIE_NAME = "auth_user_id";
const COOKIE_OPTIONS = {
    expires: 1,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
};

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [userId, setUserId] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load the authentication state from cookies when the component mounts
    useEffect(() => {
        const storedUserId = Cookies.get(COOKIE_NAME);
        if (storedUserId) {
            setUserId(storedUserId);
            setIsLoggedIn(true);
        }
        setIsInitialized(true);
    }, []);

    // Update cookie whenever the authentication state changes
    const updateAuthState = (newUserId: string, isLoggedIn: boolean) => {
        if (isLoggedIn) {
            Cookies.set(COOKIE_NAME, newUserId, COOKIE_OPTIONS);
        } else {
            Cookies.remove(COOKIE_NAME, { path: "/" });
        }
        setUserId(newUserId);
        setIsLoggedIn(isLoggedIn);
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await loginUser(username, password);
            if (response.success && response.userId) {
                updateAuthState(response.userId, true);
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

    const register = async (username: string, password: string) => {
        try {
            const response = await registerUser(username, password);
            if (response.success && response.userId) {
                updateAuthState(response.userId, true);
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
        updateAuthState("", false);
        setError(null);
    };

    // Don't render children until we've checked cookies
    if (!isInitialized) {
        return null; // Or a loading spinner
    }

    return (
        <AuthContext.Provider
            value={{ userId, isLoggedIn, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
