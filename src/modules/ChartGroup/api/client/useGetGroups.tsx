"use client";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { ChartGroupSelect } from "@/modules/chartGroups/schema";

export const useGetAllGroups = (collection_id: string) => {
    return useQuery({
        queryKey: ["chart-groups", "all"], // Unique cache key
        queryFn: async () => {
            const response = await client.api["chart-groups"]["all"].$get({
                query: { collection_id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart groups");
            }
            const { groups } = await response.json();
            return groups as unknown[] as ChartGroupSelect[];
        },
        enabled: !!collection_id,
    });
};

export const useGetGroupWithId = (group_id: string) => {
    return useQuery({
        queryKey: ["chart-groups", group_id], // Unique cache key
        queryFn: async () => {
            const response = await client.api["chart-groups"][":group_id"].$get(
                {
                    param: { group_id },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch chart group");
            }
            const { group } = await response.json();
            return group as unknown as ChartGroupSelect;
        },
        enabled: !!group_id,
    });
};
