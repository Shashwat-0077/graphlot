import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { ColumnType, DATABASE_NOTION, DATABASE_UPLOAD } from "@/constants";

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

export const useChartSchema = ({
    chartId,
    userId,
}: {
    chartId: string;
    userId?: string;
}) => {
    return useQuery({
        queryKey: ["chart-table-schema", chartId],
        queryFn: async () => {
            if (!userId) {
                throw new Error("user_id is required");
            }

            const response = await client.api["charts"][":id"][
                "get-table-schema"
            ].$get({
                param: { id: chartId },
                query: { userId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart data columns");
            }
            const data = await response.json();
            return data;
        },
        enabled: !!chartId && !!userId,
    });
};

export const useChartColumns = ({
    chartId,
    userId,
}: {
    chartId: string;
    userId?: string;
}) => {
    const columns: ColumnType = {
        Status: [],
        Select: [],
        "Multi Select": [],
        Number: [],
        Date: [],
    };

    const { data, isLoading, error } = useChartSchema({ chartId, userId });

    if (isLoading || !data) {
        return { columns, isLoading, error: null };
    }

    if (error) {
        return { columns, isLoading: false, error };
    }

    switch (data.databaseProvider) {
        case DATABASE_NOTION:
            Object.entries(data.schema).forEach(([key, value]) => {
                if (value.type === "status") {
                    columns.Status.push(key);
                } else if (value.type === "select") {
                    columns.Select.push(key);
                } else if (value.type === "multi_select") {
                    columns["Multi Select"].push(key);
                } else if (value.type === "number") {
                    columns.Number.push(key);
                } else if (value.type === "date") {
                    columns.Date.push(key);
                }
            });
            break;
        case DATABASE_UPLOAD:
            break;
    }

    return { columns, isLoading: false, error: null };
};

export const useChartData = ({
    chartId,
    userId,
}: {
    chartId: string;
    userId?: string;
}) => {
    return useQuery({
        queryKey: ["chart-table-data", chartId],
        queryFn: async () => {
            if (!userId) {
                throw new Error("user_id is required");
            }

            const response = await client.api["charts"][":id"][
                "get-table-data"
            ].$get({
                param: { id: chartId },
                query: { userId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart data");
            }

            const data = await response.json();
            return data.data;
        },
        enabled: !!chartId && !!userId,
    });
};
