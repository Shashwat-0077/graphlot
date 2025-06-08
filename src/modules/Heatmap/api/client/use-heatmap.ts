import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useHeatmap = (id: string) => {
    return useQuery({
        queryKey: ["heatmap-chart", id],
        queryFn: async () => {
            const response = await client.api["heatmap-chart"][":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch heatmap chart");
            }

            const data = await response.json();
            return data.chart;
        },
        enabled: !!id,
    });
};

export const useFullHeatmap = (id: string) => {
    return useQuery({
        queryKey: ["full-heatmap-chart", id],
        queryFn: async () => {
            const response = await client.api["heatmap-chart"][":id"][
                "full"
            ].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch full heatmap chart");
            }

            const data = await response.json();
            return data.chart;
        },
        enabled: !!id,
    });
};
