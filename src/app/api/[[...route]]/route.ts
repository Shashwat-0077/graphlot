import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";

// Route imports
import collectionRoutes from "@/modules/Collection/api/server/route";
import chartRoutes from "@/modules/ChartMetaData/api/server/route";
import notionRoutes from "@/modules/notion/api/server/route";
import radarRoutes from "@/modules/Radar/api/server/route";
import areaRoutes from "@/modules/Area/api/server/route";
import barRoutes from "@/modules/Bar/api/server/route";
import heatmapRoutes from "@/modules/Heatmap/api/server/route";
import radialRoutes from "@/modules/Radial/api/server/route";
import chartGroupRoutes from "@/modules/ChartGroup/api/server/route";

const app = new Hono().basePath("/api");

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
    .route("/charts", chartRoutes)
    .route("/notion", notionRoutes)
    .route("/radar-chart", radarRoutes)
    .route("/area-chart", areaRoutes)
    .route("/bar-chart", barRoutes)
    .route("/heatmap-chart", heatmapRoutes)
    .route("/radial-chart", radialRoutes)
    .route("/chart-groups", chartGroupRoutes);

// Export handlers and types
export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
