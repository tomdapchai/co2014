"use client";
import React, { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import EventSummary from "../card/EventSummary";
import EditEventForm from "../form/EditEventForm";
import { useEventContext } from "@/context/EventContext";
import { EventData } from "@/types";

const Overview = () => {
    const { eventData, updateEventData, isLoading } = useEventContext();
    const [isEditing, setIsEditing] = useState(false);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!eventData) {
        return <div>No event data found</div>;
    }

    const handleUpdateEvent = async (updatedData: EventData) => {
        try {
            console.log(updatedData);
            await updateEventData(updatedData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update event:", error);
        }
    };

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
