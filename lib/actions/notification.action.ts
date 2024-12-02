"use server";
import pool from "../mysql";
import { RowDataPacket } from "mysql2";
import { notificationProps } from "@/types";

export const getNotifications = async (
    userId: string
): Promise<notificationProps[] | { error: string }> => {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM noti WHERE ID_user = ?",
            [userId]
        );

        return (rows as RowDataPacket[]).map((data) => {
            const { id, type, content, time } = data;
            return {
                id: id.toString(),
                title: type,
                description: content,
                time: time,
            };
        });
    } catch (error) {
        console.error("Notification error:", error);
        return {
            error: "An error occurred during notification retrieval",
        };
    }
};
