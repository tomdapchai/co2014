"use server";
import { RegistrationData, UserData } from "@/types";
import pool from "../mysql";
import { RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";

// do get/post request to get user data from DB here

// With event
interface RegistrationResponse {
    ticketId?: string;
    message: string;
}

export const registerEvent = async (
    data: RegistrationData
): Promise<RegistrationResponse> => {
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
        const [freeRegistered] = await pool.execute(
            "SELECT * FROM (((customer c JOIN free_ticket ft) ON c.ID_user = ft.ID_user) cft JOIN ticket_registered tr ON cft.ID_ticket = tr.ID_ticket) cfttr JOIN ticket_type tt ON cfttr.ID_event = tt.ID_event) t JOIN event e ON tt.ID_event = e.ID_event WHERE c.ID_user = ? AND e.ID_event = ?",
            [userId, eventId]
        );

        if ((freeRegistered as RowDataPacket).length >= maxTicketPerUser) {
            return {
                ticketId: undefined,
                message: "User has reached maximum ticket registration",
            };
        }

        // perform register: insert into customer->free_ticket
        await pool.execute("INSERT IGNORE INTO customer (ID_user) VALUE (?)", [
            userId,
        ]);

        const ticketId = uuidv4();

        await pool.execute(
            "INSERT INTO free_ticket (ID_ticket, approval_status, ID_user) VALUE (?, ?, ?)",
            [ticketId, "pending", userId]
        );
    }

    return { message: "wait for implement" };
    // check if user already registered before & count how many registrations by user (to compare with maxTicketsPerUser)
};

export const cancelRegistration = async (eventId: string, userId: string) => {};

export const getRegisteredEvents = async (userId: string) => {};

// with personal
export const getUserData = async (
    userId: string
): Promise<UserData | { error: string }> => {
    const [user] = await pool.execute("SELECT * FROM user WHERE ID_user = ?", [
        userId,
    ]);

    if ((user as RowDataPacket).length === 0) {
        return { error: "User not found" };
    }

    const {
        ID_user,
        date_of_birth,
        city,
        province,
        country,
        password,
        name,
        email,
        ...rest
    } = (user as RowDataPacket)[0];

    const userData = {
        ...rest,
        dob: date_of_birth ? date_of_birth.toISOString() : "",
        address: {
            city: city || "",
            province: province || "",
            country: country || "",
        },
        name: name || "",
        email: email || "",
    };

    return userData;
};

export const updateUserData = async (userId: string, userData: any) => {};
