// pages/Overview.tsx
import React, { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import EventSummary from "../card/EventSummary";
import EditEventForm from "../form/EditEventForm";

interface Props {
    eventId: string;
}

export interface TicketDetail {
    ticketName: string;
    ticketPrice: number;
    ticketDescription?: string;
    ticketAmount: number;
}

export interface EventData {
    name: string;
    logo: string;
    type: "public" | "private";
    start: string;
    end: string;
    description?: string;
    location: string;
    guideline?: string;
    capacity: string | number;
    ticketType: "free" | "paid";
    tickets?: TicketDetail[];
    maxTicketsPerUser: number;
}

const Overview = ({ eventId }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [eventData, setEventData] = useState<EventData>({
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

    const fetchEvent = async () => {
        /* try {
            const res = await fetch(`/api/events/${eventId}`);
            const data = await res.json();
            setEventData(data);
        } catch (error) {
            console.error("Failed to fetch event:", error);
        } */
    };

    const handleUpdateEvent = async (updatedData: EventData) => {
        try {
            // This is for updating data to server, just mock code
            /* await fetch(`/api/events/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            fetchEvent(); */
            console.log(updatedData);
            setEventData(updatedData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update event:", error);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    return (
        <div className="w-full flex flex-col justify-center items-start">
            <EventSummary
                eventData={eventData}
                onEdit={() => setIsEditing(true)}
            />
            <Sheet open={isEditing} onOpenChange={setIsEditing}>
                <SheetContent className="overflow-y-scroll no-scrollbar">
                    <SheetHeader>
                        <SheetTitle>Edit Event</SheetTitle>
                    </SheetHeader>

                    <EditEventForm
                        eventData={eventData}
                        onSubmit={handleUpdateEvent}
                    />
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Overview;
