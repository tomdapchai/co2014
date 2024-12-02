// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { getUserData } from "@/lib/actions/user.action";
import { registerEvent } from "@/lib/actions/register.action";
import { getEventData } from "@/lib/actions/event.action";
import { EventData, PromoCodeTrue, Registration, UserData } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { formatDuration } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { registerEventSchema } from "@/lib/validation";
import InputNumber from "@/components/input/InputNumber";
import TicketCard from "@/components/card/TicketCard";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import RegisteredCard from "@/components/card/RegisteredCard";
import { Toast, ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { cancelRegistration } from "@/lib/actions/register.action";
import { getPromoCodeEvent } from "@/lib/actions/promocode.action";
import { getPaidEventRegistration } from "@/lib/actions/register.action";
// There will be following actions from user: registerEvent, cancelRegistration used here

const getUser = async (
    userId: string
): Promise<UserData | { error: string }> => {
    try {
        const data = await getUserData(userId);
        if ("error" in data) {
            return data;
        } else {
            return data;
        }
    } catch (err) {
        console.log(userId, err);
        return { error: "Error getting user data" };
    }
};

type PaidRegs = {
    ticketName: string;
    amount: number;
};

const page = ({ params }: { params: { eventId: string } }) => {
    const eventId = params.eventId;
    const { userId } = useAuth();
    const [eventData, setEventData] = useState<EventData>();
    const [userData, setUserData] = useState<UserData>();
    const [hostData, setHostData] = useState<UserData>();
    const [userRegistered, setUserRegistered] = useState<Registration[]>([]);
    const [userPaidRegistered, setUserPaidRegistered] = useState<PaidRegs[]>(
        []
    );
    const [isRegistering, setIsRegistering] = useState(false);
    const [isPaidEvent, setIsPaidEvent] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    // for caculating capacity left
    const [capacityLeft, setCapacityLeft] = useState<number>();
    // for caculating how many tickets each type left if there are multiple ticket types
    const [ticketLeft, setTicketLeft] = useState<Record<string, number>>({});
    const [promoCodes, setPromoCodes] = useState<PromoCodeTrue[] | null>(null);
    const [appliedPromo, setAppliedPromo] = useState<PromoCodeTrue[]>([]);
    const router = useRouter();
    const { toast } = useToast();
    const path = usePathname();
    console.log(userId);

    const getEvent = async () => {
        try {
            const data = await getEventData(eventId);
            if ("error" in data) {
                console.error(data.error);
                // Route to the not-found page
                router.push("/not-found");
            } else {
                console.log("event data", data);
                setEventData(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    async function updateUserPaidRegistrations() {
        // Filter tickets with price > 0
        const paidTickets = eventData?.tickets.filter(
            (ticket) => ticket.ticketPrice > 0
        );

        // Fetch all paid registrations asynchronously
        const paidRegistrations = await Promise.all(
            paidTickets.map(async (ticket) => {
                const amount = await getPaidEventRegistration(
                    userId,
                    eventId,
                    ticket.ticketName
                );
                return { ticketName: ticket.ticketName, amount };
            })
        );

        // Filter out tickets with 0 registrations
        const filteredRegistrations = paidRegistrations.filter(
            (reg) => reg.amount > 0
        );

        // Update the state with the new data
        setUserPaidRegistered(filteredRegistrations);

        // Return the new data (optional, in case you want to use it directly as well)
        return filteredRegistrations;
    }

    useEffect(() => {
        if (!eventData) getEvent();

        if (!userData) {
            getUser(userId)
                .then((data) => {
                    if ("error" in data) {
                        console.error(data.error);
                    } else {
                        console.log(data);
                        setUserData(data);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    useEffect(() => {
        if (eventData) {
            const now = new Date();
            if (now < new Date(eventData.start)) {
                console.log("Event has not started yet");
                setIsAvailable(true);
            } else {
                console.log("Event has started or ended");
                setIsAvailable(false);
            }
        }

        if (eventData?.ticketType === "paid") {
            setIsPaidEvent(true);
        }
        // set capacity left
        if (eventData && eventData.registrations) {
            if (eventData.capacity === 0) {
                // if capacity is unlimited
                setCapacityLeft(Number.MAX_SAFE_INTEGER);
            } else {
                setCapacityLeft(
                    eventData.capacity - eventData.registrations.length
                );
            }
        }
        // set ticket quantity left
        if (eventData) {
            const ticketLeft: Record<string, number> = {};

            // set initial ticket quantity if there are multiple ticket types
            eventData?.tickets?.forEach((ticket) => {
                console.log("check");
                ticketLeft[ticket.ticketName] = ticket.ticketQuantity;
            });

            console.log("test ticketLeft1", ticketLeft);

            if (eventData.registrations)
                eventData.registrations.forEach((registration) => {
                    ticketLeft[registration.type as string]--;
                });

            console.log("test ticketLeft2", ticketLeft);
            setTicketLeft(ticketLeft);
        }

        if (eventData?.tickets) {
            form.reset({
                eventId: eventId,
                defaultQuantity: 0,
                multiType: eventData.tickets.map((ticket) => ({
                    name: ticket.ticketName,
                    price: ticket.ticketPrice,
                    quantity: 0,
                })),
            });
        }

        if (eventData?.byUser && eventData.byUser !== userId) {
            getUser(eventData.byUser as string).then((data) => {
                if ("error" in data) {
                    console.error(data.error);
                } else {
                    console.log(data);
                    setHostData(data);
                }
            });
        }

        if (eventData?.byUser === userId) {
            setHostData(userData);
        }

        if (eventData?.registrations) {
            const registration = eventData.registrations.filter(
                (data) => data.userId == userId
            );
            setUserRegistered(registration);
        }

        if (eventData && eventData.ticketType == "paid") {
            console.log("gonna get promocode here");
            getPromoCodeEvent(eventId).then((res) => {
                if ("error" in res) {
                    console.error(res.error);
                } else {
                    setPromoCodes(res);
                }
            });
        }
        if (eventData?.ticketType === "paid") {
            updateUserPaidRegistrations();
        }
    }, [eventData]);

    // just for testing
    useEffect(() => {
        console.log("ticket left", ticketLeft);
        console.log("capacity left", capacityLeft);
        console.log("user registered", userRegistered);
    }, [ticketLeft, capacityLeft]);

    // the error is because form hasnt received eventData yet (at first render)
    const form = useForm<z.infer<typeof registerEventSchema>>({
        resolver: zodResolver(registerEventSchema),
        defaultValues: {
            eventId: eventId,
            defaultQuantity: 0,
            multiType: [],
        },
    });

    const { control, formState } = form;

    const { fields } = useFieldArray({
        control,
        name: "multiType",
    });

    // few more things to consider:
    // if user registered, they can cancel registration
    // still allow user to register if they have registered before, but not exceed maxTicketsPerUser. if exceed, doesnt show tickets or any register field.
    // each ticket registered would count as an registration

    const handleOnCancel = async (ticketId: string, cost: number) => {
        try {
            await cancelRegistration(ticketId, cost, path).then((res) => {
                if ("error" in res) {
                    toast({
                        title: "Error",
                        description: res.error,
                        variant: "destructive",
                    });
                } else {
                    toast({
                        title: "Registration Cancelled",
                        description: res.message,
                        variant: "default",
                    });
                    getEvent();
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    async function onSubmit(data: z.infer<typeof registerEventSchema>) {
        setIsRegistering(true);

        try {
            if (eventData) {
                const registerData = {
                    userId: userId,
                    ticketType: eventData.ticketType,
                    eventTickets: eventData.tickets,
                    maxTicketPerUser: eventData.maxTicketsPerUser,
                    ...data,
                };
                console.log(registerData);
                if (!isPaidEvent) {
                    await registerEvent(registerData, path).then((res) => {
                        if ("error" in res) {
                            toast({
                                title: "Error",
                                description: res.error,
                                variant: "destructive",
                            });
                        } else {
                            toast({
                                title: "Success",
                                description: res.message,
                                variant: "default",
                            });
                            getEvent();
                        }
                    });
                } else {
                    await registerEvent(
                        registerData,
                        path,
                        appliedPromo,
                        eventData.byUser
                    );
                }
            }
        } catch (error) {
        } finally {
            setIsRegistering(false);
        }
    }

    function isPaidEventWithTickets(
        event: EventData
    ): event is EventData & { tickets: NonNullable<EventData["tickets"]> } {
        return event.ticketType === "paid" && !!event.tickets;
    }

    if (!eventData) {
        return (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900" />
            </div>
        );
    }

    return (
        <div className="flex w-full gap-10 justify-center items-start pb-6">
            <div className="flex flex-col justify-start items-start space-y-4">
                <Image
                    src={eventData ? eventData.logo : "/assets/eventLogo.png"}
                    alt="event logo"
                    width={300}
                    height={300}
                    className="rounded-xl"
                />

                {eventData?.byUser === userId ? (
                    <div>
                        <Link href={`/manage/${eventId}`}>
                            <Button>Manage Events</Button>
                        </Link>
                    </div>
                ) : (
                    // userId will be replaced by user name
                    <div className="whitespace-nowrap flex space-x-2">
                        <p>Host by</p>
                        <Link
                            href={`/user/${eventData?.byUser}`}
                            className="flex space-x-2">
                            <Image
                                src={hostData?.avatar || "/assets/avatar.png"}
                                alt="host avatar"
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                            <p className="font-bold">{hostData?.username}</p>
                        </Link>
                    </div>
                )}

                <div>{eventData?.registrations?.length} attendees</div>
            </div>

            <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold">
                    {eventData ? eventData.name : "Event Name"}
                </h1>
                <div className="">
                    <p className="font-bold text-xl">Duration</p>

                    {formatDuration(
                        eventData ? eventData.start : "2025-10-31T17:25",
                        eventData ? eventData.end : "2025-10-31T17:55"
                    )}
                </div>
                <div className="">
                    <p className="text-xl font-bold">At</p>{" "}
                    {eventData ? eventData.location : "Event Location"}
                </div>
                {eventData?.guideline && (
                    <div>
                        <p className="text-lg font-bold">
                            Further instructions
                        </p>
                        <p>{eventData.guideline}</p>
                    </div>
                )}
                {userRegistered.length > 0 ? (
                    <div className="flex flex-col space-y-2">
                        <p className="font-bold text-2xl">
                            You have registered
                        </p>
                        <div className="flex flex-col space-y-2 w-full">
                            {userRegistered.map((data) => (
                                <RegisteredCard
                                    key={data.ticketId}
                                    type={data.type}
                                    status={data.status}
                                    ticketId={data.ticketId}
                                    cost={
                                        eventData?.tickets.find(
                                            (ticket) =>
                                                ticket.ticketName.toUpperCase() ===
                                                data.type?.toUpperCase()
                                        )?.ticketPrice as number
                                    }
                                    onCancel={handleOnCancel}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    ""
                )}
                {userPaidRegistered.length > 0 &&
                    userPaidRegistered.map((data) => (
                        <Card className="w-[300px]">
                            <CardContent>
                                <p>
                                    {data.ticketName} - {data.amount} registered
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                <div className="flex flex-col space-y-2">
                    {/* register form here, after registered quantity is lowered */}
                    {isAvailable ? (
                        <>
                            <p className="text-xl font-bold">Register</p>
                            <div className="flex justify-start items-start space-x-6">
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="w-full flex flex-col justify-center items-start p-4 backdrop-blur-xl bg-white/30 shadow-xl rounded-xl ">
                                        {!isPaidEvent ? (
                                            <div className="w-full flex justify-between">
                                                <FormItem>
                                                    <FormLabel>
                                                        <p>
                                                            How many tickets you
                                                            want to register?
                                                        </p>
                                                        <FormControl>
                                                            <InputNumber
                                                                control={
                                                                    form.control
                                                                }
                                                                name="defaultQuantity"
                                                                defaultValue={0}
                                                                min={0}
                                                                max={Math.min(
                                                                    ticketLeft[
                                                                        eventData
                                                                            .tickets[0]
                                                                            .ticketName
                                                                    ]
                                                                        ? ticketLeft[
                                                                              eventData
                                                                                  .tickets[0]
                                                                                  .ticketName
                                                                          ]
                                                                        : 0,
                                                                    eventData.maxTicketsPerUser
                                                                )}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-red-500" />
                                                    </FormLabel>
                                                </FormItem>
                                            </div>
                                        ) : (
                                            <div className="w-full flex flex-col divide-y-[1px] divide-gray-400 space-y-2">
                                                <p>
                                                    Choose types of tickets you
                                                    want
                                                </p>
                                                {isPaidEventWithTickets(
                                                    eventData
                                                ) && (
                                                    <FormField
                                                        control={form.control}
                                                        name="multiType"
                                                        render={() => (
                                                            <FormItem className="w-full flex flex-col space-y-2 divide-y-[1px] divide-gray-400">
                                                                {fields.map(
                                                                    (
                                                                        _,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                fields[
                                                                                    index
                                                                                ]
                                                                                    .id
                                                                            }
                                                                            className="w-full flex justify-between">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name={`multiType.${index}.quantity`}
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="w-full flex justify-between items-end py-4 space-x-4">
                                                                                        <TicketCard
                                                                                            name={
                                                                                                eventData
                                                                                                    .tickets[
                                                                                                    index
                                                                                                ]
                                                                                                    .ticketName
                                                                                            }
                                                                                            price={
                                                                                                eventData
                                                                                                    .tickets[
                                                                                                    index
                                                                                                ]
                                                                                                    .ticketPrice
                                                                                            }
                                                                                            quantity={
                                                                                                ticketLeft[
                                                                                                    eventData
                                                                                                        .tickets[
                                                                                                        index
                                                                                                    ]
                                                                                                        .ticketName
                                                                                                ]
                                                                                            }
                                                                                            description={
                                                                                                eventData
                                                                                                    .tickets[
                                                                                                    index
                                                                                                ]
                                                                                                    .ticketDescription
                                                                                            }
                                                                                        />
                                                                                        <div className="flex flex-col">
                                                                                            <p>
                                                                                                Amount
                                                                                            </p>
                                                                                            <InputNumber
                                                                                                control={
                                                                                                    control
                                                                                                }
                                                                                                name={`multiType.${index}.quantity`}
                                                                                                defaultValue={
                                                                                                    0
                                                                                                }
                                                                                                min={
                                                                                                    0
                                                                                                }
                                                                                                max={Math.min(
                                                                                                    ticketLeft[
                                                                                                        eventData
                                                                                                            .tickets[
                                                                                                            index
                                                                                                        ]
                                                                                                            .ticketName
                                                                                                    ],
                                                                                                    eventData.maxTicketsPerUser
                                                                                                )}
                                                                                            />
                                                                                            <FormMessage className="text-red-500" />
                                                                                        </div>
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    )
                                                                )}
                                                                <FormMessage className="text-red-500" />
                                                            </FormItem>
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <Button
                                            type="submit"
                                            disabled={isRegistering}>
                                            Register
                                        </Button>
                                    </form>
                                </Form>
                                <div>
                                    {isPaidEvent && promoCodes && (
                                        <div className="flex flex-col space-y-2">
                                            <p className="font-bold text-xl">
                                                Promo Codes
                                            </p>
                                            <div className="flex flex-col space-y-2">
                                                {promoCodes.map((promo) =>
                                                    promo.quantity > 0 ? (
                                                        <Card
                                                            key={promo.id}
                                                            title={promo.code}
                                                            className="p-4 rounded-xl flex justify-between items-center w-[200px]">
                                                            <CardContent className="flex w-full justify-between items-center p-2">
                                                                <CardDescription className="flex flex-col justify-between gap-4">
                                                                    <p>
                                                                        {
                                                                            promo.code
                                                                        }
                                                                    </p>
                                                                    <div className="flex space-x-4 items-center">
                                                                        <p className="text-base">
                                                                            {
                                                                                promo.discount
                                                                            }
                                                                            %
                                                                            off
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                promo.quantity
                                                                            }{" "}
                                                                            left
                                                                        </p>
                                                                    </div>
                                                                </CardDescription>
                                                                <Button
                                                                    className="px-0 font-bold"
                                                                    variant="link"
                                                                    onClick={() => {
                                                                        setAppliedPromo(
                                                                            // cannot apply the same promo code twice
                                                                            appliedPromo?.find(
                                                                                (
                                                                                    promoCode
                                                                                ) =>
                                                                                    promoCode.id ===
                                                                                    promo.id
                                                                            )
                                                                                ? appliedPromo
                                                                                : [
                                                                                      ...(appliedPromo
                                                                                          ? appliedPromo
                                                                                          : []),
                                                                                      promo,
                                                                                  ]
                                                                        );
                                                                    }}>
                                                                    Apply
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    ) : (
                                                        ""
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-bold">
                                Sorry, the event has ended
                            </p>
                            <Card
                                title="Attendee"
                                className="p-4 rounded-xl flex justify-center items-center mt-4">
                                <CardContent className="flex justify-center items-center p-0">
                                    <p>
                                        {eventData?.registrations?.length}{" "}
                                        attendees
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                <div className="text-lg">
                    <p className="text-xl font-bold">About event</p>
                    <p>
                        {eventData
                            ? eventData.description
                            : "Event Description"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default page;
