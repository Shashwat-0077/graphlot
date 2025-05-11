import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetChartWithId = (chart_id: string) => {
    return useQuery({
        queryKey: ["chart", chart_id], // Unique cache key
        queryFn: async () => {
            const response = await client.api.charts[":chart_id"].$get({
                param: { chart_id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart");
            }
            const data = await response.json();
            return data;
        },
        enabled: !!chart_id, // Avoid unnecessary requests
    });
};

export const useGetAllChartsWithCollectionId = (collection_id: string) => {
    return useQuery({
        queryKey: ["charts", collection_id], // Unique cache key
        queryFn: async () => {
            const response = await client.api.charts["all"].$get({
                query: { collection_id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts");
            }

            const data = await response.json();
            return data.charts;
        },
        enabled: !!collection_id, // Avoid unnecessary requests
    });
};
