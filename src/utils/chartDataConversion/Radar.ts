export function getConfigData(schema: unknown, YAxis: string) {
    if (YAxis === "count") {
        return ["count"];
    }
    // Type guard for schema
    // eslint-disable-next-line
    function isValidSchema(schema: unknown): schema is Record<string, any> {
        return typeof schema === "object" && schema !== null;
    }

    // Early validation of inputs
    if (!isValidSchema(schema)) {
        throw new Error("Invalid schema");
    }

    const YAxisDetails = schema[YAxis];
    if (!YAxisDetails || typeof YAxisDetails !== "object") {
        throw new Error(`Invalid XAxis details for ${YAxis}`);
    }

    const options = YAxisDetails[YAxisDetails["type"]]?.options ?? [];
    if (!options || !Array.isArray(options)) {
        throw new Error(`Invalid options for XAxis: ${YAxis}`);
    }

    switch (YAxisDetails["type"]) {
        case "status":
        case "select":
        case "multi_select":
            return options.map((option) => option.name);

        default:
            throw new Error(`Unsupported XAxis type: ${YAxisDetails["type"]}`);
    }
}

// export function getRadarChartData(
//     data: unknown,
//     schema: unknown,
//     configData: string[],
//     XAxis: string,
//     YAxis: string
// ) {
//     // Type guard for schema
//     // eslint-disable-next-line
//     function isValidSchema(schema: unknown): schema is Record<string, any> {
//         return typeof schema === "object" && schema !== null;
//     }

//     // Type guard for data
//     // eslint-disable-next-line
//     function isValidData(data: unknown): data is Record<string, any>[] {
//         return (
//             Array.isArray(data) &&
//             data.every((item) => typeof item === "object" && item !== null)
//         );
//     }

//     // Early validation of inputs
//     if (!isValidSchema(schema) || !isValidData(data)) {
//         throw new Error("Invalid data or schema");
//     }

//     const XAxisDetails = schema[XAxis];
//     if (!XAxisDetails || typeof XAxisDetails !== "object") {
//         throw new Error(`Invalid XAxis details for ${XAxis}`);
//     }

//     const RadarChartData: ({
//         class: string;
//     } & {
//         [key: string]: number;
//     })[] = [];

//     const options = XAxisDetails[XAxisDetails["type"]]?.options ?? [];
//     if (!options || !Array.isArray(options)) {
//         throw new Error(`Invalid options for XAxis: ${XAxis}`);
//     }

//     for (const option of options) {
//         for (const data_label of configData) {
//             RadarChartData.push({
//                 class: option.name,
//                 [data_label]: 0,
//             });
//         }
//     }

//     switch (XAxisDetails["type"]) {
//         case "status":
//         case "select":
//             for (const item of data) {
//                 if (!item[XAxis]) {
//                     continue;
//                 }

//                 if (Array.isArray(item[YAxis])) {
//                     // as the YAxis can be select, status and multi_select, so we just need to check if its an array or not
//                     for (const selectedOption of item[YAxis]) {
//                         const match = RadarChartData.find(
//                             (r) => r.class === item[XAxis]?.name
//                         );
//                         if (match) {
//                             match[selectedOption.name]++;
//                         }
//                     }
//                 } else {
//                     const match = RadarChartData.find(
//                         (r) => r.class === item[XAxis]?.name
//                     );
//                     if (match) {
//                         match[YAxis === "count" ? "count" : item[YAxis].name]++;
//                     }
//                 }
//             }
//             break;

//         case "multi_select":
//             for (const item of data) {
//                 if (!Array.isArray(item[XAxis])) {
//                     continue;
//                 }

//                 if (Array.isArray(item[YAxis])) {
//                     // as the YAxis can be select, status and multi_select, so we just need to check if its an array or not
//                     for (const ySelectedOption of item[YAxis]) {
//                         for (const selectedOption of item[XAxis]) {
//                             const match = RadarChartData.find(
//                                 (r) => r.class === selectedOption?.name
//                             );
//                             if (match) {
//                                 match[ySelectedOption.name]++;
//                             }
//                         }
//                     }
//                 } else {
//                     const match = RadarChartData.find(
//                         (r) => r.class === item[XAxis]?.name
//                     );
//                     if (match) {
//                         match[YAxis === "count" ? "count" : item[YAxis].name]++;
//                     }
//                 }

