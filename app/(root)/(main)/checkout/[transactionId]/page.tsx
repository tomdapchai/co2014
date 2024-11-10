"use client";
import CheckoutCard from "@/components/card/CheckoutCard";
import { Label } from "@/components/ui/label";
import { getTransactions } from "@/lib/actions/transaction.action";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const page = ({ params }: { params: { transactionId: string } }) => {
    const transactionId = params.transactionId;
    const [transactionData, setTransactionData] = useState();

    async function fetchTransactionData() {
        await getTransactions(transactionId).then((res) => {});
        // if payload header has "event paid", show tickets to pay
        // if payload header has advertisement, show advertisement to pay
        // this to determine who gonna be the receiver (event host or admin)
        // get host data (byUser) => receiverInfo
    }

    // list of promo codes that user can use

    const onDone = () => {
        // mark transaction as paid for host to view then approved (cannot reject)
        console.log("Transaction done");
    };
    const onCanceled = () => {
        // mark transaction as canceled
        console.log("Transaction canceled");
    };

    return (
        <div className="flex justify-center items-center h-full">
            <div className="flex justify-center items-stretch rounded-xl shadow-xl overflow-hidden">
                <div className="flex flex-1 justify-center items-center bg-slate-700">
                    <div className="flex flex-col justify-center items-center space-y-8 p-10">
                        <Image
                            src={"/assets/eventLogo.png"}
                            alt="event logo"
                            width={300}
                            height={300}
                            className="rounded-xl"
                        />
                        <Label className="text-white text-3xl font-bold">
                            Event Name
                        </Label>
                    </div>
                </div>
                <div className="flex space-x10 justify-center items-center p-10 bg-slate-100">
                    <CheckoutCard
                        products={[
                            { name: "VIP", price: 50000, quantity: 2 },
                            { name: "Free", price: 0, quantity: 1 },
                            { name: "Diamond", price: 100000, quantity: 1 },
                        ]}
                        onDone={onDone}
                        onCanceled={onCanceled}
                    />

                    <div>{/* Promo code list */}</div>
                </div>
            </div>
        </div>
    );
};

export default page;
