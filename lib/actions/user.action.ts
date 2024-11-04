"use server";
import pool from "../mysql";

// do get/post request to get user data from DB here

// With event
export const registerEvent = async (eventId: string, userId: string) => {};

export const cancelRegistration = async (eventId: string, userId: string) => {};

export const getRegisteredEvents = async (userId: string) => {};

// with personal
export const getUserData = async (userId: string) => {};

export const updateUserData = async (userId: string, userData: any) => {};
