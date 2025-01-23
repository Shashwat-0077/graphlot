"use client";

import { usePathname } from "next/navigation";

import { DashboardNavbar } from "@/components/DashboardNavbar";
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
import { decodeFromUrl } from "@/utils/pathSerialization";

// BUG : Their is key error in the blow code, it should be fixed

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    const paramList = pathname
        .split("/")
        .filter((path) => !(!path || path === ""));

    // TODO : Use encoding and decoding of the paths and names for the breadcrumbs
    const breadCrumbs: { path: string; name: string; isLast: boolean }[] =
        paramList.map((path, index) => {
            const pathObj = decodeFromUrl(path);

            return {
                path: "/" + paramList.slice(0, index + 1).join("/"),
                name: (pathObj ? pathObj.name : path)
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
                isLast: index === paramList.length - 1,
            };
        });

    return (
        <SidebarProvider>
            <DashboardNavbar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                                            <>
                                                <BreadcrumbItem key={index}>
                                                    <BreadcrumbLink
                                                        href={breadcrumb.path}
                                                    >
                                                        {breadcrumb.name}
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator
                                                    key={`separator-${index}`}
                                                />
                                            </>
                                        );
                                    }
                                })}
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-primary">
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
                <div className="mx-12 mt-10">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
