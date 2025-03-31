import type { Metadata } from "next";
import "./globals.css";

import { QueryProvider } from "@/providers/query-providers";

export const metadata: Metadata = {
    title: "Momentum",
    description:
        "Momentum is a powerful web app that helps you track, visualize, and manage your data effortlessly. With z`seamless Notion integration, you can sync and analyze your Notion databases alongside your personal data. Momentum features interactive charts for deep insights, a habit tracker with vibrant heat-maps to monitor your progress, and a clean, intuitive interface to keep you organized and motivated every step of the way.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="">
            <body className={`antialiased`}>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
