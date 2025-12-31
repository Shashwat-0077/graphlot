"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { parseSlug } from "@/utils";
import { DashboardNavbar } from "@/components/dashboard-navbar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    const paramList = pathname
        ? pathname.split("/").filter((path) => !(!path || path === ""))
        : [];

    const breadCrumbs: { path: string; name: string; isLast: boolean }[] =
        paramList.map((path, index) => {
            const slug = parseSlug(path);

            return {
                path: "/" + paramList.slice(0, index + 1).join("/"),
                name: (slug.name || path)
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
                isLast: index === paramList.length - 1,
            };
        });

    return (
        <SidebarProvider>
            <DashboardNavbar />
            <SidebarInset className="from-background to-background/95 bg-linear-to-br">
                <header className="bg-background/80 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />

                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadCrumbs.map((breadcrumb, index) => {
                                    if (!breadcrumb.isLast) {
                                        return (
                                            <Fragment key={index}>
                                                <BreadcrumbItem>
                                                    <BreadcrumbLink
                                                        href={breadcrumb.path}
                                                    >
                                                        {breadcrumb.name}
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator />
                                            </Fragment>
                                        );
                                    }
                                    return null;
                                })}
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-primary font-medium">
                                        {
                                            breadCrumbs[breadCrumbs.length - 1]
                                                .name
                                        }
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="container mx-auto min-h-[calc(100vh-4rem)] px-4 py-8">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
