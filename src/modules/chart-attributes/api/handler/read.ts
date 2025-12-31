import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
    ChartBoxModel,
    ChartColors,
    ChartMetadata,
    ChartTypography,
    ChartVisual,
} from "@/modules/chart-attributes/schema";
import {
    ChartBoxModelSelect,
    ChartColorSelect,
    ChartMetadataSelect,
    ChartTypographySelect,
    ChartVisualSelect,
} from "@/modules/chart-attributes/schema/types";
import {
    DATABASE_NOTION,
    DATABASE_UPLOAD,
    NotionPropertyData,
    NotionPropertySchema,
} from "@/constants";
import { fetchNotionTableSchema } from "@/modules/notion/api/helper/fetch-table-schema";
import { fetchNotionTableData } from "@/modules/notion/api/helper/fetch-table-data";

// Define the table mapping with proper types
const tableMap = {
    boxModel: ChartBoxModel,
    colors: ChartColors,
    typography: ChartTypography,
    visuals: ChartVisual,
} as const;

// Define return type mapping
type ReturnTypeMap = {
    boxModel: ChartBoxModelSelect;
    colors: ChartColorSelect;
    typography: ChartTypographySelect;
    visuals: ChartVisualSelect;
};

// Define attribute names for error messages
const attributeNames = {
    boxModel: "Box model",
    colors: "Colors",
    typography: "Typography",
    visuals: "Visuals",
} as const;

// Generic fetch function
export async function fetchChartAttribute<T extends keyof ReturnTypeMap>(
    id: string,
    attribute: T
): Promise<
    | {
          ok: true;
          data: ReturnTypeMap[T];
      }
    | {
          ok: false;
          error: string;
          details?: unknown;
      }
> {
    try {
        const table = tableMap[attribute];

        const result = await db
            .select()
            .from(table)
            .where(eq(table.chartId, id))
            .get();

        if (!result) {
            return {
                ok: false,
                error: `${attributeNames[attribute]} for chart ${id} not found`,
            };
        }

        return {
            ok: true,
            data: result as ReturnTypeMap[T],
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            details: error,
        };
    }
}

export async function fetchChartMetadata(id: string): Promise<
    | {
          ok: true;
          metadata: ChartMetadataSelect;
      }
    | {
          ok: false;
          error: string;
          details?: unknown;
      }
> {
    try {
        const result = await db
            .select()
            .from(ChartMetadata)
            .where(eq(ChartMetadata.chartId, id))
            .get();

        if (!result) {
            return {
                ok: false,
                error: `Metadata for chart ${id} not found`,
            };
        }

        return {
            ok: true,
            metadata: result,
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            details: error,
        };
    }
}

export async function fetchMetadataByCollection(id: string): Promise<
    | {
          ok: true;
          metadata: ChartMetadataSelect[];
      }
    | {
          ok: false;
          error: string;
          details?: unknown;
      }
> {
    try {
        const results = await db
            .select()
            .from(ChartMetadata)
            .where(eq(ChartMetadata.collectionId, id))
            .all();

        if (!results) {
            return {
                ok: false,
                error: `No metadata found for collection ${id}`,
            };
        }

        return {
            ok: true,
            metadata: results,
        };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            details: error,
        };
    }
}

export async function fetchChartSchema({
    chartId,
    userId,
}: {
    chartId: string;
    userId: string;
}): Promise<
    | {
          ok: true;
          databaseProvider: typeof DATABASE_NOTION;
          schema: NotionPropertySchema;
      }
    | {
          ok: true;
          databaseProvider: typeof DATABASE_UPLOAD;
          schema: null;
      }
    | { ok: false; error: string; details?: unknown }
> {
    const chart = await db
        .select()
        .from(ChartMetadata)
        .where(eq(ChartMetadata.chartId, chartId))
        .get();

    if (!chart) {
        return {
            ok: false,
            error: "Chart not found",
        };
    }

    if (!chart.databaseId) {
        return {
            ok: false,
            error: "Chart does not have a database associated",
        };
    }

    switch (chart.databaseProvider) {
        case DATABASE_NOTION:
            const response = await fetchNotionTableSchema({
                databaseId: chart.databaseId,
                userId: userId,
            });

            if (!response.ok) {
                return {
                    ok: false,
                    error: "Failed to fetch database schema",
                    details: response.error,
                };
            }

            if (!response.schema) {
                return {
                    ok: false,
                    error: "Database schema is empty",
                };
            }

            const schema = response.schema;

            return {
                ok: true,
                databaseProvider: DATABASE_NOTION,
                schema: schema,
            };
            break;
        case DATABASE_UPLOAD:
            return {
                ok: true,
                databaseProvider: DATABASE_UPLOAD,
                schema: null,
            };
            break;
        default:
            return {
                ok: false,
                error: `Unsupported database provider: ${chart.databaseProvider}`,
            };
    }
}

export async function fetchChartData({
    chartId,
    userId,
}: {
    chartId: string;
    userId: string;
}): Promise<
    | {
          ok: true;
          data: NotionPropertyData[] | null; // Replace null with the Upload schema that you will generate
      }
    | { ok: false; error: string; details?: unknown }
> {
    const chart = await db
        .select()
        .from(ChartMetadata)
        .where(eq(ChartMetadata.chartId, chartId))
        .get();

    if (!chart) {
        return {
            ok: false,
            error: "Chart not found",
        };
    }

    if (!chart.databaseId) {
        return {
            ok: false,
            error: "Chart does not have a database associated",
        };
    }

    switch (chart.databaseProvider) {
        case DATABASE_NOTION:
            const response = await fetchNotionTableData({
                databaseId: chart.databaseId,
                userId: userId,
            });

            if (!response.ok) {
                return {
                    ok: false,
                    error: "Failed to fetch chart data",
                    details: response.error,
                };
            }

            return {
                ok: true,
                data: response.data,
            };
        case DATABASE_UPLOAD:
            // For uploaded databases, we assume the data is not available
            return {
                ok: true,
                data: null,
            };
        default:
            return {
                ok: false,
                error: `Unsupported database provider: ${chart.databaseProvider}`,
            };
    }
}
