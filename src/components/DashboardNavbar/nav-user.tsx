"use client";

import { ChevronRight, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthSession } from "@/hooks/use-auth-session";

export function NavUser() {
    const { isMobile } = useSidebar();
    const { session: userData, isLoading } = useAuthSession();

    if (isLoading) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <Skeleton className="mb-2 h-8 w-full rounded-lg bg-sidebar-accent" />
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    if (!userData) {
        return null;
    }
    if (!userData.user) {
        return null;
    }

    const { name, email, image: profileImage } = userData.user;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={profileImage ?? undefined}
                                    alt={name ?? undefined}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {name && name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {name}
                                </span>
                                <span className="truncate text-xs">
                                    {email}
                                </span>
                            </div>
                            <ChevronRight className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={profileImage ?? undefined}
                                        alt={name ?? undefined}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {name && name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                signOut();
                            }}
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
