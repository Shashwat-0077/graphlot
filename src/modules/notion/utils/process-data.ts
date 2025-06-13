import { NotionPropertyData, NotionPropertySchema } from "@/constants";

type NumberAggregation = "sum" | "avg" | "latest" | "oldest" | "categorize";

export function processNotionData(
    schema: NotionPropertySchema,
    data: NotionPropertyData[],
    options: {
        xAxis: string;
        yAxis: string;
        yAxisNumberHandling?: NumberAggregation;
    }
): {
    config: string[];
    data: {
        class: string;
        [key: string]: number | string;
    }[];
} {
    const { xAxis, yAxis, yAxisNumberHandling = "latest" } = options;

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
    if (
        !["multi_select", "select", "status", "date", "number"].includes(
            xAxisType
        )
    ) {
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
    if (["multi_select", "select", "status", "date"].includes(yAxisType)) {
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
        // Case 2: X is categorical, Y is numerical
        if (yAxisNumberHandling === "categorize") {
            return handleCategoricalYAxis(
                schema,
                data,
                xAxis,
                xAxisType,
                yAxis,
                yAxisType
            );
        } else {
            return handleNumericalYAxis(
                schema,
                data,
                xAxis,
                xAxisType,
                yAxis,
                yAxisNumberHandling
            );
        }
    } else {
        throw new Error(`Unsupported y-axis type: ${yAxisType}`);
    }
}

/**
 * Handle case where y-axis is "count"
 */
function handleCountYAxis(
    schema: NotionPropertySchema,
    data: NotionPropertyData[],
    xAxis: string,
    xAxisType: NotionPropertySchema[string]["type"]
) {
    // Get all possible x-axis values
    const xAxisValues = getUniqueValuesForAxis(schema, data, xAxis, xAxisType);

    // Initialize result with counts set to 0
    const result = xAxisValues.map((value) => ({
        class: value.toLowerCase(),
        count: 0,
    }));

    // Count occurrences of each x-axis value
    data.forEach((record) => {
        const xValue = getValueFromRecord(record, xAxis, xAxisType);

        if (!xValue) {
            return;
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
            // For select, status, dates, and numbers, increment count for the single value
            let className: string;
            if (typeof xValue === "string") {
                // Date values or number bins
                className = xValue.toLowerCase();
            } else if (typeof xValue === "number") {
                // Number values - convert to bin
                className = getNumberBin(xValue, data, xAxis).toLowerCase();
            } else if (xValue && "name" in xValue) {
                // Select/status values
                className = xValue.name.toLowerCase();
            } else {
                return;
            }

            const item = result.find((r) => r.class === className);
            if (item) {
                item.count++;
            }
        }
    });

    return { data: result, config: ["count"] };
}

/**
 * Handle case where both x and y axes are categorical
 */
function handleCategoricalYAxis(
    schema: NotionPropertySchema,
    data: NotionPropertyData[],
    xAxis: string,
    xAxisType: NotionPropertySchema[string]["type"],
    yAxis: string,
    yAxisType: NotionPropertySchema[string]["type"]
) {
    // Get all possible x and y axis values
    const xAxisValues = getUniqueValuesForAxis(schema, data, xAxis, xAxisType);
    const yAxisValues = getUniqueValuesForAxis(schema, data, yAxis, yAxisType);

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
                    processYAxisValue(item, yValue, yAxisType, data, yAxis);
                }
            });
        } else if (xValue) {
            // Handle select, status, dates, and numbers for x-axis
            let xClass: string;
            if (typeof xValue === "string") {
                xClass = xValue.toLowerCase();
            } else if (typeof xValue === "number") {
                xClass = getNumberBin(xValue, data, xAxis).toLowerCase();
            } else if ("name" in xValue) {
                xClass = xValue.name.toLowerCase();
            } else {
                return;
            }

            const item = result.find((r) => r.class === xClass);
            if (item) {
                processYAxisValue(item, yValue, yAxisType, data, yAxis);
            }
        }
    });

    return { data: result, config: yAxisValues.map((v) => v.toLowerCase()) };
}

/**
 * Helper function to process y-axis values in categorical analysis
 */
