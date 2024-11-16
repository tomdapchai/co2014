import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { on } from "events";

interface Props {
    type: string;
    status: string;
    cost: number;
    ticketId: string;
    onCancel: (ticketId: string, cost: number) => void;
}

const RegisteredCard = ({ type, status, cost, ticketId, onCancel }: Props) => {
    const handleCancel = () => {
        if (onCancel) {
            onCancel(ticketId, cost);
        }
    };

    return (
        <div className="flex justify-start space-x-4 w-full">
            <Card className="flex justify-between items-center py-2 px-4 space-x-4 shadow-lg">
                <p className="font-bold">{type}</p>
                <p
                    className={`${
                        status == "rejected"
                            ? "text-red-500"
                            : status == "pending"
                            ? "text-yellow-500"
                            : "text-green-500"
                    } `}>
                    {status.toUpperCase()}
                </p>
            </Card>
            <Button className="text-red-500 shadow-lg" onClick={handleCancel}>
                Cancel
            </Button>
        </div>
    );
};

export default RegisteredCard;
