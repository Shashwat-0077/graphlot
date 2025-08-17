import { useMemo, useRef } from "react";

import { DATABASE_NOTION, DATABASE_UPLOAD, SortType } from "@/constants";
import {
    useGetChartTableData,
    useGetChartTableSchema,
} from "@/modules/chart-attributes/api/client";
import { processNotionData, sortDataAndConfig } from "@/utils";

export const useProcessData = ({
    userId,
    chartId,
    xAxis,
    yAxis,
    sortX,
    sortY,
}: {
    userId: string;
    chartId: string;
    xAxis: string | null;
    yAxis: string | null;
    sortX: SortType;
    sortY: SortType;
}) => {
    const error = useRef<Error | null>(null);

    const {
        data: chartSchema,
        isLoading: schemaLoading,
        error: schemaError,
    } = useGetChartTableSchema({
        params: { id: chartId },
        query: { userId },
    });
    const {
        data: tableData,
        error: dataError,
        isLoading: dataLoading,
    } = useGetChartTableData({
        params: { id: chartId },
        query: { userId },
    });

    const { config, data } = useMemo(() => {
        if (!chartSchema || !yAxis || !xAxis || !tableData) {
            return { config: [], data: [] };
        }

        switch (chartSchema.databaseProvider) {
            case DATABASE_NOTION:
                return processNotionData(chartSchema.schema, tableData, {
                    xAxis: xAxis,
                    yAxis: yAxis,
                });
            case DATABASE_UPLOAD:
                // Handle the case for uploaded data if needed
                return { config: [], data: [] };
            default:
                error.current = new Error(`Unsupported database`);
                return { config: [], data: [] };
        }
    }, [chartSchema, yAxis, xAxis, tableData]);

    const { sortedData, sortedConfig } = useMemo(() => {
        return sortDataAndConfig(config, data, sortX, sortY);
    }, [config, data, sortX, sortY]);

    return {
        isLoading: schemaLoading || dataLoading,
        data: sortedData,
        config: sortedConfig,
        error: schemaError || dataError || error.current,
    };
};
