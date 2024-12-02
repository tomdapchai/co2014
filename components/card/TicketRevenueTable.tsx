"use client";

import React, { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { TicketSoldView } from "@/types";
import { formatPrice } from "@/lib/utils";

interface TicketTableProps {
    initialData: TicketSoldView[];
}

export function TicketRevenueTable({ initialData }: TicketTableProps) {
    const [data, setData] = useState<TicketSoldView[]>(initialData);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof TicketSoldView;
        direction: "asc" | "desc";
    } | null>(null);
    const [filterConfig, setFilterConfig] = useState<
        "all" | "price" | "sold" | "revenue"
    >("all");
    const [searchTerm, setSearchTerm] = useState("");

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key])
                    return sortConfig.direction === "asc" ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key])
                    return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const filteredData = useMemo(() => {
        return sortedData
            .filter((item) => {
                if (filterConfig === "price") return item.ticketPrice > 0;
                if (filterConfig === "sold") return item.ticketSold > 0;
                if (filterConfig === "revenue") return item.totalRevenue > 0;
                return true;
            })
            .filter((item) =>
                item.ticketType.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [sortedData, filterConfig, searchTerm]);

    const totalRevenue = useMemo(() => {
        return filteredData.reduce((sum, item) => sum + item.totalRevenue, 0);
    }, [filteredData]);

    const requestSort = (key: keyof TicketSoldView) => {
        let direction: "asc" | "desc" = "asc";
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === "asc"
        ) {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Ticket Sales Insights</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between mb-4">
                    <Input
                        placeholder="Search ticket type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select
                        onValueChange={(value) =>
                            setFilterConfig(
                                value as "all" | "price" | "sold" | "revenue"
                            )
                        }
                        defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Show All</SelectItem>
                            <SelectItem value="price">{"Price > 0"}</SelectItem>
                            <SelectItem value="sold">{"Sold > 0"}</SelectItem>
                            <SelectItem value="revenue">
                                {"Revenue > 0"}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ticket Type</TableHead>
                            <TableHead>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-full justify-start">
                                            Price{" "}
                                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                requestSort("ticketPrice")
                                            }>
                                            Sort by Price
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableHead>
                            <TableHead>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-full justify-start">
                                            Quantity{" "}
                                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                requestSort("ticketQuantity")
                                            }>
                                            Sort by Quantity
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableHead>
                            <TableHead>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-full justify-start">
                                            Sold{" "}
                                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                requestSort("ticketSold")
                                            }>
                                            Sort by Sold
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableHead>
                            <TableHead>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-full justify-start">
                                            Revenue{" "}
                                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                requestSort("totalRevenue")
                                            }>
                                            Sort by Revenue
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((ticket, index) => (
                            <TableRow key={index}>
                                <TableCell>{ticket.ticketType}</TableCell>
                                <TableCell>
                                    {formatPrice(ticket.ticketPrice)}
                                </TableCell>
                                <TableCell>{ticket.ticketQuantity}</TableCell>
                                <TableCell>{ticket.ticketSold}</TableCell>
                                <TableCell>
                                    {formatPrice(ticket.totalRevenue) == "Free"
                                        ? "0"
                                        : formatPrice(ticket.totalRevenue)}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="font-bold text-right">
                                Total Revenue:
                            </TableCell>
                            <TableCell className="font-bold">
                                {formatPrice(totalRevenue)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
