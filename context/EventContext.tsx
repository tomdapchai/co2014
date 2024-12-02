"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { EventData, PromoCodeView, PromoCodeTrue } from "@/types";
import { useAuth } from "./AuthContext";
import {
    deleteEventById,
    getEventAttendees,
    getEventData,
    updateEvent,
} from "@/lib/actions/event.action";
import { Registration } from "@/types";
import { getRegistrationData } from "@/lib/actions/register.action";
import {
    createPromoCodeEvent,
    deletePromoCodeEvent,
    getPromoCodeEvent,
} from "@/lib/actions/promocode.action";
import { TicketSoldView } from "@/types";
import { getEventRevenue } from "@/lib/actions/event.action";
interface EventContextType {
    eventId: string;
    eventData: EventData | null;
    registrationData: Registration[] | null;
    updateEventData: (data: EventData) => Promise<void>;
    deleteEvent: () => Promise<void>;
    createPromoCodes: (promoCodes: PromoCodeView[]) => Promise<void>;
    deletePromoCodes: (codeId: string) => Promise<void>;
    promoCodes: PromoCodeTrue[] | null;
    revenueData: TicketSoldView[];
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
    const [promoCodes, setPromoCodes] = useState<PromoCodeTrue[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [revenueData, setRevenueData] = useState<TicketSoldView[]>([]);
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
            await updateEvent(eventId, updatedData);
            setEventData(updatedData);
        } catch (error) {
            console.error("Failed to update event:", error);
            throw error;
        }
    };

    const deleteEvent = async () => {
        try {
            await deleteEventById(eventId);
        } catch (error) {}
    };

    const createPromoCodes = async (promoCodes: PromoCodeView[]) => {
        try {
            promoCodes.map(async (promoCode) => {
                await createPromoCodeEvent(eventId, promoCode);
            });
        } catch (error) {}
    };

    const viewPromoCodes = async () => {
        try {
            await getPromoCodeEvent(eventId).then((data) => {
                if ("error" in data) {
                    console.log(data.error);
                } else {
                    setPromoCodes(data);
                }
            });
        } catch (error) {}
    };

    const deletePromoCodes = async (codeId: string) => {
        try {
            await deletePromoCodeEvent(codeId);
        } catch (error) {}
    };

    const fetchRevenueData = async () => {
        try {
            await getEventRevenue(eventId).then((data) => {
                if ("error" in data) {
                    console.log(data.error);
                } else {
                    setRevenueData(data);
                }
            });
        } catch (error) {}
    };

    useEffect(() => {
        fetchEventData();
        viewPromoCodes();
        fetchRevenueData();
    }, [eventId]);

    return (
        <EventContext.Provider
            value={{
                eventId,
                eventData,
                registrationData,
                updateEventData,
                deleteEvent,
                createPromoCodes,
                deletePromoCodes,
                promoCodes,
                revenueData,
                isLoading,
            }}>
            {children}
        </EventContext.Provider>
    );
};
