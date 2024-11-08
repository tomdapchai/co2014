"use client";
import { getTransactions } from "@/lib/actions/transaction.action";
import React, { useState, useEffect } from "react";

const page = ({ params }: { params: { transactionId: string } }) => {
    const transactionId = params.transactionId;
    const [transactionData, setTransactionData] = useState();

    async function fetchTransactionData() {
        await getTransactions(transactionId).then((res) => {});
        // if payload header has "event paid", show tickets to pay
        // if payload header has advertisement, show advertisement to pay
        // this to determine who gonna be the receiver (event host or admin)
    }

    return <div>page</div>;
};

export default page;
