import Hero from '@/pages/home/hero';
import TopBar from '@/pages/home/top-bar';

export default function Home() {
    return (
        <div className="min-h-screen">
            <TopBar />
            <Hero />
        </div>
    );
}
