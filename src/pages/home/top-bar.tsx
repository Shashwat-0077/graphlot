import Image from 'next/image';

import { Button } from '@/components/ui/button';

const TopBar = () => {
    return (
        <div className="grid grid-cols-3 p-4">
            <Image
                src="/logo.svg"
                alt="Graphlot Logo"
                width={50}
                height={50}
                className="self-center justify-self-start"
            />
            <Image
                src="/full-logo.svg"
                alt="Graphlot Logo Text"
                width={200}
                height={50}
                className="self-center justify-self-center"
            />
            <div className="flex self-center justify-self-end gap-2">
                <Button
                    variant="outline"
                    className="cursor-pointer"
                >
                    Login
                </Button>
                <Button className="cursor-pointer">Register</Button>
            </div>
        </div>
    );
};

export default TopBar;
