// @ts-nocheck
"use server";
import pool from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { EventData, EventView, Registration, TicketSoldView } from "@/types";
import { getRegistrationData } from "./register.action";
import { getUserData } from "./user.action";
import { title } from "process";

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

    const ticketData = tickets
        .map(
            (ticket) =>
                `${ticket.ticketName}|${ticket.ticketPrice}|${
                    ticket.ticketQuantity
                }|${ticket.ticketDescription || ""}`
        )
        .join(";");
    try {
        await pool.execute(
            "CALL InsertEvent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @event_id)",
            [
                name,
                start,
                end,
                maxTicketsPerUser,
                location,
                description,
                guideline,
                logo,
                type,
                capacity,
                ticketType,
                byUser,
                2,
                ticketData,
            ]
        );
        const eventIdQuery = "SELECT @event_id AS event_id";
        const [eventResult] = await pool.execute(eventIdQuery);

        return {
            success: true,
            eventId: (eventResult as RowDataPacket)[0].event_id,
        };
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

    const [eventTicket] = await pool.execute(
        "SELECT * FROM ticket_type WHERE ID_event = ?",
        [eventId]
    );

    const [eventRegistration] = await pool.execute(
        "SELECT * FROM ticket_registered WHERE ID_event = ?",
        [eventId]
    );

    const registrationPromises = (eventRegistration as RowDataPacket).map(
        async ({ ID_ticket, type }: any) => {
            const regType = type;
            const cost = (eventTicket as RowDataPacket).find(
                ({ type }: any) => type.toUpperCase() === regType.toUpperCase()
            ).cost;

            const res = await getRegistrationData(ID_ticket, cost);
            const { ID_user, hasCheckedIn, approval_status } = (
                res as RowDataPacket
            )[0];

            return {
                ticketId: ID_ticket,
                type: regType,
                status: approval_status,
                hasCheckedIn: hasCheckedIn,
                eventId: eventId,
                userId: ID_user,
            };
        }
    );

    // Wait for all registration data to be collected
    const registrationData = await Promise.all(registrationPromises);

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
        isPaid,
        ...restEvent
    } = (event as RowDataPacket)[0];

    var tzoffset = new Date().getTimezoneOffset() * 60000; // timezone offset in milliseconds

    const eventData = {
        ...restEvent,
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
        registrations: registrationData,
        maxTicketsPerUser: max_ticket_per_register,
        description: description ? description : "",
        guideline: guideline ? guideline : "",
        adId: ID_ad ? ID_ad.toString() : "",
        ticketType: isPaid == "paid" ? "paid" : "free",
    };

    return eventData;
}

export const updateEvent = async (
    eventId: string,
    data: EventData
): Promise<{ success: boolean }> => {
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
    const ticketData = tickets
        .map(
            (ticket) =>
                `${ticket.ticketName}|${ticket.ticketPrice}|${
                    ticket.ticketQuantity
                }|${ticket.ticketDescription || ""}`
        )
        .join(";");
    try {
        await pool.execute(
            "CALL UpdateEvent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                Number(eventId),
                name,
                start,
                end,
                maxTicketsPerUser,
                location,
                description,
                guideline,
                logo,
                type,
                capacity,
                ticketType,
                byUser,
                2,
                ticketData,
            ]
        );

        return { success: true };
    } catch (error) {
        console.error("Error updating event:", error);
        return { success: false };
    }
};

export const deleteEventById = async (
    eventId: string
): Promise<{ success: boolean }> => {
    try {
        await pool.execute("CALL DeleteEvent(?)", [Number(eventId)]);
        return { success: true };
    } catch (error) {
        console.error("Error deleting event:", error);
        return { success: false };
    }
};

export const getAllEvents = async (): Promise<
    EventView[] | { error: string }
> => {
    const [events] = await pool.execute("SELECT * FROM event");
    if ((events as RowDataPacket).length === 0) {
        return { error: "No events found" };
    }

    // Use `map` to handle asynchronous transformations
    const eventsWithDetails = await Promise.all(
        (events as RowDataPacket).map(async (event: any) => {
            const { ID_event, ID_organizer } = event;

            // Fetch event data
            const eventData = await getEventData(ID_event);
            const { registrations } = eventData;
            event.attendees = registrations ? registrations.length : 0;

            // Fetch organizer data
            const userData = await getUserData(ID_organizer);

            const {
                username = "Unknown",
                name: userName = "Unknown Organizer",
                avatar = "",
            } = "error" in userData ? {} : userData;

            return {
                id: event.ID_event,
                title: event.name,
                logo: event.event_logo,
                start: new Date(event.start_date_time)
                    .toISOString()
                    .slice(0, 16),
                end: new Date(event.end_date_time).toISOString().slice(0, 16),
                location: event.location,
                attendees: event.attendees,
                byUser: {
                    id: ID_organizer,
                    name: userName || username,
                    avatar,
                },
            };
        })
    );

    return eventsWithDetails as EventView[];
};

export const getEventAttendees = async (
    eventId: string
): Promise<Registration[] | { error: string }> => {
    const eventData = await getEventData(eventId);

    const { registrations } = eventData;

    if (!registrations) {
        return { error: "No registrations found" };
    }

    /* const newRegistrations = registrations.map((registration) => {}) */

    return registrations;
};

export const getEventRevenue = async (
    eventId: string
): Promise<TicketSoldView[] | { error: string }> => {
    try {
        const [res] = await pool.execute("CALL GetEventTicketTypeRevenue(?)", [
            eventId,
        ]);

        console.log("res rev", res);

        const result = (res as RowDataPacket[])[0].map((row) => {
            return {
                ticketType: row.ticket_type,
                ticketPrice: row.ticket_price,
                ticketQuantity: row.total_ticket_quantity,
                ticketSold: row.tickets_sold,
                totalRevenue: row.total_revenue,
            };
        });
        console.log("Event revenue:", result);
        return result;
    } catch (error) {
        console.error("Error getting event revenue:", error);
    }
};
