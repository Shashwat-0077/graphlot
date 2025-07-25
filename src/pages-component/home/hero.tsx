import { righteous } from '@/fonts';
import { GoogleButton, NotionButton } from '@/modules/auth/components/SocialsButtons';

const Hero = () => {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Main content */}
            <div className="flex flex-col justify-center h-full w-full px-4 max-w-6xl mx-auto relative z-10">
                <div className="space-y-6 text-center">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full text-primary text-sm font-medium mb-4 border border-primary/20">
                        ✨ Visualize data like never before
                    </div>

                    <h1
                        className={`${righteous.className} text-5xl md:text-7xl lg:text-8xl font-bold text-center leading-tight`}
                    >
                        <span className="text-foreground">Customize your charts</span>
                        <br />
                        <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            to the last pixel
                        </span>
                    </h1>

                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                        Create beautiful, interactive, and fully customizable charts for your data visualization needs.
                        <span className="text-primary/80"> Made by Shashwat with ❤️</span>
                    </p>

                    <div className="flex flex-row gap-3 justify-center sm:w-52 w-48 mx-auto pt-4">
                        <GoogleButton />
                        <NotionButton />
                    </div>

                    <div className="pt-6 text-sm text-muted-foreground/80 flex items-center justify-center gap-2">
                        <div className="flex -space-x-2">
                            <div className="w-5 h-5 bg-primary/20 rounded-full border-2 border-background"></div>
                            <div className="w-5 h-5 bg-primary/30 rounded-full border-2 border-background"></div>
                            <div className="w-5 h-5 bg-primary/40 rounded-full border-2 border-background"></div>
                        </div>
                        Join 1+ data enthusiasts already using Graphlot
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
