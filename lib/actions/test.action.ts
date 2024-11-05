"use server";
import pool from "../mysql";

export async function getData() {
    try {
        const connection = await pool.getConnection();
        await connection.query("SELECT 1"); // Simple query to test the connection
        connection.release();
        console.log("Database connection successful");
    } catch (error) {
        console.error("Error establishing database connection:", error);
        throw new Error("Database connection failed");
    }
}
