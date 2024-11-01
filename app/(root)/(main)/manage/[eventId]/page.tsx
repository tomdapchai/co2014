"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "@/components/tab/Overview";
import Guests from "@/components/tab/Guests";
import Registrations from "@/components/tab/Registrations";
import Insights from "@/components/tab/Insights";

const page = async ({ params }: any) => {
    // store eventId from params
    const eventId = params.eventId;
    // check if there is event with eventId available, if not, return 404 page

    // event = getEventById(eventId)...
    // i have to figure out how to just fetch whenever there is something changes in data, maybe use useEffect
    const guests = [];
    const registrations = [];

    // will fetch data here not component
    return (
        <Tabs
            defaultValue="overview"
            className="w-full flex flex-col justify-center items-center">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="guests">Guests</TabsTrigger>
                <TabsTrigger value="registrations">Registrations</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <Overview eventId={eventId} />
            </TabsContent>
            <TabsContent value="guests">
                <Guests eventId={eventId} />
            </TabsContent>
            <TabsContent value="registrations">
                <Registrations eventId={eventId} />
            </TabsContent>
            <TabsContent value="insights">
                <Insights eventId={eventId} />
            </TabsContent>
        </Tabs>
    );
};

export default page;
