"use server";
import { revalidatePath } from "next/cache";
import pool from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PromoCodeTrue, Transaction } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { PromoCodeView, RegistrationData } from "@/types";
interface RegistrationResponse {
    ticketIds?: string[];
    message: string;
}

export const registerEvent = async (
    data: RegistrationData,
    path: string,
    promoCode?: PromoCodeTrue[],
    organizerId?: string
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

    if (ticketType === "paid") {
        // count total registered, if exceed maxTicketPerUser, return error
        const getTotalPaidRegistered = async () => {
            const paidRegisteredPromises = eventTickets.map(async (ticket) => {
                try {
                    const result = await getPaidEventRegistration(
                        userId,
                        eventId,
                        ticket.ticketName
                    );
                    return typeof result === "number" ? result : 0; // Ensure only valid numbers are added
                } catch (error) {
                    console.error(
                        `Error fetching registration for ticket ${ticket.ticketName}:`,
                        error
                    );
                    return 0; // Default to 0 on error
                }
            });

            const resolvedValues = await Promise.all(paidRegisteredPromises);
            return resolvedValues.reduce((acc, value) => acc + value, 0);
        };

        const totalRegistered = await getTotalPaidRegistered();
        console.log(totalRegistered, maxTicketPerUser);

        const currentRegister = multiType.reduce((acc, ticket) => {
            return acc + ticket.quantity;
        }, 0);

        if (totalRegistered + currentRegister > maxTicketPerUser) {
            return { error: "User has reached maximum ticket registration" };
        }

        // for each eventTicket, run for loop to register
        let totalCost = multiType.reduce((acc, ticket) => {
            return acc + ticket.quantity * ticket.price;
        }, 0);

        // create transaction
        const content = multiType.map((ticket) => {
            return {
                ticketName: ticket.name,
                quantity: ticket.quantity,
                price: ticket.price,
            };
        });

        await pool.execute("INSERT IGNORE INTO customer (ID_user) VALUE (?) ", [
            userId,
        ]);
        const [transaction] = await pool.execute<ResultSetHeader>(
            "INSERT INTO transaction (content, method, status) VALUE (?, ?, ?)",
            [JSON.stringify(content), "credit", "pending"]
        );

        const transactionId = transaction.insertId;

        const [transForTicket] = await pool.execute(
            "INSERT INTO trans_for_ticket (ID_transaction, ID_receiver, ID_sender) VALUE (?, ?, ?)",
            [transactionId, organizerId, userId]
        );

        console.log("content: ", content, "totalCost: ", totalCost);

        if (promoCode && promoCode.length > 0) {
            // iterate all promoCode, add up the discount then recalculate totalCost
            promoCode.forEach((code) => {
                totalCost -= (code.discount / 100) * totalCost;
            });

            if (totalCost < 0) {
                totalCost = 0;
            }

            const wait = promoCode.map(async (code) => {
                await pool.execute(
                    "INSERT INTO apply_promocode (ID_transaction, ID_code) VALUE (?, ?)",
                    [transactionId, code.id]
                );

                await pool.execute(
                    "UPDATE promo_code SET quantity = quantity - 1 WHERE ID_code = ?",
                    [code.id]
                );
            });

            await Promise.all(wait);
            console.log("Promo", promoCode);
        }

        console.log("Total cost after promo: ", totalCost);

        // lastly, update amount in transaction
        await pool.execute(
            "UPDATE transaction SET amount = ? WHERE ID_transaction = ?",
            [totalCost, transactionId]
        );

        // now we can register the ticket
        const waitRegister = multiType.map(async (ticket) => {
            for (let i = 0; i < ticket.quantity; i++) {
                let ticketId = uuidv4();
                await pool.execute(
                    "INSERT INTO ticket_registered (ID_ticket, hasCheckedIn, ID_event, type) VALUE (?, ?, ?, ?)",
                    [ticketId, false, eventId, ticket.name]
                );

                if (ticket.price > 0) {
                    await pool.execute(
                        "INSERT INTO paid_ticket (ID_ticket, ID_transaction) VALUE (?, ?)",
                        [ticketId, transactionId]
                    );
                }

                if (ticket.price == 0) {
                    await pool.execute(
                        "INSERT INTO free_ticket (ID_ticket, approval_status, ID_user) VALUE (?, ?, ?)",
                        [ticketId, "pending", userId]
                    );
                }
            }
        });

        await Promise.all(waitRegister);
    }
    return { message: "Registration successful" };
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

export async function updateStatusRegistration(
    ticketId: string,
    status: string
) {
    try {
        console.log("ticketId & status", ticketId, status);
        const [ticket] = await pool.execute(
            "SELECT * FROM ticket_registered WHERE ID_ticket = ?",
            [ticketId]
        );

        const [ticketType] = await pool.execute(
            "SELECT * FROM ticket_type WHERE ID_event = ?",
            [(ticket as RowDataPacket)[0].ID_event]
        );

        const { cost } = (ticketType as RowDataPacket)[0];
        if ((ticket as RowDataPacket).length === 0) {
            return { error: "Ticket not found" };
        }
        if (cost == 0) {
            await pool.execute(
                "UPDATE free_ticket SET approval_status = ? WHERE ID_ticket = ?",
                [status, ticketId]
            );
        }
    } catch (error) {
        console.error("Error updating registration status:", error);
    }
}

export const getPaidEventRegistration = async (
    userId: string,
    eventId: string,
    name: string
): Promise<number | { error: string }> => {
    try {
        const [res] = await pool.execute(
            "SELECT total_ticket_registered(?, ?, ?) as total",
            [userId, eventId, name]
        );

        const result = (res as RowDataPacket)[0].total;
        return result;
    } catch (error) {
        console.error("Error getting paid event registration:", error);
        return { error: "Error getting paid event registration" };
    }
};
