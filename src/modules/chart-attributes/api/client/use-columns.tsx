import { ColumnType, DATABASE_NOTION, DATABASE_UPLOAD } from "@/constants";
import { useGetChartTableSchema } from "@/modules/chart-attributes/api/client/auto-gen";

export const useChartColumns = ({
    chartId,
    userId,
}: {
    chartId: string;
    userId: string;
}) => {
    const columns: ColumnType = {
        Status: [],
        Select: [],
        "Multi Select": [],
        Number: [],
        Date: [],
    };

    const { data, isLoading, error } = useGetChartTableSchema({
        params: { id: chartId },
        query: { userId: userId },
    });

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
