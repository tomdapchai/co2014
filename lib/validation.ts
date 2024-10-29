import * as z from "zod";

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const SignUpSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const minDateTime = new Date().toISOString().slice(0, 16);

const ticketDetailSchema = z.object({
    ticketName: z.string().min(3).max(50),
    ticketPrice: z.number().int().positive(),
    ticketDescription: z.optional(z.string().max(200)),
    ticketAmount: z.union([z.literal("unlimited"), z.number().positive()]),
});

export const createEventSchema = z
    .object({
        name: z.string().min(3).max(50),
        logo: z.optional(z.string()),
        type: z.enum(["public", "private"]),
        start: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
                message: "Invalid datetime format",
            })
            .refine((dateTime) => dateTime >= minDateTime, {
                message: `Date and time must be after ${minDateTime.replace(
                    "T",
                    " "
                )}`,
            }),
        end: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
                message: "Invalid datetime format",
            }) // Validate "YYYY-MM-DDTHH:MM" format
            .refine((dateTime) => dateTime >= minDateTime, {
                message: `Date and time must be after ${minDateTime.replace(
                    "T",
                    " "
                )}`,
            }),
        description: z.optional(z.string().max(3000)),
        location: z.string().min(3).max(200),
        guideline: z.optional(z.string().max(200)),
        capacity: z.union([z.string(), z.number().int().positive()]),
        ticketType: z.enum(["free", "paid"]),
        // Optional fields for paid tickets
        tickets: z.optional(z.array(ticketDetailSchema)),
        // End of optional fields
        maxTicketsPerUser: z.number().int().positive(),
    })
    .refine((data) => new Date(data.start) <= new Date(data.end), {
        message: "End datetime must be after start datetime",
        path: ["end"],
    })
    .refine((data) => {
        if (data.ticketType === "paid") {
            return (
                Array.isArray(data.tickets) &&
                data.tickets.every((ticket) => {
                    return (
                        typeof ticket.ticketPrice === "number" &&
                        typeof ticket.ticketName === "string" &&
                        ticket.ticketName.length >= 3 &&
                        (typeof ticket.ticketDescription === "undefined" ||
                            ticket.ticketDescription.length <= 200) &&
                        ((typeof ticket.ticketAmount === "string" &&
                            ticket.ticketAmount == "unlimited") ||
                            (typeof ticket.ticketAmount === "number" &&
                                ticket.ticketAmount > 0))
                    );
                }) &&
                // Check for distinct ticket names
                new Set(data.tickets.map((ticket) => ticket.ticketName))
                    .size === data.tickets.length
            );
        }
        return true; // For free tickets, auto passed checking
    });
