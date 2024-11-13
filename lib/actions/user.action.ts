"use server";
import { RegistrationData, UserData } from "@/types";
import pool from "../mysql";
import { RowDataPacket } from "mysql2";

// do get/post request to get user data from DB here

// With event
export const registerEvent = async (
    data: RegistrationData,
    userId: string
) => {};

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
