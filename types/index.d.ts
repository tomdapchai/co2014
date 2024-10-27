// for storing interfaces and types
// EventView is temporary and will be replaced with the actual type, as isHost is replaced by comparing current user id with the event host id (byUser.id right now)
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
