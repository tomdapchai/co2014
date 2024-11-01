// for storing interfaces and types
export interface EventView {
    id: string;
    title: string;
    logo: string;
    start: Date;
    end: Date;
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
    ticketAmount: number;
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
    capacity: string | number;
    ticketType: "free" | "paid";
    tickets?: TicketDetail[];
    maxTicketsPerUser: number;
}
