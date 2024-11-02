"use client";
import React from "react";

import { registerEvent, cancelRegistration } from "@/lib/actions/user.action";
// There will be following actions from user: registerEvent, cancelRegistration used here

const page = ({ params }: { params: { eventId: string } }) => {
    const eventId = params.eventId;
    return <div>page</div>;
};

export default page;
