import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { EventData } from "@/types";
import { Input } from "../ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { createEventSchema } from "@/lib/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import LogoUpload from "../input/LogoUpload";
import SelectForm from "../input/SelectForm";
import InputDateTime from "../input/InputDateTime";
import { Textarea } from "../ui/textarea";
import InputNumber from "../input/InputNumber";
import Image from "next/image";
import TicketCard from "../card/TicketCard";

interface EditEventFormProps {
    eventData: EventData;
    onSubmit: (data: EventData) => Promise<void>;
}

const EditEventForm = ({ eventData, onSubmit }: EditEventFormProps) => {
    const [editingTicketIndex, setEditingTicketIndex] = useState(-1);
    const [isLimited, setIsLimited] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        if (eventData.capacity != 0) {
            setIsLimited(true);
        }

        if (eventData.ticketType === "paid") {
            setIsPaid(true);
        }
    }, []);

    const form = useForm<z.infer<typeof createEventSchema>>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            ...eventData,
        },
    });

    const {
        control,
        trigger,
        getValues,
        formState: { errors },
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tickets",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // https://react-hook-form.com/docs/useform/trigger
        const isValid = await trigger(undefined, { shouldFocus: true });
        console.log("Validation result:", isValid);

        if (!isValid) {
            return;
        }

        const formValues = getValues();

        if (formValues.ticketType === "free") {
            formValues.tickets = [];
        }

        if (
            isPaid &&
            (typeof formValues.tickets === "undefined" ||
                formValues.tickets.length === 0)
        ) {
            formValues.ticketType = "free";
        }
        // Schema validation
        const result = createEventSchema.safeParse(formValues);
        if (!result.success) {
            console.log("Schema validation failed:", result.error);
            return;
        }
        await onSubmit(formValues as EventData);
    };

    return (
        <Form {...form}>
            <form className="space-y-4 flex flex-col justify-start items-start ">
                <div>
                    <FormLabel>Event Logo</FormLabel>
                    <LogoUpload
                        control={form.control}
                        name="logo"
                        defaultImage={eventData.logo}
                    />
                </div>

                <div>
                    <FormLabel>Event Type</FormLabel>
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
                        triggerClassName="w-fit border border-black rounded-lg bg-slate-50"
                    />
                </div>

                <div>
                    <FormLabel>Event Name</FormLabel>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <FormLabel>Duration</FormLabel>
                    <div className="w-full flex-col flex justify-between">
                        <div className="flex flex-col">
                            <p>From</p>
                            <InputDateTime
                                control={form.control}
                                name="start"
                                form={form}
                            />
                        </div>
                        <div className="flex flex-col">
                            <p>To</p>
                            <InputDateTime
                                control={form.control}
                                name="end"
                                form={form}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <FormLabel>Location</FormLabel>
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="w-full">
                    <FormLabel>Guideline</FormLabel>
                    <FormField
                        control={form.control}
                        name="guideline"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        className="w-full h-32 bg-white border border-black rounded-md focus-visible:ring-0"
                                        placeholder="Add more details about your event"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <FormLabel>Capacity</FormLabel>
                    <SelectForm
                        control={form.control}
                        name="capacity"
                        options={[
                            { value: "unlimited", label: "Unlimited" },
                            { value: "limited", label: "Limited" },
                        ]}
                        defaultValue={
                            eventData.capacity != 0 ? "limited" : "unlimited"
                        }
                        onChange={(value) => {
                            if (value === "unlimited") {
                                form.setValue("capacity", 0);
                            }
                            setIsLimited(value === "limited");
                        }}
                    />
                    {isLimited ? (
                        <InputNumber
                            control={form.control}
                            name="capacity"
                            defaultValue={1}
                            min={1}
                            extraClass="text-sm"
                        />
                    ) : (
                        ""
                    )}
                </div>

                <div className="w-full">
                    <FormLabel>Ticket types</FormLabel>
                    <SelectForm
                        control={form.control}
                        name="ticketType"
                        options={[
                            { value: "free", label: "Free" },
                            { value: "paid", label: "Paid" },
                        ]}
                        defaultValue={eventData.ticketType}
                        onChange={(value) => {
                            form.setValue("ticketType", value);
                            setIsPaid(value === "paid");
                        }}
                    />
                    {isPaid ? (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel className="text-base font-bold mt-2">
                                Tickets:
                            </FormLabel>
                            {fields.map((_, index) => (
                                <div
                                    key={fields[index].id}
                                    className="bg-gray-50 p-4 rounded-md mb-4">
                                    {editingTicketIndex === index ? (
                                        <div className="flex flex-col space-y-2">
                                            <FormField
                                                control={form.control}
                                                name={`tickets.${index}.ticketName`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Ticket Name
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
                                                control={form.control}
                                                name={`tickets.${index}.ticketPrice`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl className="w-full">
                                                            <div className="w-full flex justify-between items-center space-x-2">
                                                                <FormLabel className="whitespace-nowrap">
                                                                    Ticket Price
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
                                                control={form.control}
                                                name={`tickets.${index}.ticketDescription`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Ticket Description
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
                                                control={form.control}
                                                name={`tickets.${index}.ticketQuantity`}
                                                render={({ field }) => (
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
                                                                    min={1}
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
                                                        width={24}
                                                        height={24}
                                                        className="rounded-full"
                                                    />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                    className="rounded-full">
                                                    <Image
                                                        src="/assets/removeIcon.svg"
                                                        alt="edit logo"
                                                        width={18}
                                                        height={18}
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
                                                        alt="edit logo"
                                                        width={24}
                                                        height={24}
                                                        className=""
                                                    />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                    size="icon"
                                                    className="rounded-full">
                                                    <Image
                                                        src="/assets/removeIcon.svg"
                                                        alt="edit logo"
                                                        width={20}
                                                        height={20}
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
                    ) : (
                        ""
                    )}
                </div>

                <div className="w-full">
                    <FormLabel>Max Tickets Per User</FormLabel>
                    <InputNumber
                        control={form.control}
                        name="maxTicketsPerUser"
                        defaultValue={eventData.maxTicketsPerUser}
                        min={1}
                        extraClass="text-sm"
                    />
                </div>

                <SheetFooter>
                    <Button type="button" onClick={handleSubmit}>
                        Save and close
                    </Button>
                </SheetFooter>
            </form>
        </Form>
    );
};

export default EditEventForm;
