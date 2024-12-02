"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { EventData } from "@/types";
import { useAuth } from "./AuthContext";
import { getEventAttendees, getEventData } from "@/lib/actions/event.action";
import { Registration } from "@/types";
import { getRegistrationData } from "@/lib/actions/register.action";
interface EventContextType {
    eventData: EventData | null;
    registrationData: Registration[] | null;
    updateEventData: (data: EventData) => Promise<void>;
    isLoading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error("useEventContext must be used within an EventProvider");
    }
    return context;
};

interface EventProviderProps {
    children: React.ReactNode;
    eventId: string;
}

export const EventProvider = ({ children, eventId }: EventProviderProps) => {
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [registrationData, setRegistrationData] = useState<
        Registration[] | null
    >(null);
    const [isLoading, setIsLoading] = useState(true);
    const { userId } = useAuth();

    const fetchEventData = async () => {
        setIsLoading(true);

        try {
            // Mock data for now
            await getEventData(eventId).then((data) => {
                if ("error" in data) {
                    console.log(data.error);
                } else {
                    setEventData(data);
                }
            });

            await getEventAttendees(eventId).then((data) => {
                if ("error" in data) {
                    console.log(data.error);
                } else {
                    console.log("registrationData", data);
                    setRegistrationData(data);
                }
            });
        } catch (error) {
            console.error("Failed to fetch event:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateEventData = async (updatedData: EventData) => {
        try {
            /* With real database:
            const db = await mysql.createConnection({
                host: 'localhost',
                user: 'your_username',
                password: 'your_password',
                database: 'your_database'
            });
            
            await db.execute(
                `UPDATE events SET 
                    name = ?, type = ?, start = ?, end = ?, 
                    description = ?, location = ?, guideline = ?,
                    capacity = ?, ticket_type = ?, max_tickets_per_user = ?
                WHERE id = ?`,
                [
                    updatedData.name, updatedData.type, updatedData.start,
                    updatedData.end, updatedData.description, updatedData.location,
                    updatedData.guideline, updatedData.capacity, updatedData.ticketType,
                    updatedData.maxTicketsPerUser, eventId
                ]
            );

            // Update tickets
            await db.execute('DELETE FROM tickets WHERE event_id = ?', [eventId]);
            
            for (const ticket of updatedData.tickets || []) {
                await db.execute(
                    `INSERT INTO tickets (event_id, name, price, description, amount) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [eventId, ticket.ticketName, ticket.ticketPrice, 
                     ticket.ticketDescription, ticket.ticketQuantity]
                );
            }
            */

            setEventData(updatedData);
        } catch (error) {
            console.error("Failed to update event:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchEventData();
    }, [eventId]);

    return (
        <EventContext.Provider
            value={{ eventData, registrationData, updateEventData, isLoading }}>
            {children}
        </EventContext.Provider>
    );
};
