"use server";
import pool from "../mysql";
import { EventData } from "@/types";

type createEventMessage = {
    success: boolean;
    eventId?: string;
};

export async function createEvent(
    data: EventData
): Promise<createEventMessage | undefined> {
    return;
    /* const { name, type, logo, start, end, location, guideline, description, capacity, ticketType, tickets, maxRegisterPerUser } = data;
    const query = `INSERT INTO event (name, type, logo, start, end, location, description) VALUES (${name}, ${date}, ${location}, ${description})`;
    try {
        await pool.query(query);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    } */
}

// do get/post request to get event data from DB here
export async function getEventData(
    eventId: string
): Promise<EventData | undefined> {
    return;
    /*
    const [rows] = await pool.execute(
                'SELECT * FROM events WHERE id = ?',
                [eventId]
            );
            
            const eventData = rows[0];
    */
}

// update event data in DB (post, put, delete)
export const updateEventData = async (
    eventId: string,
    data: EventData,
    method: string
) => {};
