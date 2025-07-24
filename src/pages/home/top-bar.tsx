import Image from 'next/image';

import ThemeToggler from '@/components/ui/theme-toggler';

const TopBar = () => {
    return (
        <div className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <Image
                    src="/logo.svg"
                    alt="Graphlot Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                />
            </div>

            <Image
                src="/full-logo.svg"
                alt="Graphlot Logo Text"
                width={200}
                height={50}
                className="hidden md:block"
            />

            <div className="flex items-center gap-4">
                <ThemeToggler />
            </div>
        </div>
    );
};

export default TopBar;
