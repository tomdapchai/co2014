"use client";
import React from "react";
import { useEventContext } from "@/context/EventContext";
import RegistrationTable from "../card/RegistrationTable";
const Registrations = () => {
    const { eventData, registrationData, updateEventData, isLoading } =
        useEventContext();
    return (
        <div className="w-full flex flex-col justify-center items-start">
            {registrationData && (
                <RegistrationTable
                    registrations={registrationData}
                    type="full"></RegistrationTable>
            )}
        </div>
    );
};

export default Registrations;
