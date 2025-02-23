"use client";

import * as React from "react";
import { MousePointer2, Settings2 } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/DashboardNavbar/nav-main";
import { NavUser } from "@/components/DashboardNavbar/nav-user";
import { SidebarLogo } from "@/components/DashboardNavbar/SidebarLogo";

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
    return (
        <Sidebar collapsible="icon" {...props} className="!border-0">
            <SidebarHeader>
                <SidebarLogo />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
