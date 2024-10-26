"use client";
import EventCard from "@/components/card/EventCard";
import NoResult from "@/components/NoResult";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const page = () => {
    const [eventView, setEventView] = useState("upcoming");
    // events array to store events according to the state (upcoming or past) to display later
    const [events, setEvents] = useState<EventView[]>([]);

    useEffect(() => {
        console.log(eventView);
        // fetch events from the server and set the events array everytime eventView changes
    }, [eventView]);

    interface EventView {
        id: string;
        title: string;
        logo: string;
        start: Date;
        end: Date;
        location: string;
        attendees: number;
    }

    // mock events data
    useEffect(() => {
        const mockEvents: EventView[] = [
            {
                id: "1",
                title: "Event 1",
                logo: "/assets/eventLogo.png",
                start: new Date("2024-09-01T10:00:00"),
                end: new Date("2024-09-01T12:00:00"),
                location: "Ho Chi Minh City",
                attendees: 100,
            },
            {
                id: "2",
                title: "Event 2",
                logo: "/assets/eventLogo.png",
                start: new Date("2024-09-02T10:00:00"),
                end: new Date("2024-09-02T12:00:00"),
                location: "Da Nang City",
                attendees: 200,
            },
            {
                id: "3",
                title: "Event 3",
                logo: "/assets/eventLogo.png",
                start: new Date("2024-09-03T10:00:00"),
                end: new Date("2024-09-03T12:00:00"),
                location: "Ha Noi City",
                attendees: 300,
            },
        ];
        setEvents(mockEvents);
    }, []);
    return (
        <div className="w-[900px] flex flex-col justify-start items-center gap-10">
            <div className="flex justify-between items-center w-full border-b-2 border-b-slate-500 py-6">
                <h1 className="text-2xl font-bold">Events</h1>
                <div className="flex w-fit bg-slate-900 bg-opacity-20 rounded-md">
                    <Button
                        autoFocus
                        variant="ghost"
                        className="font-bold focus:bg-slate-900 focus:bg-opacity-30"
                        onFocus={() => setEventView("upcoming")}>
                        Upcoming
                    </Button>
                    <Button
                        variant="ghost"
                        className="font-bold focus:bg-slate-900 focus:bg-opacity-30"
                        onFocus={() => setEventView("past")}>
                        Past
                    </Button>
                </div>
            </div>
            <div className="flex flex-col justify-start gap-5 h-fit w-full">
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center gap-20">
                            <p className="whitespace-nowrap font-bold">
                                {event.start.toLocaleDateString()}
                            </p>
                            <EventCard {...event} view={eventView} />
                        </div>
                    ))
                ) : (
                    <NoResult
                        title="No events found"
                        description="Create an event to get started"
                        link="/create"
                        linkTitle="Create event"
                    />
                )}
            </div>
        </div>
    );
};

export default page;