function processYAxisValue(
    item: { [key: string]: number | string },
    yValue: any, // eslint-disable-line
    yAxisType: NotionPropertySchema[string]["type"],
    data?: NotionPropertyData[],
    yAxisName?: string
) {
    if (yAxisType === "multi_select" && Array.isArray(yValue)) {
        yValue.forEach((yVal) => {
            const yClass = yVal.name.toLowerCase();
            if (item.hasOwnProperty(yClass)) {
                (item[yClass] as number)++;
            }
        });
    } else if (yValue !== null && yValue !== undefined) {
        let yClass: string;
        if (typeof yValue === "string") {
            // Date values
            yClass = yValue.toLowerCase();
        } else if (typeof yValue === "number") {
            // Number values - convert to bin
            yClass = getNumberBin(yValue, data, yAxisName).toLowerCase();
        } else if ("name" in yValue) {
            // Select/status values
            yClass = yValue.name.toLowerCase();
        } else {
            return;
        }

        if (item.hasOwnProperty(yClass)) {
            (item[yClass] as number)++;
        }
    }
}

/**
 * Handle case where x-axis is categorical and y-axis is numerical
 */
function handleNumericalYAxis(
    schema: NotionPropertySchema,
    data: NotionPropertyData[],
    xAxis: string,
    xAxisType: NotionPropertySchema[string]["type"],
    yAxis: string,
    aggregation: NumberAggregation
) {
    // Get all possible x-axis values
    const xAxisValues = getUniqueValuesForAxis(schema, data, xAxis, xAxisType);

    // Initialize result based on aggregation type
    const result = xAxisValues.map((value) => {
        const item: { class: string; [key: string]: number | string } = {
            class: value.toLowerCase(),
        };

        switch (aggregation) {
            case "sum":
                item.sum = 0;
                break;
            case "avg":
                item.avg = 0;
                item._count = 0; // Internal counter for average calculation
                break;
            case "latest":
            case "oldest":
                item.value = 0;
                item._timestamp = aggregation === "oldest" ? 0 : Infinity;
                break;
        }

        return item;
    });

    // Process numbers for each x-axis value
    data.forEach((record, recordIndex) => {
        const xValue = getValueFromRecord(record, xAxis, xAxisType);
        let yValue: number | null | undefined = undefined;

        if (record[yAxis] && record[yAxis].type === "number") {
            yValue = record[yAxis].number;
        }

        if (yValue !== undefined && yValue !== null) {
            const processValue = (className: string) => {
                const item = result.find((r) => r.class === className);
                if (!item) {
                    return;
                }

                switch (aggregation) {
                    case "sum":
                        (item.sum as number) += yValue;
                        break;
                    case "avg":
                        (item.avg as number) += yValue;
                        (item._count as number)++;
                        break;
                    case "latest":
                        if (recordIndex < (item._timestamp as number)) {
                            item.value = yValue;
                            item._timestamp = recordIndex;
                        }
                        break;
                    case "oldest":
                        if (recordIndex >= (item._timestamp as number)) {
                            item.value = yValue;
                            item._timestamp = recordIndex;
                        }
                        break;
                }
            };

            if (xAxisType === "multi_select" && Array.isArray(xValue)) {
                // For multi_select, apply to each selected value
                xValue.forEach((val) => {
                    processValue(val.name.toLowerCase());
                });
            } else if (xValue) {
                // For select, status, dates, and numbers
                let className: string;
                if (typeof xValue === "string") {
                    className = xValue.toLowerCase();
                } else if (typeof xValue === "number") {
                    className = getNumberBin(xValue, data, xAxis).toLowerCase();
                } else if ("name" in xValue) {
                    className = xValue.name.toLowerCase();
                } else {
                    return;
                }

                processValue(className);
            }
        }
    });

    // Finalize calculations and clean up internal fields
    result.forEach((item) => {
        if (aggregation === "avg" && (item._count as number) > 0) {
            item.avg = (item.avg as number) / (item._count as number);
            delete item._count;
        }
        if (aggregation === "latest" || aggregation === "oldest") {
            delete item._timestamp;
        }
    });

    const configKey =
        aggregation === "avg" ? "avg" : aggregation === "sum" ? "sum" : "value";
    return { data: result, config: [configKey] };
}

/**
 * Extract all unique values for a given axis from the schema or data
 */
