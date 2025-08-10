import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";

import collectionRoutes from "@/modules/collection/api/routes";
import areaRoutes from "@/modules/chart-types/area/api/routes";
import heatmapRoutes from "@/modules/chart-types/heatmap/api/routes";
import barRoutes from "@/modules/chart-types/bar/api/routes";
import radialRoutes from "@/modules/chart-types/radial/api/routes";
import radarRoutes from "@/modules/chart-types/radar/api/routes";
import chartRoutes from "@/modules/chart-attributes/api/routes";

export const dynamic = "force-dynamic";

const app = new Hono().basePath("/api/v1");

// Global error handler
app.onError((err, c) => {
    // eslint-disable-next-line no-console
    console.error("[API Error]", err.message || err);

    if (err instanceof HTTPException) {
        return err.getResponse();
    }

    return c.json(
        { error: "Internal Server Error", message: err.message },
        500
    );
});

// Route definitions
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
    .route("/collections", collectionRoutes)
    .route("/charts/area", areaRoutes)
    .route("/charts/heatmap", heatmapRoutes)
    .route("/charts/radial", radialRoutes)
    .route("/charts/radar", radarRoutes)
    .route("/charts/bar", barRoutes)
    .route("/charts", chartRoutes);

// Export handlers and types
export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
