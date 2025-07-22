import { ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { righteous } from '@/fonts';

const Hero = () => {
    return (
        <div className="grid place-content-center text-center min-h-[80vh] px-4">
            <h1 className={`${righteous.className} text-4xl md:text-8xl font-bold text-center mb-10`}>
                <span className="text-white">Customize your charts</span>
                <br />
                <span className="text-primary">to the last pixel</span>
            </h1>
            <p className="text-white mb-6">Made by Shashwat with ❤️</p>
            <Button className="py-6 cursor-pointer w-xs justify-self-center flex items-center">
                <p>Create your first chart</p>
                <ArrowUpRight />
            </Button>
        </div>
    );
};

export default Hero;
