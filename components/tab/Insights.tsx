"use client";
import { TicketSoldView } from "@/types";
import { getEventRevenue } from "@/lib/actions/event.action";
import { useEventContext } from "@/context/EventContext";
import { TicketRevenueTable } from "../card/TicketRevenueTable";
const Insights = () => {
    const { revenueData } = useEventContext();
    console.log("Revenue Data: ", revenueData);
    return (
        <div className="container mx-auto py-10">
            <TicketRevenueTable initialData={revenueData} />
        </div>
    );
};

export default Insights;
