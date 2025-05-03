import { NotionSchemaType } from "@/constants";

export type XAxisType = {
    Status: string[];
    Select: string[];
    "Multi Select": string[];
};
export type YAxisType = {
    Count: string[];
    Status: string[];
    Select: string[];
    "Multi Select": string[];
};

export const SelectFieldsForRadar = (data: NotionSchemaType) => {
    const XAxis: XAxisType = {
        Status: [],
        Select: [],
        "Multi Select": [],
    };

    const YAxis: YAxisType = {
        Count: ["count"],
        Status: [],
        Select: [],
        "Multi Select": [],
    };

    Object.entries(data).forEach(([key, value]) => {
        if (value.type === "status") {
            XAxis.Status.push(key);
            YAxis.Status.push(key);
        } else if (value.type === "select") {
            XAxis.Select.push(key);
            YAxis.Select.push(key);
        } else if (value.type === "multi_select") {
            XAxis["Multi Select"].push(key);
            YAxis["Multi Select"].push(key);
        }
        // else if (value.type === "number") {
        //     XAxis.Number.push(key);
        // }
    });

    return {
        XAxisColumns: XAxis,
        YAxisColumns: YAxis,
    };
};
