import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type SchemaType = InferResponseType<
    (typeof client.api.notion)[":notion_table_id"]["get-table-schema"]["$get"],
    200
>["schema"];

type DataType = InferResponseType<
    (typeof client.api.notion)[":notion_table_id"]["get-table-data"]["$get"],
    200
>["data"];

type ReturnType = {
    radarChartConfig: string[];
    radarChartData: ({ class: string } & { [key: string]: number })[];
};

export function processChartData(
    data: DataType,
    schema: SchemaType,
    XAxis: string,
    YAxis: string
): ReturnType {
    const XAxisDetails = schema[XAxis];
    const YAxisDetails = schema[YAxis];

    if (!XAxisDetails) {
        throw new Error("Invalid Schema");
    }

    if (!(YAxisDetails || YAxis === "count")) {
        throw new Error("Invalid Schema");
    }

    // Handle case where YAxis is "count"
    const isYAxisCount = YAxis === "count";

    let radarChartConfig: ReturnType["radarChartConfig"] = [];
    if (!isYAxisCount) {
        if (YAxisDetails.type === "status") {
            radarChartConfig = YAxisDetails.status.options.map((option) =>
                option.name.toLowerCase()
            );
        } else if (YAxisDetails.type === "select") {
            radarChartConfig = YAxisDetails.select.options.map((option) =>
                option.name.toLowerCase()
            );
        } else if (YAxisDetails.type === "multi_select") {
            radarChartConfig = YAxisDetails.multi_select.options.map((option) =>
                option.name.toLowerCase()
            );
        } else {
            throw new Error("Invalid YAxis Type");
        }
    } else {
        // If YAxis is "count", set the config to a single value "count"
        radarChartConfig = ["count"];
    }

    const xValues = new Set<string>();

    for (const entry of data) {
        const xVal = entry[XAxis];

        if (xVal.type === "status" && xVal?.status?.name) {
            xValues.add(xVal.status.name.toLowerCase());
        } else if (xVal.type === "select" && xVal?.select?.name) {
            xValues.add(xVal.select.name.toLowerCase());
        } else if (xVal.type === "multi_select" && xVal?.multi_select) {
            xVal.multi_select.forEach((option) =>
                xValues.add(option.name.toLowerCase())
            );
        }
    }

    const counts = new Map<string, Map<string, number>>();
    for (const xVal of xValues) {
        counts.set(xVal, new Map<string, number>());
        for (const yVal of radarChartConfig) {
            counts.get(xVal)!.set(yVal.toLowerCase(), 0);
        }
    }

    for (const entry of data) {
        const xVal = entry[XAxis];
        const yVal = entry[YAxis];

        let xValName: string = "";
        if (xVal.type === "status" && xVal.status?.name) {
            xValName = xVal.status.name.toLowerCase();
        } else if (xVal.type === "select" && xVal.select?.name) {
            xValName = xVal.select.name.toLowerCase();
        } else if (xVal.type === "multi_select" && xVal.multi_select) {
            xVal.multi_select.forEach((option) => {
                xValName = option.name.toLowerCase();
                if (xValName && counts.has(xValName)) {
                    if (isYAxisCount) {
                        // If YAxis is "count", increment the count for the XAxis value
                        counts
                            .get(xValName)!
                            .set(
                                "count",
                                counts.get(xValName)!.get("count")! + 1
                            );
                    } else {
                        let yValName: string | undefined;
                        if (yVal.type === "status" && yVal.status?.name) {
                            yValName = yVal.status.name.toLowerCase();
                        } else if (
                            yVal.type === "select" &&
                            yVal.select?.name
                        ) {
                            yValName = yVal.select.name.toLowerCase();
                        } else if (
                            yVal.type === "multi_select" &&
                            yVal.multi_select
                        ) {
                            yVal.multi_select.forEach((opt) => {
                                yValName = opt.name.toLowerCase();
                                if (
                                    yValName &&
                                    counts.get(xValName)!.has(yValName)
                                ) {
                                    counts
                                        .get(xValName)!
                                        .set(
                                            yValName,
                                            counts
                                                .get(xValName)!
                                                .get(yValName)! + 1
                                        );
                                }
                            });
                            return; // Skip to the next option after processing multi_select
                        }

                        if (yValName && counts.get(xValName)!.has(yValName)) {
                            counts
                                .get(xValName)!
                                .set(
                                    yValName,
                                    counts.get(xValName)!.get(yValName)! + 1
                                );
                        }
                    }
                }
            });
            continue; // Skip to the next entry after processing multi_select
        }

        if (isYAxisCount) {
            // If YAxis is "count", increment the count for the XAxis value
            if (counts.has(xValName)) {
                counts
                    .get(xValName)!
                    .set("count", counts.get(xValName)!.get("count")! + 1);
            }
        } else {
            let yValName: string = "";
            if (yVal.type === "status" && yVal.status?.name) {
                yValName = yVal.status.name.toLowerCase();
            } else if (yVal.type === "select" && yVal.select?.name) {
                yValName = yVal.select.name.toLowerCase();
            } else if (yVal.type === "multi_select" && yVal.multi_select) {
                yVal.multi_select.forEach((opt) => {
                    yValName = opt.name.toLowerCase();
                    if (xValName && yValName && counts.has(xValName)) {
                        counts
                            .get(xValName)!
                            .set(
                                yValName,
                                counts.get(xValName)!.get(yValName)! + 1
                            );
                    }
                });
                continue; // Skip to the next entry after processing multi_select
            }

            if (counts.has(xValName)) {
                counts
                    .get(xValName)!
                    .set(yValName, counts.get(xValName)!.get(yValName)! + 1);
            }
        }
    }

    // Format the radarChartData
    const radarChartData: ReturnType["radarChartData"] = [];
    for (const xVal of Array.from(xValues).sort()) {
        const classEntry = {
            class: xVal,
        } as { class: string } & { [key: string]: number };

        // Add counts for each YAxis value
        for (const yVal of radarChartConfig) {
            const yValLower = yVal.toLowerCase();
            classEntry[yValLower] = counts.get(xVal)?.get(yValLower) || 0;
        }

        radarChartData.push(classEntry);
    }

    return {
        radarChartConfig,
        radarChartData,
    };
}
