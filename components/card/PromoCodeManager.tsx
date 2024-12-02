"use client";
import { useState } from "react";
import { PromoCodeCreator } from "../form/PromoCodeCreateForm";
import { PromoCodeView } from "@/types";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEventContext } from "@/context/EventContext";
export function PromoCodeManager() {
    const { createPromoCodes, promoCodes, deletePromoCodes } =
        useEventContext();
    console.log("got", promoCodes);
    const [promoCode, setPromoCode] = useState<PromoCodeView[]>([]);

    const handleCreatePromoCode = async (newPromoCode: PromoCodeView) => {
        await createPromoCodes([newPromoCode]).then(() => {});
    };

    const handleDeletePromoCode = (codeId: string) => {
        console.log("delete", codeId);
        deletePromoCodes(codeId);
        /* setPromoCode(promoCode.filter((code) => code.code !== codeToDelete)); */
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Promo Codes</h1>
            <div className="mb-5">
                <PromoCodeCreator onCreate={handleCreatePromoCode} />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Discount (%)</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {promoCodes?.map((promoCode) => (
                        <TableRow key={promoCode.code}>
                            <TableCell>{promoCode.code}</TableCell>
                            <TableCell>{promoCode.discount}</TableCell>
                            <TableCell>{promoCode.quantity}</TableCell>
                            <TableCell>
                                {promoCode.expiryDate.toString().slice(0, 16)}
                            </TableCell>
                            <TableCell>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                                This will permanently delete the
                                                promo code.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    handleDeletePromoCode(
                                                        promoCode.id
                                                    )
                                                }>
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
