"use client";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGroups = (collectionId: string) => {
    return useQuery({
        queryKey: ["chart-groups", "all"], // Unique cache key
        queryFn: async () => {
            const response = await client.api["chart-groups"]["all"].$get({
                query: { collectionId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart groups");
            }
            const { groups } = await response.json();
            return groups;
        },
        enabled: !!collectionId,
    });
};

export const useGroupById = (groupId: string) => {
    return useQuery({
        queryKey: ["chart-groups", groupId], // Unique cache key
        queryFn: async () => {
            const response = await client.api["chart-groups"][":groupId"].$get({
                param: { groupId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart group");
            }
            const { group } = await response.json();
            return group;
        },
        enabled: !!groupId,
    });
};
