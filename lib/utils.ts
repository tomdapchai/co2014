import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDuration = (start: string, end: string) => {
    const currentDate = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    const isSameDay = (date1: Date, date2: Date) =>
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();

    const getDayDescription = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (isSameDay(date, today)) return "Today";
        if (isSameDay(date, yesterday)) return "Yesterday";
        if (isSameDay(date, tomorrow)) return "Tomorrow";

        // If current year, just return month and day
        if (date.getFullYear() === currentDate.getFullYear()) {
            return date.toLocaleDateString(undefined, {
                month: "numeric",
                day: "numeric",
            });
        }

        return date.toLocaleDateString();
    };

    const formatTime = (date: Date) =>
        date
            .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })
            .toLowerCase();

    if (isSameDay(startDate, endDate)) {
        return `${getDayDescription(startDate)}: ${formatTime(
            startDate
        )} - ${formatTime(endDate)}`;
    }

    return `${getDayDescription(startDate)} ${formatTime(
        startDate
    )} - ${getDayDescription(endDate)} ${formatTime(endDate)}`;
};

export const formatPrice = (price: number): string => {
    return price > 0
        ? price.toLocaleString("en-US", {
              style: "currency",
              currency: "VND",
              currencyDisplay: "code",
          })
        : "Free";
};
