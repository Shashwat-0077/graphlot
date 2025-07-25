'use client';

import * as React from 'react';
import Image from 'next/image';

import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/utils';

export function SidebarLogo() {
    const { open } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem
                className={cn('grid place-content-center transition-all duration-300', open ? 'my-7' : 'mb-5 mt-1')}
            >
                <Image
                    width={70}
                    height={70}
                    src={'/logo.svg'}
                    alt="logo"
                    priority
                />
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
