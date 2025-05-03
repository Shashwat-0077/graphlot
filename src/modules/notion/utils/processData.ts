import { NotionDataType, NotionSchemaType } from "@/constants";

export function processNotionData(
    schema: NotionSchemaType,
    data: NotionDataType[],
    options: {
        xAxis: string;
        yAxis: string;
    }
): {
    config: string[];
    data: {
        class: string;
        [key: string]: number | string;
    }[];
} {
    const { xAxis, yAxis } = options;

    // Validate inputs
    if (!schema || !data || !xAxis) {
        throw new Error("Missing required parameters");
    }

    // Get schema info for x-axis
    const xAxisSchema = schema[xAxis];
    if (!xAxisSchema) {
        throw new Error(`Schema for ${xAxis} not found`);
    }

    // Check if x-axis type is supported
    const xAxisType = xAxisSchema.type;
    if (!["multi_select", "select", "status"].includes(xAxisType)) {
        throw new Error(`Unsupported x-axis type: ${xAxisType}`);
    }

    // Special case for count as y-axis
    if (yAxis === "count") {
        return handleCountYAxis(schema, data, xAxis, xAxisType);
    }

    // Get schema info for y-axis
    const yAxisSchema = schema[yAxis];
    if (!yAxisSchema) {
        throw new Error(`Schema for ${yAxis} not found`);
    }

    const yAxisType = yAxisSchema.type;

    // Handle different combinations of x and y axis types
    if (["multi_select", "select", "status"].includes(yAxisType)) {
        // Case 1: Both axes are categorical

        return handleCategoricalYAxis(
            schema,
            data,
            xAxis,
            xAxisType,
            yAxis,
            yAxisType
        );
    } else if (yAxisType === "number") {
        // Case 3: X is categorical, Y is numerical
        return handleNumericalYAxis(schema, data, xAxis, xAxisType, yAxis);
    } else {
        throw new Error(`Unsupported y-axis type: ${yAxisType}`);
    }
}

/**
 * Handle case where y-axis is "count"
 */
function handleCountYAxis(
    schema: NotionSchemaType,
    data: NotionDataType[],
    xAxis: string,
    xAxisType: NotionSchemaType[string]["type"]
) {
    // Get all possible x-axis values
    const xAxisValues = getUniqueValuesForAxis(schema, xAxis, xAxisType);

    // Initialize result with counts set to 0
    const result = xAxisValues.map((value) => ({
        class: value.toLowerCase(),
        count: 0,
    }));

    // Count occurrences of each x-axis value
    data.forEach((record) => {
        const xValue = getValueFromRecord(record, xAxis, xAxisType);

        if (!xValue) {
            return [];
        }

        if (Array.isArray(xValue) && xAxisType === "multi_select") {
            // For multi_select, increment count for each selected value
            xValue.forEach((val) => {
                const item = result.find(
                    (r) => r.class === val.name.toLowerCase()
                );
                if (item) {
                    item.count++;
                }
            });
        } else if (!Array.isArray(xValue)) {
            // For select and status, increment count for the single value
            if (xValue) {
                const item = result.find(
                    (r) => r.class === xValue.name.toLowerCase()
                );
                if (item) {
                    item.count++;
                }
            }
        }
    });

    return { data: result, config: ["count"] };
}

/**
 * Handle case where both x and y axes are categorical
 */
