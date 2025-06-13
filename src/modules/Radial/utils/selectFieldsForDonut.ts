import { ColumnType } from "@/constants";

export const SelectFieldsForRadial = (data: ColumnType) => {
    return {
        Status: data.Status,
        Select: data.Select,
        "Multi Select": data["Multi Select"],
    };
};
