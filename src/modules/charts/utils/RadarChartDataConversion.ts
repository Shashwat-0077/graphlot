export function getRadarChartData(
    data: unknown,
    schema: unknown,
    XAxis: string,
    YAxis: string
) {
    // Type guards
    function isValidSchema(schema: unknown): schema is Record<string, any> {
        return typeof schema === "object" && schema !== null;
    }

    function isValidData(data: unknown): data is Record<string, any>[] {
        return (
            Array.isArray(data) &&
            data.every((item) => typeof item === "object" && item !== null)
        );
    }

    // Validation
    if (!isValidSchema(schema) || !isValidData(data)) {
        throw new Error("Invalid data or schema");
    }

    // Get axis details
    const XAxisDetails = schema[XAxis];
    const YAxisDetails =
        YAxis === "count"
            ? { type: "count", count: { options: [{ name: "count" }] } }
            : schema[YAxis];

    if (!XAxisDetails || !YAxisDetails) {
        throw new Error("Invalid axis configuration");
    }

    // Get options for both axes
    const XOptions = getOptionsForType(XAxisDetails);
    const YOptions =
        YAxis === "count"
            ? [{ name: "count" }]
            : getOptionsForType(YAxisDetails);

    // Initialize radar chart data structure
    const RadarChartData = XOptions.map((xOption) => {
        const record: Record<string, any> = { class: xOption.name };
        YOptions.forEach((yOption) => {
            record[yOption.name] = 0;
        });
        return record;
    });

    // Process data based on axis types
    for (const record of data) {
        const xValues = extractValues(record[XAxis], XAxisDetails.type);
        const yValues =
            YAxis === "count"
                ? ["count"]
                : extractValues(record[YAxis], YAxisDetails.type);

        // Cross multiply all x and y values
        for (const xValue of xValues) {
            for (const yValue of yValues) {
                const matchingRecord = RadarChartData.find(
                    (r) => r.class === xValue
                );
                if (matchingRecord) {
                    matchingRecord[yValue]++;
                }
            }
        }
    }

    return {
        RadarChartData,
        configData: YOptions.map((opt) => opt.name),
    };
}

// Helper function to get options based on field type
function getOptionsForType(
    fieldDetails: Record<string, any>
): Array<{ name: string }> {
    const type = fieldDetails.type;
    if (!type) {
        return [];
    }

    const options = fieldDetails[type]?.options;
    if (!Array.isArray(options)) {
        throw new Error(`Invalid options for type: ${type}`);
    }

    return options;
}

// Helper function to extract values based on field type
function extractValues(field: any, type: string): string[] {
    if (!field) {
        return [];
    }
    switch (type) {
        case "status":
        case "select":
            return [field.name].filter(Boolean);
        case "multi_select":
            return Array.isArray(field)
                ? field.map((f) => f.name).filter(Boolean)
                : [];
        case "count":
            return ["count"];
        default:
            return [];
    }
}
