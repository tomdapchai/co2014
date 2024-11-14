// for storing interfaces and types
export interface EventView {
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
}
export interface notificationProps {
    id: string;
    title: string;
    description: string;
    time: Date;
}

export interface TicketDetail {
    ticketName: string;
    ticketPrice: number;
    ticketDescription?: string;
    ticketQuantity: number;
}

export interface EventData {
    name: string;
    logo: string;
    type: "public" | "private";
    start: string;
    end: string;
    description?: string;
    location: string;
    guideline?: string;
    capacity: number;
    ticketType: "free" | "paid";
    tickets: TicketDetail[];
    maxTicketsPerUser: number;
    registrations?: Registration[]; // for storing registrations
    byUser: string;
    adId?: string;
}

export interface Registration {
    userId: string;
    ticketId: string;
    type: "free" | "paid";
    ticketName?: string; // for paid ticket
    status?: "pending" | "approved" | "rejected";
    hasChekedIn: boolean;
}

interface multiType {
    name: string;
    price: number;
    quantity: number;
}
export interface RegistrationData {
    userId: string;
    eventId: string;
    maxTicketPerUser: number;
    defaultQuantity: number;
    ticketType: "free" | "paid";
    multiType: multiType[];
    eventTickets: TicketDetail[];
}

export type Product = {
    name: string;
    price: number;
    quantity?: number;
    duration?: string;
};
export interface TransactionData {
    eventId: string; // to know which event the transaction is for (ticket or advertisement)
    // if type is ticket then use byUser when get event data, and display payment info
    userId: string; // to know who gonna pay the transaction
    type: "ticket" | "advertisement";
    products: Product[];
}

// transaction logic: user pay, click proceed, transaction status still pending. Host check if the user already sent => go to management to approve the payment.
// After 24hrs, the transaction will be automatically approved.
// If user decide to cancel the payment, status would remain "canceled" 4ever.

export interface UserData {
    username: string;
    email?: string;
    name?: string;
    avatar: string;
    sex: "male" | "female";
    address?: {
        city?: string;
        province?: string;
        country?: string;
    };
    dob?: string;
}
