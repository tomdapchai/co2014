// components/EventSummary.tsx
import { Button } from "@/components/ui/button";
import { EventData } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";

interface EventSummaryProps {
    eventData: EventData;
    onEdit: () => void;
}

const EventSummary = ({ eventData, onEdit }: EventSummaryProps) => {
    const formatDuration = (start: string, end: string) => {
        const currentDate = new Date();
        const startDate = new Date(start);
        const endDate = new Date(end);

        const isSameDay = (date1: Date, date2: Date) =>
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();

        const getDayDescription = (date: Date) => {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            if (isSameDay(date, today)) return "Today";
            if (isSameDay(date, yesterday)) return "Yesterday";
            if (isSameDay(date, tomorrow)) return "Tomorrow";

            // If current year, just return month and day
            if (date.getFullYear() === currentDate.getFullYear()) {
                return date.toLocaleDateString(undefined, {
                    month: "numeric",
                    day: "numeric",
                });
            }

            return date.toLocaleDateString();
        };

        const formatTime = (date: Date) =>
            date
                .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })
                .toLowerCase();

        if (isSameDay(startDate, endDate)) {
            return `${getDayDescription(startDate)}: ${formatTime(
                startDate
            )} - ${formatTime(endDate)}`;
        }

        return `${getDayDescription(startDate)} ${formatTime(
            startDate
        )} - ${getDayDescription(endDate)} ${formatTime(endDate)}`;
    };

    return (
        <Card className="w-[600px] flex space-x-4 justify-start items-center px-2 py-2">
            <Image
                src={eventData.logo}
                alt="event logo"
                width={200}
                height={200}
            />
            <div className="flex flex-col gap-1 justify-center items-start">
                <CardHeader className="font-bold text-3xl">
                    {eventData.name}
                </CardHeader>
                <CardContent>
                    <p>{formatDuration(eventData.start, eventData.end)}</p>
                    <p>Location: {eventData.location}</p>
                    <p>
                        {eventData.ticketType === "free"
                            ? "Free registration"
                            : `${eventData.tickets?.length} ticket types`}{" "}
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={onEdit} className="">
                        Edit Event
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
};

export default EventSummary;
