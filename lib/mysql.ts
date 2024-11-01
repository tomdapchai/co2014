"use server";
import mysql from "mysql2/promise";

async function connectToDatabase() {
    try {
        const db = await mysql.createConnection({
            host: process.env.NEXT_PUBLIC_DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.NEXT_PUBLIC_DB_NAME,
        });

        return db;
    } catch (error) {
        console.error("Failed to connect to database:", error);
    }
}
