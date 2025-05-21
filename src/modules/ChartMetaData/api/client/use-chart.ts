import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useChartMetadataById = (id: string) => {
    return useQuery({
        queryKey: ["chart-metadata", id],
        queryFn: async () => {
            const response = await client.api["charts"][":id"].$get({
                param: { id },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch chart metadata");
            }
            const data = await response.json();
            return data.chart;
        },
        enabled: !!id,
    });
};

export const useChartMetadataByCollection = (collectionId: string) => {
    return useQuery({
        queryKey: ["chart-metadata-collection", collectionId],
        queryFn: async () => {
            const response = await client.api["charts"].all.$get({
                query: { collection_id: collectionId },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch charts for collection");
            }
            const data = await response.json();
            return data.charts;
        },
        enabled: !!collectionId,
    });
};

export const useFullChart = (id: string) => {
    return useQuery({
        queryKey: ["full-chart-metadata", id],
        queryFn: async () => {
            const response = await client.api["charts"][":id"]["full"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch full chart metadata");
            }

            const data = await response.json();
            return data.chart;
        },
        enabled: !!id,
    });
};

export const useChartProperties = (id: string) => {
    return useQuery({
        queryKey: ["chart-properties", id],
        queryFn: async () => {
            const response = await client.api["charts"][":id"][
                "properties"
            ].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart properties");
            }

            const { properties } = await response.json();
            return properties;
        },
        enabled: !!id,
    });
};
