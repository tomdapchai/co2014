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