function getUniqueValuesForAxis(
    schema: NotionPropertySchema,
    data: NotionPropertyData[],
    axisName: string,
    axisType: NotionPropertySchema[string]["type"]
): string[] {
    const axisSchema = schema[axisName];

    // For categorical fields with predefined options, get from schema
    if (axisType === "multi_select" && axisSchema.type === "multi_select") {
        return axisSchema.multi_select.options.map((option) => option.name);
    } else if (axisType === "select" && axisSchema.type === "select") {
        return axisSchema.select.options.map((option) => option.name);
    } else if (axisType === "status" && axisSchema.type === "status") {
        return axisSchema.status.options.map((option) => option.name);
    }

    // For date fields, extract unique values from data
    if (axisType === "date") {
        const uniqueDates = new Set<string>();

        data.forEach((record) => {
            const value = getValueFromRecord(record, axisName, axisType);
            if (value && typeof value === "string") {
                uniqueDates.add(value);
            }
        });

        return Array.from(uniqueDates).sort();
    }

    // For number fields, create bins from the data
    if (axisType === "number") {
        return getNumberBins(data, axisName);
    }

    return [];
}

/**
 * Extract value from a record for a specific field
 */
function getValueFromRecord(
    record: NotionPropertyData,
    fieldName: string,
    fieldType: NotionPropertySchema[string]["type"]
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
    } else if (fieldType === "date" && field.type === "date") {
        // Return formatted date string (you can customize the format as needed)
        if (field.date?.start) {
            return formatDateForGrouping(field.date.start);
        }
        return null;
    } else if (fieldType === "number" && field.type === "number") {
        return field.number;
    }

    return null;
}

/**
 * Format date for grouping (you can customize this based on your needs)
 * Options: 'YYYY-MM-DD', 'YYYY-MM', 'YYYY', etc.
 */
function formatDateForGrouping(
    dateString: string,
    granularity: "day" | "month" | "year" = "day"
): string {
    const date = new Date(dateString);

    switch (granularity) {
        case "year":
            return date.getFullYear().toString();
        case "month":
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        case "day":
        default:
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }
}

/**
 * Create number bins from data for categorical analysis
 */
function getNumberBins(
    data: NotionPropertyData[],
    fieldName: string,
    binCount: number = 5
): string[] {
    const numbers: number[] = [];

    // Extract all number values
    data.forEach((record) => {
        if (
            record[fieldName] &&
            record[fieldName].type === "number" &&
            record[fieldName].number !== null
        ) {
            numbers.push(record[fieldName].number!);
        }
    });

    if (numbers.length === 0) {
        return [];
    }

    const min = Math.min(...numbers);
    const max = Math.max(...numbers);

    // If all numbers are the same, return a single bin
    if (min === max) {
        return [`${min}`];
    }

    const binSize = (max - min) / binCount;
    const bins: string[] = [];

    for (let i = 0; i < binCount; i++) {
        const binStart = min + i * binSize;
        const binEnd = min + (i + 1) * binSize;

        if (i === binCount - 1) {
            // Last bin includes the maximum value
            bins.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
        } else {
            bins.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
        }
    }

    return bins;
}

/**
 * Get the appropriate bin for a number value
 */
function getNumberBin(
    value: number,
    data?: NotionPropertyData[],
    fieldName?: string,
    binCount: number = 5
): string {
    // If we have data context, calculate bins dynamically
    if (data && fieldName) {
        const bins = getNumberBins(data, fieldName, binCount);
        const numbers: number[] = [];

        data.forEach((record) => {
            if (
                record[fieldName] &&
                record[fieldName].type === "number" &&
                record[fieldName].number !== null
            ) {
                numbers.push(record[fieldName].number!);
            }
        });

        if (numbers.length === 0) {
            return value.toString();
        }

        const min = Math.min(...numbers);
        const max = Math.max(...numbers);

        if (min === max) {
            return value.toString();
        }

        const binSize = (max - min) / binCount;

        // Find which bin this value belongs to
        const binIndex = Math.min(
            Math.floor((value - min) / binSize),
            binCount - 1
        );
        return bins[binIndex] || value.toString();
    }

    // Fallback: simple rounding for display
    return value.toString();
}
