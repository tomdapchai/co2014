"use client";
import React, { useState, useEffect } from "react";
import { getAllEvents } from "@/lib/actions/event.action";
import { EventView } from "@/types";
import EventCard from "@/components/card/EventCard";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import NoResult from "@/components/NoResult";
import Link from "next/link";
import { set } from "date-fns";
const page = () => {
    const { userId } = useAuth();

    const [eventView, setEventView] = useState("upcoming");
    // events array to store events according to the state (upcoming or past) to display later
    const [events, setEvents] = useState<EventView[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<EventView[]>([]);
    console.log("UserId: ", userId);
    useEffect(() => {
        getAllEvents().then((data) => {
            if ("error" in data) {
                console.log(data.error);
            } else {
                console.log("Events: ", data);
                setEvents(data);
            }
        });
    }, []);

    useEffect(() => {
        // fetch events from the server and set the events array everytime eventView changes
        const now = new Date();
        const filtered = events.filter((event) => {
            return eventView === "upcoming"
                ? new Date(event.start) > now
                : new Date(event.end) < now;
        });
        filtered.sort((a, b) =>
            eventView === "upcoming"
                ? new Date(a.start).getTime() - new Date(b.start).getTime()
                : new Date(b.start).getTime() - new Date(a.start).getTime()
        );
        setFilteredEvents(filtered);
    }, [eventView, events]);

    return (
        <div className="w-[900px] flex flex-col justify-start items-center gap-10 pb-6">
            <div className="flex justify-between items-center w-full border-b-[1px] border-b-slate-900 py-6">
                <h1 className="text-2xl font-bold">Discover All Events</h1>
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
                                {new Date(event.start).toLocaleDateString()}
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

export default page;
