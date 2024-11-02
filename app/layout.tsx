import type { Metadata } from "next";
import AuthProvider from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
    title: "LAMBO",
    description: "Clone of lu.ma",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="no-scrollbar">
            <AuthProvider>
                <body className="">{children}</body>
            </AuthProvider>
        </html>
    );
}
