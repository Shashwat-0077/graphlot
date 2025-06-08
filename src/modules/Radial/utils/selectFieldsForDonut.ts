import { NotionPropertySchema } from "@/constants";

export type XAxisType = {
    Status: string[];
    Select: string[];
    "Multi Select": string[];
};

export const SelectFieldsForDonut = (data: NotionPropertySchema) => {
    const XAxis: XAxisType = {
        Status: [],
        Select: [],
        "Multi Select": [],
    };

    Object.entries(data).forEach(([key, value]) => {
        if (value.type === "status") {
            XAxis.Status.push(key);
        } else if (value.type === "select") {
            XAxis.Select.push(key);
        } else if (value.type === "multi_select") {
            XAxis["Multi Select"].push(key);
        }
    });

    return {
        XAxisColumns: XAxis,
    };
};
