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
    ChartBoxModelUpdate,
    ChartColorUpdate,
    ChartMetadataUpdate,
    ChartTypographyUpdate,
    ChartVisualUpdate,
} from "@/modules/chart-attributes/schema/types";

// Define update type mapping
type UpdateTypeMap = {
    boxModel: ChartBoxModelUpdate;
    colors: ChartColorUpdate;
    typography: ChartTypographyUpdate;
    visuals: ChartVisualUpdate;
};

// Define attribute names for error messages
const attributeNames = {
    boxModel: "Box model",
    colors: "Colors",
    typography: "Typography",
    visuals: "Visuals",
} as const;

// Generic update function
export async function updateChartAttribute<T extends keyof UpdateTypeMap>(
    id: string,
    attribute: T,
    data: UpdateTypeMap[T]
): Promise<
    | {
          ok: true;
          chartId: string;
      }
    | {
          ok: false;
          error: string;
          details?: unknown;
      }
> {
    try {
        let updated: { chartId: string } | undefined;

        switch (attribute) {
            case "boxModel":
                updated = await db
                    .update(ChartBoxModel)
                    .set(data as ChartBoxModelUpdate)
                    .where(eq(ChartBoxModel.chartId, id))
                    .returning({ chartId: ChartBoxModel.chartId })
                    .get();
                break;

            case "colors":
                updated = await db
                    .update(ChartColors)
                    .set(data as ChartColorUpdate)
                    .where(eq(ChartColors.chartId, id))
                    .returning({ chartId: ChartColors.chartId })
                    .get();
                break;

            case "typography":
                updated = await db
                    .update(ChartTypography)
                    .set(data as ChartTypographyUpdate)
                    .where(eq(ChartTypography.chartId, id))
                    .returning({ chartId: ChartTypography.chartId })
                    .get();
                break;

            case "visuals":
                updated = await db
                    .update(ChartVisual)
                    .set(data as ChartVisualUpdate)
                    .where(eq(ChartVisual.chartId, id))
                    .returning({ chartId: ChartVisual.chartId })
                    .get();
                break;

            default:
                // This should never happen due to TypeScript constraints
                const _exhaustiveCheck: never = attribute;
                throw new Error(`Unknown attribute: ${_exhaustiveCheck}`);
        }

        if (!updated) {
            return {
                ok: false,
                error: `${attributeNames[attribute]} for chart ${id} not found`,
            };
        }

        return {
            ok: true,
            chartId: updated.chartId,
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

export async function updateChartMetadata(
    id: string,
    data: ChartMetadataUpdate
): Promise<
    | { ok: true; chartId: string }
    | { ok: false; error: string; details?: unknown }
> {
    try {
        const updated = await db
            .update(ChartMetadata)
            .set({
                ...data,
                updatedAt: Date.now(),
            })
            .where(eq(ChartMetadata.chartId, id))
            .returning()
            .get();

        if (!updated) {
            return {
                ok: false,
                error: `Metadata for chart ${id} not found`,
            };
        }

        return {
            ok: true,
            chartId: updated.chartId,
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