//                 for (const selectedOption of item[XAxis]) {
//                     const match = RadarChartData.find(
//                         (r) => r.class === selectedOption?.name
//                     );
//                     if (match) {
//                         match["count"]++;
//                     }
//                 }
//             }
//             break;

//         default:
//             throw new Error(`Unsupported XAxis type: ${XAxisDetails["type"]}`);
//     }

//     return RadarChartData.filter((item) => item.count > 0);
// }

export function getRadarChartData(
    data: unknown,
    schema: unknown,
    XAxis: string,
    YAxis: string
) {
    // Type guard for schema
    // eslint-disable-next-line
    function isValidSchema(schema: unknown): schema is Record<string, any> {
        return typeof schema === "object" && schema !== null;
    }
    // Type guard for data
    // eslint-disable-next-line
    function isValidData(data: unknown): data is Record<string, any>[] {
        return (
            Array.isArray(data) &&
            data.every((item) => typeof item === "object" && item !== null)
        );
    }
    // Early validation of inputs
    if (!isValidSchema(schema) || !isValidData(data)) {
        throw new Error("Invalid data or schema");
    }

    const XAxisDetails = schema[XAxis];
    if (!XAxisDetails || typeof XAxisDetails !== "object") {
        throw new Error(`Invalid XAxis details for ${XAxis}`);
    }

    const XOptions = XAxisDetails[XAxisDetails["type"]]?.options ?? [];
    if (!XOptions || !Array.isArray(XOptions)) {
        throw new Error(`Invalid options for XAxis: ${XAxis}`);
    }

    const YAxisDetails =
        YAxis === "count"
            ? { type: "count", count: { options: [{ name: "count" }] } }
            : schema[YAxis];
    if (!YAxisDetails || typeof YAxisDetails !== "object") {
        throw new Error(`Invalid YAxis details for ${XAxis}`);
    }

    const YOptions = YAxisDetails[YAxisDetails["type"]]?.options ?? [];
    if (!YOptions || !Array.isArray(YOptions)) {
        throw new Error(`Invalid options for XAxis: ${YAxis}`);
    }

    const configData: string[] =
        YAxisDetails["type"] === "count" ||
        YAxisDetails["type"] === "select" ||
        YAxisDetails["type"] === "status" ||
        YAxisDetails["type"] === "multi_select"
            ? YOptions.map((option) => option.name)
            : [];

    const RadarChartData: ({
        class: string;
    } & {
        [key: string]: number;
    })[] = [];

    for (const option of XOptions) {
        const record: {
            class: string;
        } & {
            [key: string]: number;
        } = { class: option.name };

        for (const data_label of configData) {
            record[data_label] = 0;
        }
        RadarChartData.push(record);
    }

    switch (XAxisDetails["type"]) {
        case "status":
        case "select":
            switch (YAxisDetails["type"]) {
                case "status":
                case "select":
                    for (const record of data) {
                        if (!record[XAxis]) {
                            continue;
                        }

                        const match = RadarChartData.find(
                            (r) => r.class === record[XAxis]?.name
                        );
                        if (match) {
                            match[
                                YAxis === "count" ? "count" : record[YAxis].name
                            ]++;
                        }
                    }
                    break;

                case "multi_select":
                    for (const record of data) {
                        if (!record[XAxis]) {
                            continue;
                        }

                        for (const selectedOption of record[YAxis]) {
                            const match = RadarChartData.find(
                                (r) => r.class === record[XAxis]?.name
                            );
                            if (match) {
                                match[selectedOption.name]++;
                            }
                        }
                    }
                    break;

                default:
                    throw new Error(
                        `Unsupported YAxis type: ${YAxisDetails["type"]}`
                    );
            }
            break;

        case "multi_select":
            switch (YAxisDetails["type"]) {
                case "status":
                case "select":
                    for (const record of data) {
                        if (!Array.isArray(record[XAxis])) {
                            continue;
                        }

                        for (const entry of record[XAxis]) {
                            const match = RadarChartData.find(
                                (r) => r.class === entry?.name
                            );
                            if (match) {
                                match[
                                    YAxis === "count"
                                        ? "count"
                                        : record[YAxis].name
                                ]++;
                            }
                        }
                    }
                    break;

                case "multi_select":
                    break;

                default:
                    throw new Error(
                        `Unsupported YAxis type: ${YAxisDetails["type"]}`
                    );
            }
            break;

        default:
            throw new Error(`Unsupported XAxis type: ${XAxisDetails["type"]}`);
    }

    return { RadarChartData, configData };
}
