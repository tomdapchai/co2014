import Footer from "@/components/Footer";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="relative w-full h-full flex flex-col justify-between ">
            <div className="flex min-w-full flex-grow">{children}</div>
            <Toaster />
            <Footer />
        </main>
    );
};

export default layout;
