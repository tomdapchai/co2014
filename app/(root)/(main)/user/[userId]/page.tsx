"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const page = ({ params }: { params: { userId: string } }) => {
    const userId = params.userId;
    const { userId: currentUserId } = useAuth();
    const [isSelf, setIsSelf] = useState(false);
    useEffect(() => {
        if (userId === currentUserId) {
            setIsSelf(true);
        }
    }, []);

    return <div>page</div>;
};

export default page;
