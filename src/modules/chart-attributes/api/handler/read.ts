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
