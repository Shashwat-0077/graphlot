import MainBackground from "@/components/MainBackground";
import SocialsButton from "@/features/auth/components/SocialsButton";

export default function Home({
    params,
    searchParams,
}: {
    params: { code: string };
    searchParams: { code: string };
}) {
    console.log(params, searchParams);

    return (
        <main className="grid h-dvh place-content-center overflow-hidden bg-background text-foreground">
            <MainBackground />
            <h1 className="z-50 text-center font-play-write text-4xl text-primary">
                Momentum
            </h1>
            <SocialsButton />
        </main>
    );
}
