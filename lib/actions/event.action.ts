"use server";
import pool from "../mysql";
import { EventData } from "@/types";

// do get/post request to get event data from DB here
const getEventData = async (eventId: string) => {
    /*
    const [rows] = await pool.execute(
                'SELECT * FROM events WHERE id = ?',
                [eventId]
            );
            
            const eventData = rows[0];
    */
};

// update event data in DB (post, put, delete)
const updateEventData = async (
    eventId: string,
    data: EventData,
    method: string
) => {};
