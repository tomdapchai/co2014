import Footer from "@/components/Footer";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="relative w-full h-full flex flex-col justify-between">
            <div className="flex min-w-full flex-grow pb-6">{children}</div>

            <Footer />
        </main>
    );
};

export default layout;
