import { useMemo, useRef } from "react";

import { processNotionData } from "@/modules/notion/utils/process-data";
import { DATABASE_NOTION, DATABASE_UPLOAD, SortType } from "@/constants";
import { sortDataAndConfig } from "@/modules/notion/utils/sort-data";
import {
    useChartData,
    useChartSchema,
} from "@/modules/Chart/api/client/use-chart";

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
    } = useChartSchema({
        chartId: chartId,
        userId: userId,
    });
    const {
        data: tableData,
        error: dataError,
        isLoading: dataLoading,
    } = useChartData({ chartId: chartId, userId: userId });

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
