"use client";
import React, { useEffect, useState } from "react";
import EventCard from "@/components/card/EventCard";
import NoResult from "@/components/NoResult";
import { Button } from "@/components/ui/button";
import { EventView } from "@/types";
const Page = () => {
    const userId = "1";
    const [eventView, setEventView] = useState("upcoming");
    // events array to store events according to the state (upcoming or past) to display later
    const [events, setEvents] = useState<EventView[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<EventView[]>([]);
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
                byUser: {
                    id: "1",
                    name: "User 1",
                    avatar: "/assets/avatar.png",
                },
            },
            {
                id: "2",
                title: "Event 2",
                logo: "/assets/eventLogo.png",
                start: new Date("2024-09-02T10:00:00"),
                end: new Date("2024-09-02T12:00:00"),
                location: "Da Nang City",
                attendees: 200,
                byUser: {
                    id: "2",
                    name: "User 2",
                    avatar: "/assets/avatar.png",
                },
            },
            {
                id: "3",
                title: "Event 3",
                logo: "/assets/eventLogo.png",
                start: new Date("2024-09-03T10:00:00"),
                end: new Date("2024-09-03T12:00:00"),
                location: "Ha Noi City",
                attendees: 300,
                byUser: {
                    id: "3",
                    name: "User 3",
                    avatar: "/assets/avatar.png",
                },
            },
            {
                id: "4",
                title: "Event 4",
                logo: "/assets/eventLogo.png",
                start: new Date("2025-11-01T10:00:00"),
                end: new Date("2025-11-03T12:00:00"),
                location: "Da Lat City",
                attendees: 400,
                byUser: {
                    id: "1",
                    name: "User 1",
                    avatar: "/assets/avatar.png",
                },
            },
            {
                id: "5",
                title: "Event 5",
                logo: "/assets/eventLogo.png",
                start: new Date("2024-09-03T10:00:00"),
                end: new Date("2024-09-03T12:00:00"),
                location: "Ha Noi City",
                attendees: 300,
                byUser: {
                    id: "1",
                    name: "User 1",
                    avatar: "/assets/avatar.png",
                },
            },
            {
                id: "6",
                title: "Event 6",
                logo: "/assets/eventLogo.png",
                start: new Date("2024-12-03T10:00:00"),
                end: new Date("2024-12-03T12:00:00"),
                location: "Ha Noi City",
                attendees: 300,
                byUser: {
                    id: "2",
                    name: "User 2",
                    avatar: "/assets/avatar.png",
                },
            },
            {
                id: "7",
                title: "Event 7",
                logo: "/assets/eventLogo.png",
                start: new Date("2024-09-03T10:00:00"),
                end: new Date("2024-09-03T12:00:00"),
                location: "Ha Noi City",
                attendees: 300,
                byUser: {
                    id: "5",
                    name: "User 5",
                    avatar: "/assets/avatar.png",
                },
            },
        ];
        setEvents(mockEvents);
    }, []);

    useEffect(() => {
        // fetch events from the server and set the events array everytime eventView changes
        const now = new Date();
        const filtered = events.filter((event) => {
            return eventView === "upcoming"
                ? event.start > now
                : event.end < now;
        });
        filtered.sort((a, b) =>
            eventView === "upcoming"
                ? a.start.getTime() - b.start.getTime()
                : b.start.getTime() - a.start.getTime()
        );
        setFilteredEvents(filtered);
    }, [eventView, events]);

    return (
        <div className="w-[900px] flex flex-col justify-start items-center gap-10">
            <div className="flex justify-between items-center w-full border-b-[1px] border-b-slate-900 py-6">
                <h1 className="text-2xl font-bold">Events</h1>
                <div className="flex w-fit bg-slate-900 bg-opacity-20 rounded-md">
                    <Button
                        autoFocus
                        variant="ghost"
                        className={`font-bold focus:hover:bg-slate-50 hover:bg-transparent ${
                            eventView === "upcoming" ? "bg-slate-50" : ""
                        }  `}
                        onFocus={() => setEventView("upcoming")}
                        onClick={() => setEventView("upcoming")}
                        onBlur={(e) => e.preventDefault()}>
                        Upcoming
                    </Button>
                    <Button
                        variant="ghost"
                        className={`font-bold focus:hover:bg-slate-50 hover:bg-transparent ${
                            eventView === "past" ? "bg-slate-50" : ""
                        }  `}
                        onFocus={() => setEventView("past")}
                        onClick={() => setEventView("past")}
                        onBlur={(e) => e.preventDefault()}>
                        Past
                    </Button>
                </div>
            </div>
            <div className="flex flex-col justify-start gap-5 h-fit w-full">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center gap-20">
                            <p className="whitespace-nowrap font-bold">
                                {event.start.toLocaleDateString()}
                            </p>
                            <EventCard {...event} currentUserId={userId} />
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

export default Page;
