"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { createEventSchema } from "@/lib/validation";
import { useAuth } from "@/context/AuthContext";
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
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputNumber from "@/components/input/InputNumber";
import TicketCard from "@/components/card/TicketCard";
import LogoUpload from "@/components/input/LogoUpload";
import SelectForm from "@/components/input/SelectForm";
import InputDateTime from "@/components/input/InputDateTime";
import { createEvent } from "@/lib/actions/event.action";

const Page = () => {
    // mock eventId
    // mock user already set payment method to receive payment
    const hasPaymentMethod = true;

    const { userId } = useAuth();
    // hooks
    const router = useRouter();
    const pathname = usePathname();
    const [isCreating, setIsCreate] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoSrc, setLogoSrc] = useState("/assets/eventLogo.png");
    const [hasGuideline, setHasGuideline] = useState(false);
    const [isLimited, setIsLimited] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [editingTicketIndex, setEditingTicketIndex] = useState(0);

    const form = useForm<z.infer<typeof createEventSchema>>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            name: "",
            logo: "/assets/eventLogo.png",
            type: "public",
            start: new Date(Date.now() + 30 * 60000)
                .toLocaleString("sv-SE", { timeZoneName: "short" })
                .replace(" ", "T")
                .slice(0, 16),
            end: new Date(Date.now() + 60 * 60000)
                .toLocaleString("sv-SE", { timeZoneName: "short" })
                .replace(" ", "T")
                .slice(0, 16),
            description: "",
            location: "",
            guideline: "",
            capacity: "unlimited",
            ticketType: "free",
            tickets: [],
            maxTicketsPerUser: 1,
            byUser: userId,
        },
    });

    const {
        control,
        formState: { errors },
    } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tickets",
    });

    // submit handler
    async function onSubmit(data: z.infer<typeof createEventSchema>) {
        setIsCreate(true);
        try {
            if (!isLimited) {
                data.capacity = "unlimited";
            }
            if (!isPaid) {
                data.tickets = [];
            }
            if (
                isPaid &&
                (typeof data.tickets === "undefined" ||
                    data.tickets.length === 0)
            ) {
                data.ticketType = "free";
            }
            // make async call to create event, contain all form data
            // navigate to event page

            /* await createEvent(data).then((res) => {
                if (res) {
                    if (res.success) {
                        router.push(`/event/${res.eventId}`);
                    }
                } else {
                    //throw new Error("Failed to create event");
                }
            }); */

            console.log(data);
        } catch (error) {
            console.log(data.start);
            console.error(error);
        } finally {
            //alert("Event created");
            setIsCreate(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full gap-10 justify-center items-start">
                <LogoUpload
                    control={form.control}
                    name="logo"
                    defaultImage={logoSrc} // Optional
                />
                <div className="flex flex-col gap-4">
                    <SelectForm
                        control={form.control}
                        name="type"
                        options={[
                            {
                                value: "public",
                                label: "Public",
                                description:
                                    "Everyone can see this event and register",
                            },
                            {
                                value: "private",
                                label: "Private",
                                description:
                                    "Only allowed people can see this event to register",
                            },
                        ]}
                        triggerClassName="w-fit border-none rounded-lg bg-slate-50 shadow-xl"
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Event Name"
                                        className="text-5xl text-slate-400 placeholder:text-slate-400 placeholder:opacity-40 placeholder:font-bold border-none hover:placeholder:opacity-60 focus:placeholder:opacity-60 focus:border-b-2 h-fit p-0 m-0"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                    <div className="w-full flex flex-col bg-slate-50 shadow-lg rounded-md justify-center px-3 divide-y-[1px] divide-gray-400">
                        <div className="w-full flex items-center justify-between">
                            <FormLabel className="">From</FormLabel>
                            <InputDateTime
                                control={form.control}
                                name="start"
                                form={form}
                            />
                        </div>
                        <div className="w-full flex items-center justify-between">
                            <FormLabel>To</FormLabel>
                            <InputDateTime
                                control={form.control}
                                name="end"
                                form={form}
                            />
                        </div>
                    </div>
                    <div className="w-full flex-col space-y-4">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className="w-full flex flex-col items-start gap-1">
                                    <FormLabel className="font-bold text-lg">
                                        Location:
                                    </FormLabel>
                                    <div className="w-full flex items-center justify-between gap-4">
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter event location..."
                                                className="text-lg text-slate-400 placeholder:text-slate-400 placeholder:opacity-60 placeholder:font-bold border-none hover:placeholder:opacity-100 focus:placeholder:opacity-100 focus:border-b-2 focus:border-b-gray-400 h-fit p-0 m-0"
                                                {...field}
                                            />
                                        </FormControl>

                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={hasGuideline}
                                                onCheckedChange={(e) =>
                                                    setHasGuideline(e)
                                                }
                                            />
                                            <Label className="whitespace-nowrap">
                                                Has Guideline
                                            </Label>
                                        </div>
                                    </div>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        {hasGuideline && (
                            <FormField
                                control={form.control}
                                name="guideline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-bold">
                                            Guideline:
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Add instructions for joining the event"
                                                className="text-base text-slate-400 placeholder:text-slate-400 placeholder:opacity-60 placeholder:font-bold border-none hover:placeholder:opacity-100 focus:placeholder:opacity-100 focus:border-b-2 focus:border-b-gray-400 h-fit p-0 m-0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-bold">
                                    Description:
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="w-full h-32 bg-white border-none shadow-xl focus-visible:ring-0"
                                        placeholder="Add more details about your event"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                    <div className="flex w-full flex-col">
                        <FormLabel className="text-base font-bold">
                            Event Options:
                        </FormLabel>
                        <div className="flex w-full flex-col gap-0 divide-y-[1px] divide-gray-400 bg-white rounded-md px-3 shadow-xl">
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem className="w-full flex justify-between items-center">
                                        <p>Capacity</p>
                                        <div>
                                            <FormControl>
                                                <div className="flex space-x-2 items-center">
                                                    <Label>
                                                        {isLimited
                                                            ? "Limited"
                                                            : "Unlimited"}
                                                    </Label>
                                                    <Button
                                                        variant="ghost"
                                                        className="p-0 rounded-full"
                                                        size="icon"
                                                        onClick={() => {
                                                            const e =
                                                                !isLimited;
                                                            setIsLimited(e);
                                                            if (!e) {
                                                                form.setValue(
                                                                    "capacity",
                                                                    "unlimited"
                                                                );
                                                            } else {
                                                                form.setValue(
                                                                    "capacity",
                                                                    1
                                                                );
                                                            }
                                                        }}>
                                                        <Image
                                                            src="/assets/editIcon.svg"
                                                            alt="edit logo"
                                                            width={24}
                                                            height={24}
                                                            className={`${
                                                                isLimited
                                                                    ? "opacity-50"
                                                                    : "opacity-100"
                                                            }`}
                                                        />
                                                    </Button>
                                                </div>
                                            </FormControl>
                                        </div>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                            {isLimited && (
                                <FormField
                                    control={form.control}
                                    name="capacity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="w-full flex justify-between items-center text-sm">
                                                    <p className="text-gray-400">
                                                        Adjust how many
                                                        attendees can join the
                                                        event
                                                    </p>
                                                    <InputNumber
                                                        control={form.control}
                                                        name="capacity"
                                                        defaultValue={1}
                                                        min={1}
                                                        extraClass="text-sm"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="ticketType"
                                render={({ field }) => (
                                    <FormItem className="w-full flex justify-between items-center">
                                        <p>Ticket Type</p>
                                        <div>
                                            <FormControl>
                                                <div className="flex space-x-2 items-center">
                                                    <Label>
                                                        {isPaid
                                                            ? "Paid"
                                                            : "Free"}
                                                    </Label>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            const e = !isPaid;
                                                            setIsPaid(e);
                                                            if (!e) {
                                                                form.setValue(
                                                                    "ticketType",
                                                                    "free"
                                                                );
                                                            } else {
                                                                form.setValue(
                                                                    "ticketType",
                                                                    "paid"
                                                                );
                                                            }
                                                        }}
                                                        className="p-0 rounded-full">
                                                        <Image
                                                            src="/assets/editIcon.svg"
                                                            alt="edit logo"
                                                            width={24}
                                                            height={24}
                                                            className={`${
                                                                isPaid
                                                                    ? "opacity-50"
                                                                    : "opacity-100"
                                                            }`}
                                                        />
                                                    </Button>
                                                </div>
                                            </FormControl>
                                        </div>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                            {isPaid && hasPaymentMethod && (
                                <FormField
                                    control={form.control}
                                    name="tickets"
                                    render={() => (
                                        <FormItem className="flex flex-col space-y-2">
                                            <FormLabel className="text-base font-bold mt-2">
                                                Tickets:
                                            </FormLabel>
                                            {fields.map((_, index) => (
                                                <div
                                                    key={fields[index].id}
                                                    className="bg-gray-50 p-4 rounded-md mb-4">
                                                    {editingTicketIndex ===
                                                    index ? (
                                                        <div className="flex flex-col space-y-2">
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name={`tickets.${index}.ticketName`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Ticket
                                                                            Name
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="text"
                                                                                placeholder="Ticket Name"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage className="text-red-500" />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name={`tickets.${index}.ticketPrice`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormControl className="w-full">
                                                                            <div className="w-full flex justify-between items-center space-x-2">
                                                                                <FormLabel className="whitespace-nowrap">
                                                                                    Ticket
                                                                                    Price
                                                                                </FormLabel>
                                                                                <div className="flex items-end">
                                                                                    <Input
                                                                                        type="text"
                                                                                        placeholder="Ticket Price"
                                                                                        {...field}
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const value =
                                                                                                parseFloat(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                );
                                                                                            field.onChange(
                                                                                                isNaN(
                                                                                                    value
                                                                                                )
                                                                                                    ? undefined
                                                                                                    : value
                                                                                            );
                                                                                        }}
                                                                                        onBlur={
                                                                                            field.onBlur
                                                                                        }
                                                                                        className=" border-b-2 border-t-0 border-r-0 border-l-0 shadow-none focus:border-b-gray-400 focus:ring-0 rounded-none w-fit h-fit py-0 text-end"
                                                                                    />
                                                                                    VND
                                                                                </div>
                                                                            </div>
                                                                        </FormControl>
                                                                        <FormMessage className="text-red-500" />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name={`tickets.${index}.ticketDescription`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Ticket
                                                                            Description
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Ticket Description"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage className="text-red-500" />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name={`tickets.${index}.ticketQuantity`}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem className="w-full">
                                                                        <FormControl className="w-full  flex justify-between items-center">
                                                                            <div>
                                                                                <FormLabel>
                                                                                    Ticket
                                                                                    Amount
                                                                                </FormLabel>
                                                                                <InputNumber
                                                                                    control={
                                                                                        form.control
                                                                                    }
                                                                                    name={`tickets.${index}.ticketQuantity`}
                                                                                    min={
                                                                                        1
                                                                                    }
                                                                                    defaultValue={
                                                                                        1
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </FormControl>
                                                                        <FormMessage className="text-red-500" />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <div className="flex justify-end items-center space-x-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        setEditingTicketIndex(
                                                                            -1
                                                                        )
                                                                    }
                                                                    className="rounded-full">
                                                                    <Image
                                                                        src="/assets/checkIcon.svg"
                                                                        alt="edit logo"
                                                                        width={
                                                                            24
                                                                        }
                                                                        height={
                                                                            24
                                                                        }
                                                                        className="rounded-full"
                                                                    />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        remove(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="rounded-full">
                                                                    <Image
                                                                        src="/assets/removeIcon.svg"
                                                                        alt="edit logo"
                                                                        width={
                                                                            18
                                                                        }
                                                                        height={
                                                                            18
                                                                        }
                                                                        className=""
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex space-x-2 justify-between w-full">
                                                            <TicketCard
                                                                name={form.getValues(
                                                                    `tickets.${index}.ticketName`
                                                                )}
                                                                price={form.getValues(
                                                                    `tickets.${index}.ticketPrice`
                                                                )}
                                                                quantity={form.getValues(
                                                                    `tickets.${index}.ticketQuantity`
                                                                )}
                                                                description={form.getValues(
                                                                    `tickets.${index}.ticketDescription`
                                                                )}
                                                            />
                                                            <div className="flex flex-col justify-end space-y-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    onClick={() =>
                                                                        setEditingTicketIndex(
                                                                            index
                                                                        )
                                                                    }
                                                                    size="icon"
                                                                    className="rounded-full">
                                                                    <Image
                                                                        src="/assets/editIcon.svg"
                                                                        alt="edit icon"
                                                                        width={
                                                                            24
                                                                        }
                                                                        height={
                                                                            24
                                                                        }
                                                                        className=""
                                                                    />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    onClick={() =>
                                                                        remove(
                                                                            index
                                                                        )
                                                                    }
                                                                    size="icon"
                                                                    className="rounded-full">
                                                                    <Image
                                                                        src="/assets/removeIcon.svg"
                                                                        alt="edit logo"
                                                                        width={
                                                                            20
                                                                        }
                                                                        height={
                                                                            20
                                                                        }
                                                                        className=""
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    append({
                                                        ticketName: "",
                                                        ticketPrice: 1,
                                                        ticketDescription: "",
                                                        ticketQuantity: 1,
                                                    })
                                                }>
                                                Add Ticket
                                            </Button>
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="maxTicketsPerUser"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <div className=" flex justify-between items-center">
                                            <p className="whitespace-nowrap">
                                                Max tickets per registrant:
                                            </p>
                                            <FormControl>
                                                <InputNumber
                                                    control={form.control}
                                                    name="maxTicketsPerUser"
                                                    min={1}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="text-lg py-6"
                        disabled={isCreating}>
                        Create Event
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default Page;
