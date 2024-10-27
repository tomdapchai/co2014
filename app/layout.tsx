import type { Metadata } from "next";

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
        <html lang="en">
            <body className="">{children}</body>
        </html>
    );
}
