import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Ticket, DollarSign, Hash } from "lucide-react";

interface Props {
    name: string;
    price: number;
    quantity: number;
    description?: string;
}

const TicketCard = ({
    name,
    price,
    quantity,
    description = "Enjoy an unforgettable night with premium seating and exclusive backstage access.",
}: Props) => {
    const formatPrice = (price: number): string => {
        return price > 0
            ? price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "VND",
                  currencyDisplay: "code",
              })
            : "Free";
    };

    const getHeaderClass = (price: number) => {
        return price > 0
            ? "bg-gradient-to-r from-yellow-300 to-yellow-500"
            : "bg-primary/20";
    };
    return (
        <Card className="w-full max-w-sm mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
            <CardHeader
                className={`p-4 flex flex-row items-center justify-between space-x-4 ${getHeaderClass(
                    price
                )}`}>
                <div className="flex items-center space-x-2">
                    <Ticket className="h-6 w-6 text-primary" />
                    <h2 className="text-lg font-semibold text-primary">
                        Event Ticket
                    </h2>
                </div>
                <div className="flex items-center justify-between space-x-1">
                    <p className="font-bold text-green-600">
                        {formatPrice(price)}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-bold truncate">{name}</h3>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Hash className="h-4 w-4" />
                            <span>{quantity}</span>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {description === ""
                            ? "Enjoy an unforgettable night with premium seating and exclusive backstage access."
                            : description}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default TicketCard;
