"use client";

import { MousePointer2, Settings2, LayoutDashboard } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/DashboardNavbar/nav-main";
import { NavUser } from "@/components/DashboardNavbar/nav-user";
import { SidebarLogo } from "@/components/DashboardNavbar/SidebarLogo";

// This is sample data.
const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: <LayoutDashboard className="text-primary" />,
        },
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
        <Sidebar collapsible="icon" {...props} className="!border-0 shadow-sm">
            <SidebarHeader>
                <SidebarLogo />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
