"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useChartsInGroups = (groupId: string) => {
    return useQuery({
        queryKey: ["chart-groups", groupId, "charts"], // Unique cache key
        queryFn: async () => {
            const response = await client.api["chart-groups"][
                ":groupId"
            ].charts.$get({
                param: { groupId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts in group");
            }
            const { charts } = await response.json();
            return charts;
        },
        enabled: !!groupId,
    });
};

export const useFullChartsInGroups = (groupId: string) => {
    return useQuery({
        queryKey: ["chart-groups", groupId, "charts", "full"], // Unique cache key
        queryFn: async () => {
            const response = await client.api["chart-groups"][
                ":groupId"
            ].charts.full.$get({
                param: { groupId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts in group");
            }
            const { charts } = await response.json();
            return charts;
        },
        enabled: !!groupId,
    });
};
