// components/EventSummary.tsx
import { Button } from "@/components/ui/button";
import { EventData } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";
import { formatDuration } from "@/lib/utils";
interface EventSummaryProps {
    eventData: EventData;
    onEdit: () => void;
    onDelete: () => void;
}

const EventSummary = ({ eventData, onEdit, onDelete }: EventSummaryProps) => {
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
                <CardFooter className="flex justify-between items-center space-x-4">
                    <Button onClick={onEdit} className="">
                        Edit Event
                    </Button>
                    <Button
                        onClick={onDelete}
                        className="bg-red-500 hover:bg-red-500/90">
                        Delete Event
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
};

export default EventSummary;
