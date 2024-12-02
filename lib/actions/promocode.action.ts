"use server";
import pool from "../mysql";

import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PromoCodeTrue, PromoCodeView } from "@/types";

export const createPromoCodeEvent = async (
    eventId: string,
    data: PromoCodeView
) => {
    const { code, discount, quantity, expiryDate } = data;

    try {
        const [rows] = await pool.execute<ResultSetHeader>(
            "INSERT INTO promo_code (code_name, discount_amount, expiry_date, quantity) VALUES (?, ?, ?, ?)",
            [code, discount, expiryDate, quantity]
        );

        const promoCodeId = rows.insertId;

        await pool.execute(
            "INSERT INTO event_code (ID_code, ID_event) VALUES (?, ?)",
            [promoCodeId, eventId]
        );
    } catch (error) {
        console.error("Promo code creation error:", error);
        return {
            error: "An error occurred during promo code creation",
        };
    }
};

export const getPromoCodeEvent = async (
    eventId: string
): Promise<PromoCodeTrue[] | { error: string }> => {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM promo_code pc JOIN event_code ec ON pc.ID_code = ec.ID_code WHERE ec.ID_event = ?",
            [eventId]
        );

        const promoCodes = rows as RowDataPacket[];

        return promoCodes.map((data) => {
            const {
                ID_code,
                code_name,
                discount_amount,
                expiry_date,
                quantity,
            } = data;
            return {
                id: ID_code.toString(),
                code: code_name,
                discount: discount_amount,
                expiryDate: expiry_date,
                quantity,
            };
        });
    } catch (error) {
        console.error("Promo code retrieval error:", error);
        return {
            error: "An error occurred during promo code retrieval",
        };
    }
};

export const editPromoCode = async (codeId: string, data: PromoCodeView) => {
    const { code, discount, quantity, expiryDate } = data;

    try {
        await pool.execute(
            "UPDATE promo_code SET code_name = ?, discount_amount = ?, expiry_date = ?, quantity = ? WHERE ID_code = ?",
            [code, discount, expiryDate, quantity, codeId]
        );
    } catch (error) {
        console.error("Promo code edit error:", error);
        return {
            error: "An error occurred during promo code edit",
        };
    }
};

export const deletePromoCodeEvent = async (
    promoCodeId: string
): Promise<{ success: boolean }> => {
    try {
        await pool.execute("DELETE FROM event_code WHERE ID_code = ?", [
            promoCodeId,
        ]);

        await pool.execute("DELETE FROM promo_code WHERE ID_code = ?", [
            promoCodeId,
        ]);
        console.log("gud");
        return { success: true };
    } catch (error) {
        console.error("Promo code deletion error:", error);
        return { success: false };
    }
};
