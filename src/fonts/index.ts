import { Righteous, Ubuntu } from "next/font/google";

// const geistSans = Geist({
//     variable: '--font-geist-sans',
//     subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//     variable: '--font-geist-mono',
//     subsets: ['latin'],
// });

export const righteous = Righteous({
    variable: "--font-righteous",
    weight: ["400"],
    subsets: ["latin"],
});

export const ubuntu = Ubuntu({
    variable: "--font-ubuntu",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    style: ["normal"],
});
