"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
    const notifications: string[] = [];
    const [currentTime, setCurrentTime] = useState("");
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZoneName: "shortOffset",
            }).format(now);

            setCurrentTime(`${timeString}`);
        };

        const interval = setInterval(updateTime, 60000);
        updateTime();
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <header className="flex justify-between items-center py-5 px-5 w-full">
            <Link href="/">
                <h1 className="text-3xl font-bold">LAMBO</h1>
            </Link>
            <div className="flex justify-between items-center w-1/2">
                <div className="flex gap-2 justify-between">
                    <Link href={"/dashboard"}>
                        <Button variant="ghost" className="">
                            Events
                        </Button>
                    </Link>
                    <Link href={"/discover"}>
                        <Button variant="ghost" className="">
                            Discover
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex justify-between items-center h-fit w-[400px] mr-10">
                <p>{currentTime}</p>
                <Link href="/create">Create event</Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full">
                            Noti
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Notification</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <DropdownMenuItem key={index}>
                                    {notification}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem>No notification</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Log out</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Header;
