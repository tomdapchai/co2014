import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";
import { Product } from "@/types";
import Image from "next/image";

type CheckoutProps = {
    products: Product[];
    paymentType: "ticket" | "advertisement";
    receiverInfo: {
        name: string;
        accountNumber: string;
        bankName: string;
    };
};

const CheckoutCard = ({
    products = [{ name: "General Admission", price: 50, quantity: 2 }],
    paymentType = "ticket",
    receiverInfo = {
        name: "Event Organizer Inc.",
        accountNumber: "1234567890",
        bankName: "Global Bank",
    },
}: CheckoutProps) => {
    const total = products.reduce(
        (sum, product) => sum + product.price * (product.quantity || 1),
        0
    );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <div>
                            <CardTitle className="text-2xl">Checkout</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {paymentType === "ticket"
                                    ? "Ticket Purchase"
                                    : "Advertisement Payment"}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {products.map((product, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">
                                        {product.name}
                                    </p>
                                    {paymentType === "ticket" &&
                                        product.quantity && (
                                            <p className="text-sm text-muted-foreground">
                                                Quantity: {product.quantity}
                                            </p>
                                        )}
                                    {paymentType === "advertisement" &&
                                        product.duration && (
                                            <p className="text-sm text-muted-foreground">
                                                Duration: {product.duration}
                                            </p>
                                        )}
                                </div>
                                <p className="font-medium">
                                    ${product.price.toFixed(2)}
                                    {product.quantity &&
                                        ` x ${product.quantity}`}
                                </p>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between items-center font-bold">
                            <p>Total</p>
                            <p>${total.toFixed(2)}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-start space-y-4">
                    <div className="w-full">
                        <h3 className="font-semibold mb-2">Payment Details</h3>
                        <div className="bg-muted p-4 rounded-md space-y-2">
                            <p>
                                <span className="font-medium">Receiver:</span>{" "}
                                {receiverInfo.name}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Account Number:
                                </span>{" "}
                                {receiverInfo.accountNumber}
                            </p>
                            <p>
                                <span className="font-medium">Bank:</span>{" "}
                                {receiverInfo.bankName}
                            </p>
                        </div>
                    </div>
                    <Button className="w-full">
                        <CreditCard className="mr-2 h-4 w-4" /> Proceed to
                        Payment
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CheckoutCard;
