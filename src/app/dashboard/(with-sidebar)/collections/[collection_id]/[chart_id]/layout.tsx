import { ChartStoreProvider } from "@/providers/chart-store-provider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <ChartStoreProvider>{children}</ChartStoreProvider>;
}
