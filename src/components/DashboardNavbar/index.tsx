"use client";

import { useEffect, useState } from "react";
import { MousePointer2, Settings2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/DashboardNavbar/nav-main";
import { NavUser } from "@/components/DashboardNavbar/nav-user";
import { SidebarLogo } from "@/components/DashboardNavbar/SidebarLogo";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

// IMPORTANT: Refer this
// https://ui.shadcn.com/blocks

// This is sample data.
const data = {
    user: {
        name: "Shashwat Gupta",
        email: "shashwat0077@gmail.com",
        avatar: "/avatars/shadcn.jpg",
    },

    navMain: [
        {
            title: "Collections",
            url: "/dashboard/collections",
            icon: <MousePointer2 className="text-primary" />,
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: <Settings2 className="text-primary" />,
        },
    ],
};

export function DashboardNavbar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const supabase = createClient();
    const [user, setUser] = useState<User>({} as User);
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch user data",
                    variant: "destructive",
                });
                return;
            }
            if (!data.user) {
                toast({
                    title: "Error",
                    description: "User not found",
                    variant: "destructive",
                });
                return;
            }
            setUser(data.user);
            setAuthInitialized(true);
            return data.user;
        };
        fetchUser();
    }, [supabase]);

    return (
        <Sidebar collapsible="icon" {...props} className="!border-0">
            <SidebarHeader>
                <SidebarLogo />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} authInitialized={authInitialized} />
            </SidebarFooter>
        </Sidebar>
    );
}
