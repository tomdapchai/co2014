"use client";
import React, { useState } from "react";
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
import { Label } from "../ui/label";
import { Registration } from "@/types";
import RegistrationTable from "../card/RegistrationTable";
import { useRouter } from "next/navigation";
import { PromoCodeManager } from "../card/PromoCodeManager";
const Overview = () => {
    const {
        eventData,
        registrationData,
        updateEventData,
        isLoading,
        deleteEvent,
    } = useEventContext();
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
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

    const handleDeleteEvent = async () => {
        try {
            await deleteEvent().then((res) => {
                router.push("/dashboard");
            });
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-start">
            <EventSummary
                eventData={eventData}
                onEdit={() => setIsEditing(true)}
                onDelete={handleDeleteEvent}
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
            <PromoCodeManager />
            {/* display total number of successful register table (userId) */}
            <Label className="text-2xl font-bold">Registrations</Label>
            {registrationData && (
                <RegistrationTable
                    registrations={registrationData}
                    type="overview"
                />
            )}
            {/* display total number of register table (userId) */}
        </div>
    );
};

export default Overview;
