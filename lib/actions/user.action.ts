"use server";
import { EventData, RegistrationData, UserData } from "@/types";
import pool from "../mysql";
import { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";
import { EventView } from "@/types";
import { getEventData } from "./event.action";
// do get/post request to get user data from DB here

// With event

export const getRegisteredEvents = async (
    userId: string
): Promise<EventView[] | { error: string }> => {
    // For free tickets
    const [freeRegistrations] = await pool.execute(
        "SELECT * FROM free_ticket ft JOIN ticket_registered tr ON ft.ID_ticket = tr.ID_ticket WHERE ID_user = ?",
        [userId]
    );

    const [hostedEvents] = await pool.execute(
        "SELECT * FROM event WHERE ID_organizer = ?",
        [userId]
    );

    const regEventIds: any[] = [];
    (freeRegistrations as RowDataPacket[]).forEach((data) => {
        const { ID_event } = data;
        if (!regEventIds.includes(ID_event)) regEventIds.push(ID_event);
    });

    (hostedEvents as RowDataPacket[]).forEach((data) => {
        const { ID_event } = data;
        if (!regEventIds.includes(ID_event)) regEventIds.push(ID_event);
    });

    console.log("regEventIds", regEventIds);

    const mappedIds = regEventIds.map(async (eventId) => {
        const res = await getEventData(eventId);
        return res;
    });

    const regEventData = await Promise.all(mappedIds);

    const mappedEvents = regEventData.map(async (data, index) => {
        const eventId = regEventIds[index];
        /*  */
        const { name, logo, start, end, location, registrations, byUser } =
            data as EventData;

        const userData = await getUserData(byUser);

        const {
            username = "Unknown",
            name: userName,
            avatar = "",
        } = "error" in userData ? {} : userData;

        return {
            id: eventId,
            title: name,
            logo: logo,
            start: start,
            end: end,
            location: location,
            attendees: registrations ? registrations.length : 0,
            byUser: {
                id: byUser,
                name: userName || username,
                avatar: avatar,
            },
        };
    });

    const regData = await Promise.all(mappedEvents);

    console.log("regData", regData);

    return regData;
};

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
