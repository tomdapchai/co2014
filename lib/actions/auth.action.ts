"use server";

import pool from "../mysql";
import { RowDataPacket } from "mysql2";

//https://sidorares.github.io/node-mysql2/docs

// Define types for our responses
export type AuthResponse = {
    success: boolean;
    message: string;
    userId?: string;
};

export async function loginUser(
    email: string,
    password: string
): Promise<AuthResponse> {
    try {
        // mock code, just the skeleton, idk how to use tho

        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM user WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return {
                success: false,
                message: "User not found",
            };
        }

        const user = rows[0];

        // TODO: Replace with proper password comparison using bcrypt or similar
        if (user.password !== password) {
            return {
                success: false,
                message: "Invalid password",
            };
        }

        return {
            success: true,
            message: "Login successful",
            userId: user.id.toString(),
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            message: "An error occurred during login",
        };
    }
}

export async function registerUser(
    email: string,
    password: string
): Promise<AuthResponse> {
    try {
        // Check if user already exists
        const [existingUsers] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return {
                success: false,
                message: "User already exists",
            };
        }

        // Insert new user
        const [result] = await pool.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, password] // TODO: Hash password before storing
        );

        // TypeScript type assertion for the result
        const { insertId } = result as { insertId: number };

        return {
            success: true,
            message: "Registration successful",
            userId: insertId.toString(),
        };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            message: "An error occurred during registration",
        };
    }
}
