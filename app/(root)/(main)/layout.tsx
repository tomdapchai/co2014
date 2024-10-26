import React from "react";
import Header from "@/components/Header";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="relative w-full h-full flex flex-col">
            <Header />
            <div className="w-full h-full flex justify-center items-start">
                {children}
            </div>
        </main>
    );
};

export default layout;
