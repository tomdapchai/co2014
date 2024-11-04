import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { formatDuration } from "@/lib/utils";
interface Props {
    id: string;
    title: string;
    logo: string;
    start: string;
    end: string;
    location: string;
    attendees: number;
    byUser: {
        id: string;
        name: string;
        avatar: string;
    };
    currentUserId: string;
}

const EventCard = ({
    id,
    title,
    logo,
    start,
    end,
    location,
    attendees,
    byUser,
    currentUserId,
}: Props) => {
    const isHost = byUser.id === currentUserId;
    return (
        <Link href={`/event/${id}`} className="w-full">
            <Card className="w-full">
                <div className="w-full flex justify-between items-center">
                    <div className="flex flex-col">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-2xl">{title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center pb-2">
                            <CardDescription className="flex flex-col justify-between gap-1">
                                <p>{formatDuration(start, end)}</p>
                                <p className="text-base">{location}</p>
                                {isHost ? (
                                    <p className="text-base">
                                        {attendees} attendees
                                    </p>
                                ) : (
                                    ""
                                )}
                            </CardDescription>
                        </CardContent>
                        {isHost ? (
                            <CardFooter>
                                <Link href={`/manage/${id}`}>
                                    <Button
                                        className="px-0 font-bold"
                                        variant="link">
                                        Manage event
                                    </Button>
                                </Link>
                            </CardFooter>
                        ) : (
                            <CardFooter>
                                <Link
                                    href={`/user/${byUser.id}`}
                                    className="flex gap-2 mt-2">
                                    <Image
                                        src={byUser.avatar}
                                        alt={byUser.name}
                                        width={20}
                                        height={20}
                                    />
                                    <p className="font-bold text-sm">
                                        By {byUser.name}
                                    </p>
                                </Link>
                            </CardFooter>
                        )}
                    </div>
                    <Image
                        src={logo}
                        alt={title}
                        width={120}
                        height={120}
                        className="mr-6"
                    />
                </div>
            </Card>
        </Link>
    );
};

export default EventCard;
