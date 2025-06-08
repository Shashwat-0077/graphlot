import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useBarChart = (id: string) => {
    return useQuery({
        queryKey: ["bar-chart", id], // Unique cache key
        queryFn: async () => {
            const response = await client.api["bar-chart"][":id"].$get({
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

export const useFullBarChart = (id: string) => {
    return useQuery({
        queryKey: ["full-bar-chart", id], // Unique cache key
        queryFn: async () => {
            const response = await client.api["bar-chart"][":id"]["full"].$get({
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
