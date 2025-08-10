import DotGrid from "@/page-components/home/dot-grid";
import Hero from "@/page-components/home/hero";
import TopBar from "@/page-components/home/top-bar";

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
