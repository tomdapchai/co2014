import React from "react";
import { EventProvider } from "@/context/EventContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "@/components/tab/Overview";
import Registrations from "@/components/tab/Registrations";
import Insights from "@/components/tab/Insights";

const page = ({ params }: { params: { eventId: string } }) => {
    // store eventId from params
    const eventId = params.eventId;
    // check if there is event with eventId available, if not, return 404 page

    return (
        <EventProvider eventId={params.eventId}>
            <Tabs
                defaultValue="overview"
                className="w-full flex flex-col justify-center items-center">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="registrations">
                        Registrations
                    </TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <Overview />
                </TabsContent>
                <TabsContent value="registrations">
                    <Registrations />
                </TabsContent>
                <TabsContent value="insights">
                    <Insights />
                </TabsContent>
            </Tabs>
        </EventProvider>
    );
};

export default page;
