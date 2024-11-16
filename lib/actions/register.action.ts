"use server";
import { revalidatePath } from "next/cache";
import pool from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

import { v4 as uuidv4 } from "uuid";
import { RegistrationData } from "@/types";
interface RegistrationResponse {
    ticketIds?: string[];
    message: string;
}

export const registerEvent = async (
    data: RegistrationData,
    path: string
): Promise<RegistrationResponse | { error: string }> => {
    const {
        userId,
        eventId,
        defaultQuantity,
        multiType,
        ticketType,
        eventTickets,
        maxTicketPerUser,
    } = data;

    if (ticketType === "free") {
        const ticketIds = [] as string[];
        try {
            const [freeRegistered] = await pool.execute(
                "SELECT * FROM customer c JOIN free_ticket ft ON c.ID_user = ft.ID_user JOIN ticket_registered tr ON ft.ID_ticket = tr.ID_ticket JOIN ticket_type tt ON tr.ID_event = tt.ID_event JOIN event e ON tt.ID_event = e.ID_event WHERE c.ID_user = ? AND e.ID_event = ?",
                [userId, eventId]
            );

            if (
                (freeRegistered as RowDataPacket).length + defaultQuantity >
                maxTicketPerUser
            ) {
                return {
                    error: "User has reached maximum ticket registration",
                };
            }

            // perform register: insert into customer->free_ticket
            await pool.execute(
                "INSERT IGNORE INTO customer (ID_user) VALUE (?)",
                [userId]
            );

            // do this for each ticket registered

            for (let i = 0; i < defaultQuantity; i++) {
                let ticketId = uuidv4();

                await pool.execute(
                    "INSERT INTO ticket_registered (ID_ticket, hasCheckedIn, ID_event, type) VALUE (?, ?, ?, ?)",
                    [ticketId, false, eventId, "Free"]
                );

                await pool.execute(
                    "INSERT INTO free_ticket (ID_ticket, approval_status, ID_user) VALUE (?, ?, ?)",
                    [ticketId, "pending", userId]
                );

                ticketIds.push(ticketId);
            }
            revalidatePath(path);
        } catch (error) {
            console.error("Error during registration:", error);
            return { error: "An error occurred during registration" };
        }

        return { ticketIds, message: "Registration successful" };
    }

    return { message: "wait for implement" };
    // check if user already registered before & count how many registrations by user (to compare with maxTicketsPerUser)
};

export async function getRegistrationData(ID_ticket: string, cost: number) {
    if (cost === 0) {
        // free ticket
        const [res] = await pool.execute(
            "SELECT * FROM ticket_registered tr JOIN free_ticket ft ON tr.ID_ticket = ft.ID_ticket WHERE tr.ID_ticket = ?",
            [ID_ticket]
        );

        return res as RowDataPacket;
    } else {
        // paid ticket
        const [res] = await pool.execute(
            "SELECT * FROM ticket_registered tr JOIN paid_ticket pt ON tr.ID_ticket = pt.ID_ticket WHERE tr.ID_ticket = ?",
            [ID_ticket]
        );

        return res as RowDataPacket;
    }
}

export async function cancelRegistration(
    ID_ticket: string,
    cost: number,
    path: string
): Promise<{ message: string } | { error: string }> {
    try {
        if (cost === 0) {
            // free ticket
            await pool.execute("DELETE FROM free_ticket WHERE ID_ticket = ?", [
                ID_ticket,
            ]);
        } else {
            // paid ticket
            await pool.execute("DELETE FROM paid_ticket WHERE ID_ticket = ?", [
                ID_ticket,
            ]);
        }

        await pool.execute(
            "DELETE FROM ticket_registered WHERE ID_ticket = ?",
            [ID_ticket]
        );

        revalidatePath(path);
        return { message: "Registration cancelled" };
    } catch (e) {
        return { error: "Error cancelling registration" };
    }
}