function handleCategoricalYAxis(
    schema: NotionSchemaType,
    data: NotionDataType[],
    xAxis: string,
    xAxisType: NotionSchemaType[string]["type"],
    yAxis: string,
    yAxisType: NotionSchemaType[string]["type"]
) {
    // Get all possible x and y axis values
    const xAxisValues = getUniqueValuesForAxis(schema, xAxis, xAxisType);
    const yAxisValues = getUniqueValuesForAxis(schema, yAxis, yAxisType);

    // Initialize result with counts set to 0
    const result = xAxisValues.map((xValue) => {
        const item: {
            class: string;
            [key: string]: number | string;
        } = {
            class: xValue.toLowerCase(),
        };

        // Add y-axis categories with zero counts
        yAxisValues.forEach((yValue) => {
            item[yValue.toLowerCase()] = 0;
        });

        return item;
    });

    // Count co-occurrences of x and y values
    data.forEach((record) => {
        const xValue = getValueFromRecord(record, xAxis, xAxisType);
        const yValue = getValueFromRecord(record, yAxis, yAxisType);

        // Handle multi_select for x-axis
        if (xAxisType === "multi_select" && Array.isArray(xValue)) {
            xValue.forEach((xVal) => {
                const xClass = xVal.name.toLowerCase();
                const item = result.find((r) => r.class === xClass);

                if (item) {
                    // Handle multi_select for y-axis
                    if (yAxisType === "multi_select" && Array.isArray(yValue)) {
                        yValue.forEach((yVal) => {
                            const yClass = yVal.name.toLowerCase();
                            if (item.hasOwnProperty(yClass)) {
                                (item[yClass] as number)++;
                            }
                        });
                    } else if (yValue && !Array.isArray(yValue)) {
                        // Handle select and status for y-axis
                        const yClass = yValue.name.toLowerCase();
                        if (item.hasOwnProperty(yClass)) {
                            (item[yClass] as number)++;
                        }
                    }
                }
            });
        } else if (xValue && !Array.isArray(xValue)) {
            // Handle select and status for x-axis
            const xClass = xValue.name.toLowerCase();
            const item = result.find((r) => r.class === xClass);

            if (item) {
                // Handle multi_select for y-axis
                if (yAxisType === "multi_select" && Array.isArray(yValue)) {
                    yValue.forEach((yVal) => {
                        const yClass = yVal.name.toLowerCase();
                        if (item.hasOwnProperty(yClass)) {
                            (item[yClass] as number)++;
                        }
                    });
                } else if (yValue && !Array.isArray(yValue)) {
                    // Handle select and status for y-axis
                    const yClass = yValue.name.toLowerCase();
                    if (item.hasOwnProperty(yClass)) {
                        (item[yClass] as number)++;
                    }
                }
            }
        }
    });

    return { data: result, config: yAxisValues.map((v) => v.toLowerCase()) };
}

/**
 * Handle case where x-axis is categorical and y-axis is numerical
 */
function handleNumericalYAxis(
    schema: NotionSchemaType,
    data: NotionDataType[],
    xAxis: string,
    xAxisType: NotionSchemaType[string]["type"],
    yAxis: string
) {
    // Get all possible x-axis values
    const xAxisValues = getUniqueValuesForAxis(schema, xAxis, xAxisType);

    // Initialize result with sums set to 0
    const result = xAxisValues.map((value) => ({
        class: value.toLowerCase(),
        sum: 0,
    }));

    // Sum numbers for each x-axis value
    data.forEach((record) => {
        const xValue = getValueFromRecord(record, xAxis, xAxisType);
        let yValue: number | null | undefined = undefined;

        if (record[yAxis].type === "number") {
            yValue = record[yAxis]?.number;
        }

        if (yValue !== undefined && yValue !== null) {
            if (xAxisType === "multi_select" && Array.isArray(xValue)) {
                // For multi_select, add the number to each selected value
                xValue.forEach((val) => {
                    const item = result.find(
                        (r) => r.class === val.name.toLowerCase()
                    );
                    if (item) {
                        item.sum += yValue;
                    }
                });
            } else if (xValue && !Array.isArray(xValue)) {
                // For select and status, add the number to the single value
                const item = result.find(
                    (r) => r.class === xValue.name.toLowerCase()
                );
                if (item) {
                    item.sum += yValue;
                }
            }
        }
    });

    return { data: result, config: ["number"] };
}

/**
 * Extract all unique values for a given axis from the schema
 */
function getUniqueValuesForAxis(
    schema: NotionSchemaType,
    axisName: string,
    axisType: NotionSchemaType[string]["type"]
): string[] {
    const axisSchema = schema[axisName];

    if (axisType === "multi_select" && axisSchema.type === "multi_select") {
        return axisSchema.multi_select.options.map((option) => option.name);
    } else if (axisType === "select" && axisSchema.type === "select") {
        return axisSchema.select.options.map((option) => option.name);
    } else if (axisType === "status" && axisSchema.type === "status") {
        return axisSchema.status.options.map((option) => option.name);
    }

    return [];
}

/**
 * Extract value from a record for a specific field
 */
function getValueFromRecord(
    record: NotionDataType,
    fieldName: string,
    fieldType: NotionSchemaType[string]["type"]
) {
    const field = record[fieldName];

    if (!field) {
        return fieldType === "multi_select" ? [] : null;
    }

    if (fieldType === "multi_select" && field.type === "multi_select") {
        return field.multi_select || [];
    } else if (fieldType === "select" && field.type === "select") {
        return field.select;
    } else if (fieldType === "status" && field.type === "status") {
        return field.status;
    }

    return null;
}
