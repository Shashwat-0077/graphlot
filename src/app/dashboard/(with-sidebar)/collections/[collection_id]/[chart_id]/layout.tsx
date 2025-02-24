import { RadarChartStoreProvider } from "@/modules/charts/Radar/state/provider/radar-chart-store-provider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <RadarChartStoreProvider>{children}</RadarChartStoreProvider>;
}
