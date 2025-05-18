import {
    SORT_ALPHABETICALLY_ASC,
    SORT_ALPHABETICALLY_DESC,
    SORT_DEFAULT,
    SORT_NUMERICALLY_ASC,
    SORT_NUMERICALLY_DESC,
    SortType,
} from "@/constants";

export const sortDataAndConfig = (
    config: string[],
    data: { class: string; [key: string]: string | number }[],
    x_sort: SortType,
    y_sort: SortType
): {
    sortedData: { class: string; [key: string]: string | number }[];
    sortedConfig: string[];
} => {
    // Create copies to avoid mutating original arrays
    let sortedData = [...data];
    const sortedConfig = [...config];

    // X-axis sorting (data array sorting)
    if (x_sort !== SORT_DEFAULT) {
        sortedData = [...data].sort((a, b) => {
            if (x_sort === SORT_ALPHABETICALLY_ASC) {
                return a.class.localeCompare(b.class);
            } else if (x_sort === SORT_ALPHABETICALLY_DESC) {
                return b.class.localeCompare(a.class);
            } else if (
                x_sort === SORT_NUMERICALLY_ASC ||
                x_sort === SORT_NUMERICALLY_DESC
            ) {
                // Calculate sum of all attributes except 'class'
                const sumA = Object.entries(a)
                    .filter(([key]) => key !== "class")
                    .reduce(
                        (sum, [_, value]) =>
                            sum + (typeof value === "number" ? value : 0),
                        0
                    );

                const sumB = Object.entries(b)
                    .filter(([key]) => key !== "class")
                    .reduce(
                        (sum, [_, value]) =>
                            sum + (typeof value === "number" ? value : 0),
                        0
                    );

                return x_sort === SORT_NUMERICALLY_ASC
                    ? sumA - sumB
                    : sumB - sumA;
            }
            return 0;
        });
    }

    // Y-axis sorting (config array sorting)
    if (y_sort !== SORT_DEFAULT) {
        if (y_sort === SORT_ALPHABETICALLY_ASC) {
            sortedConfig.sort((a, b) => a.localeCompare(b));
        } else if (y_sort === SORT_ALPHABETICALLY_DESC) {
            sortedConfig.sort((a, b) => b.localeCompare(a));
        } else if (
            y_sort === SORT_NUMERICALLY_ASC ||
            y_sort === SORT_NUMERICALLY_DESC
        ) {
            // Calculate sum for each config item across all data entries
            const configSums = sortedConfig.reduce(
                (acc, configKey) => {
                    const sum = sortedData.reduce((total, dataItem) => {
                        const value = dataItem[configKey];
                        return total + (typeof value === "number" ? value : 0);
                    }, 0);
                    acc[configKey] = sum;
                    return acc;
                },
                {} as Record<string, number>
            );

            sortedConfig.sort((a, b) => {
                const sumA = configSums[a] || 0;
                const sumB = configSums[b] || 0;
                return y_sort === SORT_NUMERICALLY_ASC
                    ? sumA - sumB
                    : sumB - sumA;
            });
        }
    }

    return { sortedData, sortedConfig };
};
