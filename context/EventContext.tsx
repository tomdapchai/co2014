"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { EventData } from "@/types";

interface EventContextType {
    eventData: EventData | null;
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
    const [isLoading, setIsLoading] = useState(true);

    const fetchEventData = async () => {
        setIsLoading(true);
        try {
            /* With real database:
            const db = await mysql.createConnection({
                host: 'localhost',
                user: 'your_username',
                password: 'your_password',
                database: 'your_database'
            });
            
            const [rows] = await db.execute(
                'SELECT * FROM events WHERE id = ?',
                [eventId]
            );
            
            const eventData = rows[0];
            
            // Fetch related tickets
            const [tickets] = await db.execute(
                'SELECT * FROM tickets WHERE event_id = ?',
                [eventId]
            );
            
            eventData.tickets = tickets;
            */

            // Mock data for now
            setEventData({
                name: "test",
                logo: "/assets/eventLogo.png",
                type: "public",
                start: "2025-10-31T17:25",
                end: "2025-10-31T17:55",
                description: "description",
                location: "location",
                guideline: "guideline",
                capacity: 20,
                ticketType: "paid",
                tickets: [
                    {
                        ticketName: "Free",
                        ticketPrice: 0,
                        ticketDescription: "Free tickets for everyone",
                        ticketAmount: 10,
                    },
                    {
                        ticketName: "VIP",
                        ticketPrice: 10000,
                        ticketDescription: "Vip ticket for riches",
                        ticketAmount: 9,
                    },
                ],
                maxTicketsPerUser: 10,
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
                     ticket.ticketDescription, ticket.ticketAmount]
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
            value={{ eventData, updateEventData, isLoading }}>
            {children}
        </EventContext.Provider>
    );
};
