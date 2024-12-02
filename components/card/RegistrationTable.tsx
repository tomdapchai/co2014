import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Registration } from "@/types";
import { updateStatusRegistration } from "@/lib/actions/register.action";
import { Button } from "../ui/button";
interface RegistrationTableProps {
    registrations: Registration[];
    type: "overview" | "full";
}

export default function RegistrationTable({
    registrations,
    type,
}: RegistrationTableProps) {
    const handleStatusChange = async (ticketId: string, status: string) => {
        await updateStatusRegistration(ticketId, status);
    };
    return (
        <div className="container mx-auto py-10">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Checked In</TableHead>
                        {type === "full" && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {registrations.map((registration, index) => (
                        <TableRow key={index}>
                            <TableCell>{registration.userId}</TableCell>
                            <TableCell>{registration.ticketId}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        registration.type === "paid"
                                            ? "default"
                                            : "secondary"
                                    }>
                                    {registration.type}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        registration.status === "accepted"
                                            ? "default"
                                            : registration.status === "rejected"
                                            ? "destructive"
                                            : "default"
                                    }
                                    className={
                                        registration.status === "accepted"
                                            ? "bg-green-500"
                                            : registration.status === "rejected"
                                            ? "bg-red-500"
                                            : ""
                                    }>
                                    {registration.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {registration.status == "accepted" &&
                                    (registration.hasChekedIn ? "Yes" : "No")}
                            </TableCell>
                            {type === "full" &&
                                registration.status == "pending" && (
                                    <TableCell className="flex space-x-4">
                                        <Button
                                            className="bg-green-500 hover:bg-green-500/90 text-white rounded"
                                            onClick={() =>
                                                handleStatusChange(
                                                    registration.ticketId,
                                                    "accepted"
                                                )
                                            }>
                                            Approve
                                        </Button>
                                        <Button
                                            className="bg-red-500 hover:bg-red-500/90 text-white rounded"
                                            onClick={() =>
                                                handleStatusChange(
                                                    registration.ticketId,
                                                    "rejected"
                                                )
                                            }>
                                            Reject
                                        </Button>
                                    </TableCell>
                                )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
