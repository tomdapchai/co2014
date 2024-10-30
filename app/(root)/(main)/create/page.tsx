"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { createEventSchema } from "@/lib/validation";

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
import InputNumber from "@/components/InputNumber";
import { set } from "date-fns";

const Page = () => {
    // mock eventId
    const eventId = "1234";
    // mock user already set payment method to receive payment
    const hasPaymentMethod = true;

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

    // handlings
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const validateDate = (start: string, end: string): boolean => {
        const now = new Date();
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (startDate < now) {
            return false;
        }
        if (end && endDate < startDate) {
            return false;
        }
        return true;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        // only .png, .jpg, .jpeg .webp
        // max size 1mb
        // validate file type and size
        // post to 3rd party API to get URL
        if (file) {
            // Check file type
            const validType = [
                "image/png",
                "image/jpg",
                "image/jpeg",
                "image/webp",
            ];
            if (!validType.includes(file.type)) {
                alert(
                    "Invalid file type. Only .png, .jpg, .jpeg, .webp are allowed"
                );
                return;
            }

            const src = URL.createObjectURL(file);
            setLogoSrc(src);
        }
    };

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
            // make async call to create event
            // contain all form data
            // navigate to event page
            console.log(data);
            //alert("Creating event");

            // router.push(`/event/${eventId}`);
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
                <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                        <FormItem className="mt-0">
                            <Image
                                src={logoSrc}
                                alt="logo"
                                width={300}
                                height={300}
                                onClick={handleImageClick}
                                className="hover:cursor-pointer hover:brightness-95 mt-0 rounded-xl object-contain"
                            />
                            <FormMessage className="text-red-500" />
                            <FormControl className="mt-0">
                                <Input
                                    id="picture"
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden mt-0"
                                    onChange={(e) => {
                                        if (!e.target.files) return; // Early return if no files
                                        handleFileChange(e);
                                        field.onChange(e.target.files[0]); // Update form state
                                    }}
                                    name={field.name}
                                    // upload img to 3rd party API (imgur, CloudFlare - i prefer this one) to create URL
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-fit border-none rounded-lg bg-slate-50">
                                            <SelectValue>
                                                {field.value
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    field.value.slice(1)}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem
                                            value="public"
                                            className="flex flex-col justify-center items-start">
                                            <p className="font-bold text-base">
                                                Public
                                            </p>
                                            <p className="text-gray-400">
                                                Everyone can see this event and
                                                register
                                            </p>
                                        </SelectItem>
                                        <SelectItem
                                            value="private"
                                            className="flex flex-col justify-center items-start">
                                            <p className="font-bold text-base">
                                                Private
                                            </p>
                                            <p className="text-gray-400">
                                                Only allowed people can see this
                                                event to register
                                            </p>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
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
                        <FormField
                            control={form.control}
                            name="start"
                            rules={{
                                validate: (value) =>
                                    validateDate(value, form.getValues("end")),
                            }}
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <div className="w-full flex items-center justify-between">
                                        <p>Start</p>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    className="border-none focus:border-b-2 focus:border-slate-400"
                                                    min={new Date()
                                                        .toISOString()
                                                        .slice(0, 16)}
                                                    {...field}
                                                />
                                            </FormControl>
                                            {fieldState.error && (
                                                <FormMessage className="text-red-500">
                                                    {fieldState.error.message}
                                                </FormMessage>
                                            )}
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="end"
                            rules={{
                                validate: (value) =>
                                    validateDate(
                                        form.getValues("start"),
                                        value
                                    ),
                            }}
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <div className="w-full flex justify-between items-center">
                                        <p>End</p>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    className="border-none focus:border-b-2 focus:border-slate-400"
                                                    min={
                                                        form.watch("start") ||
                                                        new Date()
                                                            .toISOString()
                                                            .slice(0, 16)
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                            {fieldState.error && (
                                                <FormMessage className="text-red-500">
                                                    {fieldState.error.message}
                                                </FormMessage>
                                            )}
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
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
                                                <div className="flex space-x-4 items-center">
                                                    <Label>
                                                        {isLimited
                                                            ? "Limited"
                                                            : "Unlimited"}
                                                    </Label>
                                                    <Button
                                                        variant="ghost"
                                                        className="p-0"
                                                        onClick={() => {
                                                            const e =
                                                                !isLimited;
                                                            setIsLimited(e);
                                                            if (!e) {
                                                                form.setValue(
                                                                    "capacity",
                                                                    "unlimited"
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
                                                <div className="flex space-x-4 items-center">
                                                    <Label>
                                                        {isPaid
                                                            ? "Paid"
                                                            : "Free"}
                                                    </Label>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => {
                                                            const e = !isPaid;
                                                            setIsPaid(e);
                                                            if (!e) {
                                                                form.setValue(
                                                                    "ticketType",
                                                                    "free"
                                                                );
                                                            }
                                                        }}
                                                        className="p-0">
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
                                                        <>
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
                                                                                        className=" border-b-2 border-t-0 border-r-0 border-l-0 shadow-none focus:border-b-gray-400 focus:ring-0 rounded-none w-fit py-0 text-end"
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
                                                                name={`tickets.${index}.ticketAmount`}
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
                                                                                    name={`tickets.${index}.ticketAmount`}
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
                                                            <div className="flex justify-end">
                                                                <Button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setEditingTicketIndex(
                                                                            -1
                                                                        )
                                                                    }>
                                                                    Complete
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    onClick={() =>
                                                                        remove(
                                                                            index
                                                                        )
                                                                    }>
                                                                    Remove
                                                                </Button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col w-full">
                                                            <div className="flex justify-between w-full">
                                                                <p>
                                                                    {" "}
                                                                    Name:
                                                                    {form.getValues(
                                                                        `tickets.${index}.ticketName`
                                                                    )}
                                                                </p>
                                                                <p>
                                                                    {" "}
                                                                    Price:
                                                                    {form.getValues(
                                                                        `tickets.${index}.ticketPrice`
                                                                    )}{" "}
                                                                    VND
                                                                </p>
                                                                <p>
                                                                    {" "}
                                                                    Amount:
                                                                    {form.getValues(
                                                                        `tickets.${index}.ticketAmount`
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <p>
                                                                {" "}
                                                                Description:
                                                                {form.getValues(
                                                                    `tickets.${index}.ticketDescription`
                                                                )}
                                                            </p>
                                                            <div className="flex justify-end">
                                                                <Button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setEditingTicketIndex(
                                                                            index
                                                                        )
                                                                    }>
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    onClick={() =>
                                                                        remove(
                                                                            index
                                                                        )
                                                                    }>
                                                                    Remove
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
                                                        ticketAmount: 1,
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
                        className="bg-white text-slate-950 text-lg py-6 hover:bg-gray-50"
                        disabled={isCreating}>
                        Create Event
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default Page;
