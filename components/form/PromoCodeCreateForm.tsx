"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Define the PromoCodeView interface
export interface PromoCodeView {
    code: string;
    discount: number;
    quantity: number;
    expiryDate: string;
}

// Define the Zod schema for form validation
const promoCodeSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters"),
    discount: z.number().min(0).max(100, "Discount must be between 0 and 100"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    expiryDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

interface PromoCodeCreatorProps {
    onCreate: (promoCode: PromoCodeView) => void;
}

export function PromoCodeCreator({ onCreate }: PromoCodeCreatorProps) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const form = useForm<PromoCodeView>({
        resolver: zodResolver(promoCodeSchema),
        defaultValues: {
            code: "",
            discount: 0,
            quantity: 1,
            expiryDate: "",
        },
    });

    function onSubmit(data: PromoCodeView) {
        onCreate(data);
        setOpen(false);
        form.reset();
        toast({
            title: "Promo Code Created",
            description: `New promo code "${data.code}" has been created.`,
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Create New Promo Code</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Promo Code</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="SUMMER2023"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Create Promo Code</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
