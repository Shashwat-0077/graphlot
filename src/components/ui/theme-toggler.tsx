'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ThemeToggler = () => {
    const { setTheme, theme } = useTheme();

    const currentIcon = {
        light: <Sun className="h-4 w-4 text-yellow-500" />,
        dark: <Moon className="h-4 w-4 text-blue-400" />,
        system: <Laptop2 className="h-4 w-4" />,
    }[theme ?? 'system'];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-9 h-9 border border-border/40"
                >
                    {currentIcon}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="animate-in fade-in-50 zoom-in-95"
            >
                <DropdownMenuItem
                    onClick={() => setTheme('light')}
                    className="cursor-pointer"
                >
                    <Sun className="mr-2 h-4 w-4 text-yellow-500" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme('dark')}
                    className="cursor-pointer"
                >
                    <Moon className="mr-2 h-4 w-4 text-blue-400" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme('system')}
                    className="cursor-pointer"
                >
                    <Laptop2 className="mr-2 h-4 w-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ThemeToggler;
