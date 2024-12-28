import { z } from "zod";

export const chartTypes = ["Donut", "Bar", "Radar", "Area", "Heatmap"] as const;
export const chartSchema = z.object({
    type: z.enum(["Donut", "Bar", "Radar", "Area", "Heatmap"]),
    databaseID: z.string(),
    databaseTitle: z.string().optional(),
});
