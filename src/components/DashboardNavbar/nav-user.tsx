"use client";
import { User } from "@supabase/supabase-js";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export function NavUser({
    user,
    authInitialized,
}: {
    user: User;
    authInitialized: boolean;
}) {
    const router = useRouter();
    const profileImage = user.user_metadata?.avatar_url;
    const name = user.user_metadata?.full_name;
    const email = user.user_metadata?.email;
    const { isMobile } = useSidebar();

    const handleLogout = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast({
                title: "Error",
                description: "Failed to log out",
                variant: "destructive",
            });
            return;
        }
        toast({
            title: "Success",
            description: "Logged out successfully",
            variant: "default",
        });
        router.push("/");
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {!authInitialized ? (
                    <Skeleton className="mb-2 h-8 w-full rounded-lg bg-sidebar-accent" />
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={profileImage}
                                        alt={name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {name.charAt(0).toUpperCase()}
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
                                <ChevronsUpDown className="ml-auto size-4" />
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
                                            src={profileImage}
                                            alt={name}
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            {name.charAt(0).toUpperCase()}
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
                                    handleLogout();
                                }}
                            >
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
