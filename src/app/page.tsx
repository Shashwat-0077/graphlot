import SocialsButton from "@/features/auth/components/SocialsButton";

export default function Home() {
    return (
        <main className="grid h-dvh place-content-center bg-background text-foreground">
            <h1 className="text-center font-play-write text-4xl text-primary">
                Habit Tracker
            </h1>
            <SocialsButton />
        </main>
    );
}
