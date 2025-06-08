import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useRadarChart = (id: string) => {
    return useQuery({
        queryKey: ["radar-chart", id],
        queryFn: async () => {
            const response = await client.api["radar-chart"][":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch radar chart");
            }

            const data = await response.json();
            return data.chart;
        },
        enabled: !!id, // Avoid unnecessary requests
    });
};

export const useFullRadarChart = (id: string) => {
    return useQuery({
        queryKey: ["full-radar-chart", id], // Unique cache key
        queryFn: async () => {
            const response = await client.api["radar-chart"][":id"][
                "full"
            ].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch full radar chart");
            }

            const data = await response.json();
            return data.chart;
        },
        enabled: !!id, // Avoid unnecessary requests
    });
};
