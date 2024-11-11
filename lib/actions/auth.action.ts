"use server";

import pool from "../mysql";
import { RowDataPacket, ResultSetHeader } from "mysql2";
//https://sidorares.github.io/node-mysql2/docs
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
// Define types for our responses
export type AuthResponse = {
    success: boolean;
    message: string;
    userId?: string;
};

export async function loginUser(
    username: string,
    password: string
): Promise<AuthResponse> {
    try {
        // mock code, just the skeleton, idk how to use tho

        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM user WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return {
                success: false,
                message: "User not found",
            };
        }
        const user = rows[0];
        console.log("User:", user);

        // TODO: Replace with proper password comparison using bcrypt or similar
        if (!bcrypt.compareSync(password, user.password)) {
            return {
                success: false,
                message: "Invalid password",
            };
        }

        return {
            success: true,
            message: "Login successful",
            userId: user.ID_user.toString(),
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
    username: string,
    password: string
): Promise<AuthResponse> {
    try {
        // Check if user already exists
        const [existingUsers] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM user WHERE username = ?",
            [username]
        );

        if (existingUsers.length > 0) {
            return {
                success: false,
                message: "User already exists",
            };
        }

        const hashPassword = bcrypt.hashSync(password, salt);

        // Insert new user
        const [result] = await pool.execute<ResultSetHeader>(
            "INSERT INTO user (username, password) VALUES (?, ?)",
            [username, hashPassword] // TODO: Hash password before storing
        );

        console.log("Registration result:", result);
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
