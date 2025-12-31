import { headers } from "next/headers";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { righteous } from "@/fonts";
import { auth } from "@/modules/auth";
import {
    GoogleButton,
    NotionButton,
} from "@/modules/auth/components/SocialsButtons";

const Hero = async () => {
    const sessionResult = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Main content */}
            <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-4">
                <div className="space-y-6 text-center">
                    <div className="bg-primary/10 text-primary border-primary/20 mb-4 inline-block rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                        ✨ Visualize data like never before
                    </div>

                    <h1
                        className={`${righteous.className} text-center text-5xl leading-tight font-bold md:text-7xl lg:text-8xl`}
                    >
                        <span className="text-foreground">
                            Customize your charts
                        </span>
                        <br />
                        <span className="from-primary to-primary/80 bg-linear-to-r bg-clip-text text-transparent">
                            to the last pixel
                        </span>
                    </h1>

                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
                        Create beautiful, interactive, and fully customizable
                        charts for your data visualization needs.
                        <span className="text-primary/80">
                            {" "}
                            Made by Shashwat with ❤️
                        </span>
                    </p>
                    <div className="mx-auto flex w-48 flex-row justify-center gap-3 pt-4 sm:w-52">
                        {sessionResult ? (
                            <>
                                <Link
                                    className="group relative h-10 w-full cursor-pointer overflow-hidden rounded-lg border border-gray-200/50 bg-white/90 px-4 py-2 text-sm font-medium text-gray-900 shadow-md backdrop-blur-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-white hover:shadow-lg"
                                    href="/dashboard"
                                >
                                    <div className="relative flex items-center justify-center gap-2">
                                        <p>Go to Dashboard</p>

                                        <ArrowUpRight />
                                    </div>
                                </Link>
                            </>
                        ) : (
                            <>
                                <GoogleButton />
                                <NotionButton />
                            </>
                        )}
                    </div>
                    <div className="text-muted-foreground/80 flex items-center justify-center gap-2 pt-6 text-sm">
                        <div className="flex -space-x-2">
                            <div className="bg-primary/20 border-background h-5 w-5 rounded-full border-2"></div>
                            <div className="bg-primary/30 border-background h-5 w-5 rounded-full border-2"></div>
                            <div className="bg-primary/40 border-background h-5 w-5 rounded-full border-2"></div>
                        </div>
                        Join 1+ data enthusiasts already using Graphlot
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
