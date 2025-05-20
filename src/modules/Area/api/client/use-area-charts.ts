import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useAreaChart = (id: string) => {
    return useQuery({
        queryKey: ["area-chart", id], // Unique cache key
        queryFn: async () => {
            const response = await client.api["area-chart"][":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart");
            }
            const data = await response.json();
            return data.chart;
        },
        enabled: !!id, // Avoid unnecessary requests
    });
};

export const useFullAreaChart = (id: string) => {
    return useQuery({
        queryKey: ["full-area-chart", id], // Unique cache key
        queryFn: async () => {
            const response = await client.api["area-chart"][":id"]["full"].$get(
                {
                    param: { id },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch chart");
            }
            const data = await response.json();
            return data.chart;
        },
        enabled: !!id, // Avoid unnecessary requests
    });
};
