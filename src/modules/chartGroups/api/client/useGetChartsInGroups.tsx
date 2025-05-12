"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetChartsInGroups = (group_id: string) => {
    return useQuery({
        queryKey: ["chart-groups", group_id, "charts"], // Unique cache key
        queryFn: async () => {
            const response = await client.api["chart-groups"][
                ":group_id"
            ].charts.$get({
                param: { group_id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts in group");
            }
            const { charts } = await response.json();
            return charts;
        },
        enabled: !!group_id,
    });
};

export const useGetFullChartsInGroups = (group_id: string) => {
    return useQuery({
        queryKey: ["chart-groups", group_id, "charts", "full"], // Unique cache key
        queryFn: async () => {
            const response = await client.api["chart-groups"][
                ":group_id"
            ].charts.full.$get({
                param: { group_id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts in group");
            }
            const { charts } = await response.json();
            return charts;
        },
        enabled: !!group_id,
    });
};
