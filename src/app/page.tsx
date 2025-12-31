import DotGrid from "@/modules/home/pages/dot-grid";
import Hero from "@/modules/home/pages/hero";
import TopBar from "@/modules/home/pages/top-bar";

export default function Home() {
    return (
        <div className="min-h-screen">
            <div className="bg-background relative h-screen w-screen overflow-hidden">
                <DotGrid />
                <TopBar />
                <main className="h-[calc(100vh-76px)]">
                    <Hero />
                </main>
            </div>
        </div>
    );
}
