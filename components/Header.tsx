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
import { notificationProps } from "@/types";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getNotifications } from "@/lib/actions/notification.action";

const Header = () => {
    const [notifications, setNotifications] = useState<notificationProps[]>([]);
    const [currentTime, setCurrentTime] = useState("");
    const router = useRouter();
    const { isLoggedIn, userId, logout } = useAuth();

    useEffect(() => {
        // fetch notifications from the server
        const mockNotifications: notificationProps[] = [
            {
                id: "1",
                title: "Notification 1",
                description: "Description 1",
                time: new Date("2024-09-01T10:00:00"),
            },
            {
                id: "2",
                title: "Notification 2",
                description: "Description 2",
                time: new Date("2024-09-03T10:00:00"),
            },
        ];
        getNotifications(userId).then((data) => {
            if ("error" in data) {
                console.log(data.error);
            } else {
                console.log("noti", data);
                setNotifications(data);
            }
        });
        /* setNotifications(mockNotifications); */
    }, []);

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

    const handleLogout = async () => {
        await logout()
            .then(() => {
                router.push("/");
                console.log("Logged out");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <header className="flex justify-between items-center py-5 px-5 w-full sticky top-0 left-0 z-50 backdrop-blur-md">
            <Link href={`${isLoggedIn ? "/dashboard" : "/"} `}>
                <h1 className="text-3xl font-bold">LAMBO</h1>
            </Link>
            <div className="flex justify-between items-center w-1/2">
                <div className="flex gap-2 justify-between">
                    <Link href={"/dashboard"}>
                        <Button variant="ghost" className="font-bold">
                            Events
                        </Button>
                    </Link>
                    <Link href={"/discover"}>
                        <Button variant="ghost" className="font-bold">
                            Discover
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex justify-between items-center h-fit gap-4">
                <p className="whitespace-nowrap">{currentTime}</p>
                <Link href="/create" className="whitespace-nowrap">
                    Create event
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full">
                            <Image
                                src="/assets/notiIcon.svg"
                                alt="edit logo"
                                width={24}
                                height={24}
                                className=""
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Notification</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className="flex flex-col gap-1 justify-start items-start">
                                    <p className="font-bold">
                                        {notification.title}{" "}
                                        <span className="text-xs font-thin text-slate-500">
                                            {notification.time.toLocaleDateString(
                                                [],
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                }
                                            )}
                                        </span>
                                    </p>
                                    <p className="text-sm">
                                        {notification.description}
                                    </p>
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
                            variant="ghost"
                            size="icon"
                            className="rounded-full">
                            <Image
                                src="/assets/avatar.png"
                                alt="avatar"
                                width={30}
                                height={30}
                                className=""
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link href={`user/${userId}`}>
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                            </Link>
                            <Link href={"/settings"}>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => handleLogout()}>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Header;
