"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    registerEvent,
    cancelRegistration,
    getUserData,
} from "@/lib/actions/user.action";
import { getEventData } from "@/lib/actions/event.action";
import { EventData, UserData } from "@/types";
import { set } from "date-fns";
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
import { getData } from "@/lib/actions/test.action";
import { get } from "http";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
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

const page = ({ params }: { params: { eventId: string } }) => {
    const eventId = params.eventId;
    const { userId } = useAuth();
    const [eventData, setEventData] = useState<EventData>();
    const [userData, setUserData] = useState<UserData>();
    const [hostData, setHostData] = useState<UserData>();
    const [isRegistering, setIsRegistering] = useState(false);
    const [isPaidEvent, setIsPaidEvent] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    // for caculating capacity left
    const [capacityLeft, setCapacityLeft] = useState<number>();
    // for caculating how many tickets each type left if there are multiple ticket types
    const [ticketLeft, setTicketLeft] = useState<Record<string, number>>({});
    const router = useRouter();
    // Example Usage:
    /* setTicketLeft((prev) => ({ ...prev, vip1: 3 }));

    setTicketLeft({
        vip1: 3,
        vip2: 5,
    }); */

    // would contains all user info, would define interface later

    useEffect(() => {
        const getEvent = async () => {
            try {
                const data = await getEventData(eventId);
                if ("error" in data) {
                    console.error(data.error);
                    // Route to the not-found page
                    router.push("/not-found");
                } else {
                    setEventData(data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        getEvent();

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
                ticketLeft[ticket.ticketName] = ticket.ticketQuantity;
            });

            // reduce ticket quantity by registered tickets with type "paid", comparing ticketName
            if (eventData.registrations)
                eventData.registrations.forEach((registration) => {
                    ticketLeft[registration.ticketName as string]--;
                });
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
    }, [eventData]);

    // just for testing
    useEffect(() => {
        console.log("ticket left", ticketLeft);
        console.log("capacity left", capacityLeft);
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

    async function onSubmit(data: z.infer<typeof registerEventSchema>) {
        // send registered tickets to event
        // this is complicated, as paid tickets need to be paid first, by transaction system (i have no idea)
        // create new transaction to DB, has transactionId, navigate to /checkout/${transactionId}
        // handle logic
        setIsRegistering(true);

        try {
            data.multiType[0] = {
                name: data.multiType[0].name,
                price: 0,
                quantity: data.defaultQuantity,
            };

            const registerData = {
                userId,
                ticketType: eventData?.ticketType,
                tickets: eventData?.tickets,
                maxTickerPerUser: eventData?.maxTicketsPerUser,
                ...data,
            };
            console.log(registerData);
            /* await getData(); */
            /* if (!isPaidEvent) {
                if (data.defaultQuantity > 0) {
                    add multiType with free ticket {free, 0, "", quantity}
                    await registerEvent(data, userId);
                }
            } */
            /*
            if (!isPaidEvent) {
                if (data.quantity > 0) {
                await registerEvent(data);
                else do nothing
            }
            } else {
                // handle paid event
                // create transaction
                // navigate to /checkout/${transactionId}


                const { multiType, ...rest } = data;
                const registeredTickets = { // to filter out just ticket with quantity > 0 sent to DB
                    ...rest,
                    multiType: multiType.filter((ticket) => {
                        return ticket.quantity > 0;
                    }),
                // calculate total price of registerTickets, if > 0 then go to transaction page with all registeredTickets
                const totalPay = registeredTickets.reduce((sum, ticket) => {return sum + ticket.price}, 0)
                if (totalPay > 0) {
                    // create transaction with intial data: userId, eventId, timestamp, totalPay, registeredTickets, status == pending
                    // navigate to /transaction/${transactionId}
                    // get transaction info from transactionId from DB.
                    // then display all info (above) in transaction page
                    

                    // what stuck here is how can i make the transaction of user pending while they are paying, and mark as registered successfully after they paid in this page (reload again? could be a solution)
                    // user have to pay in a window of like 10min (there should be something to handle this, else i just use a button cancel instead), if not then transaction is mark as cancelled (status==cancelled). Idk if i should get a temporary timeLeft for a transaction, seems hard to implement. Might just go with manual cancel button.
                    // transaction not only event paying, there would be advertise too, need to think more about this.
                    // idea: give header for description: event pay or advertise pay, then display all info in transaction page
                    }
                else {
                proceed to registerEvent with registeredTickets
            }
            };
     
            }            
            
            */
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
                <div className="flex flex-col space-y-2">
                    {/* register form here, after registered quantity is lowered */}
                    {isAvailable ? (
                        <>
                            <p className="text-xl font-bold">Register</p>
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
                                                Choose types of tickets you want
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
                                                                (_, index) => (
                                                                    <div
                                                                        key={
                                                                            fields[
                                                                                index
                                                                            ].id
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
