import DotGrid from '@/pages-components/home/dot-grid';
import Hero from '@/pages-components/home/hero';
import TopBar from '@/pages-components/home/top-bar';

export default function Home() {
    return (
        <div className="min-h-screen">
            <div className="relative h-screen w-screen overflow-hidden bg-background">
                <DotGrid />
                <TopBar />
                <main className="h-[calc(100vh-76px)]">
                    <Hero />
                </main>
            </div>
        </div>
    );
}
