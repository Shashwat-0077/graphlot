import { useMemo } from "react";

import { useGetDatabaseSchema } from "@/modules/notion/api/client/useGetDatabaseSchema";
import { useGetTableData } from "@/modules/notion/api/client/useGetTableData";
import { processNotionData } from "@/modules/notion/utils/processData";
import { SortOptionsType } from "@/constants";
import { sortDataAndConfig } from "@/modules/notion/utils/sortData";

export const useGetProcessData = ({
    user_id,
    notion_table_id,
    x_axis,
    y_axis,
    sort_x,
    sort_y,
}: {
    user_id: string;
    notion_table_id: string;
    x_axis: string | null;
    y_axis: string | null;
    sort_x: SortOptionsType;
    sort_y: SortOptionsType;
}) => {
    const { data: schema, isLoading: schemaLoading } = useGetDatabaseSchema({
        notion_table_id,
        user_id,
    });
    const {
        data: tableData,
        error,
        isLoading: dataLoading,
    } = useGetTableData({ notion_table_id, user_id });

    const { config, data } = useMemo(() => {
        if (!schema || !y_axis || !x_axis || !tableData || !tableData.data) {
            return { config: [], data: [] };
        }
        const { config, data } = processNotionData(schema, tableData?.data, {
            xAxis: x_axis,
            yAxis: y_axis,
        });

        return { config, data };
    }, [schema, y_axis, x_axis, tableData]);

    const { sortedData, sortedConfig } = useMemo(() => {
        return sortDataAndConfig(config, data, sort_x, sort_y);
    }, [config, data, sort_x, sort_y]);

    return {
        isLoading: schemaLoading || dataLoading,
        data: sortedData,
        config: sortedConfig,
        error,
        schema,
    };
};
