"use server";
import pool from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { EventData } from "@/types";

type createEventMessage = {
    success: boolean;
    eventId?: string;
};

export async function createEvent(
    data: EventData
): Promise<createEventMessage> {
    const {
        name,
        type,
        logo,
        start,
        end,
        location,
        guideline,
        description,
        capacity,
        ticketType,
        maxTicketsPerUser,
        byUser,
        tickets,
    } = data;

    const queryEvent =
        "INSERT INTO event (name, type, event_logo, start_date_time, end_date_time, location, guideline, description, capacity, ticketType, max_ticket_per_register) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const queryTicket = `INSERT INTO ticket_type (ID_event,type,cost,quantity,description) VALUES (?, ?, ?, ?, ?)`;

    try {
        // Convert capacity to number if it's "unlimited" or a string number

        const organizerId = parseInt(byUser);

        if (isNaN(organizerId)) {
            throw new Error("Invalid organizer ID");
        }

        // Use parameterized values to prevent SQL injection and handle string escaping
        const [result] = await pool.execute(queryEvent, [
            name,
            type,
            logo,
            start,
            end,
            location,
            guideline || null,
            description || null,
            capacity,
            ticketType,
            maxTicketsPerUser,
        ]);

        const eventId = (result as ResultSetHeader).insertId;

        await pool.execute(
            "INSERT IGNORE INTO organizer (ID_user) VALUES (?)",
            [organizerId]
        );

        await pool.execute(
            "UPDATE event SET ID_organizer = ? WHERE ID_event = ?",
            [organizerId, eventId]
        );

        // Insert tickets if they exist
        if (tickets && tickets.length > 0) {
            await Promise.all(
                tickets.map((ticket) =>
                    pool.execute(queryTicket, [
                        eventId,
                        ticket.ticketName,
                        ticket.ticketPrice,
                        ticket.ticketQuantity,
                        ticket.ticketDescription || null, // Handle optional field
                    ])
                )
            );
        }

        return { success: true, eventId: eventId.toString() };
    } catch (error) {
        console.error("Error creating event:", error);
        return { success: false };
    }
}

// do get/post request to get event data from DB here
export async function getEventData(
    eventId: string
): Promise<EventData | { error: string }> {
    const [event] = await pool.execute(
        "SELECT * FROM event WHERE ID_event = ?",
        [eventId]
    );

    if ((event as RowDataPacket).length === 0) {
        return { error: "Event not found" };
    }

    const {
        start_date_time,
        end_date_time,
        ID_organizer,
        event_logo,
        max_ticket_per_register,
        ID_event,
        description,
        guideline,
        ID_ad,
        type,
        ...restEvent
    } = (event as RowDataPacket)[0];

    /* if (type === "private") {
        return { error: "Event is privated" };
    } */

    const [eventTicket] = await pool.execute(
        "SELECT * FROM ticket_type WHERE ID_event = ?",
        [eventId]
    );

    const [eventRegistration] = await pool.execute(
        "SELECT * FROM ticket_registered WHERE ID_event = ?",
        [eventId]
    );

    var tzoffset = new Date().getTimezoneOffset() * 60000; // timezone offset in milliseconds

    const eventData = {
        ...restEvent,
        type: type,
        logo: event_logo,
        start: new Date(start_date_time - tzoffset).toISOString().slice(0, 16),
        end: new Date(end_date_time - tzoffset).toISOString().slice(0, 16),
        byUser: ID_organizer.toString(),
        tickets: (eventTicket as RowDataPacket).map(
            ({ type, cost, quantity, description }: any) => ({
                ticketName: type,
                ticketPrice: cost,
                ticketQuantity: quantity,
                ticketDescription: description,
            })
        ),
        registrations: eventRegistration,
        maxTicketsPerUser: max_ticket_per_register,
        description: description ? description : "",
        guideline: guideline ? guideline : "",
        adId: ID_ad ? ID_ad.toString() : "",
    };

    console.log(eventData);
    return eventData;
}

export const updateEventData = async (eventId: string, data: EventData) => {};

export const deleteEvent = async (eventId: string) => {
    await pool.execute("DELETE FROM event WHERE ID_event = ?", [eventId]);
};
