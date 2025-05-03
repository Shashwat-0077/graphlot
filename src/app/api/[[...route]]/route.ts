import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";

import collections from "@/modules/Collection/server/route";
import charts from "@/modules/BasicChart/server/route";
import notion from "@/modules/notion/server/route";
import radar from "@/modules/Radar/server/route";
import area from "@/modules/Area/server/route";
import bar from "@/modules/Bar/server/route";
import heatmap from "@/modules/Heatmap/server/route";
import donut from "@/modules/Donut/server/route";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }
    return c.json({ error: "Internal error", message: err.message }, 500);
});

const _routes = app
    .route("/collections", collections)
    .route("/charts", charts)
    .route("/notion", notion)
    .route("/radar-chart", radar)
    .route("/area-chart", area)
    .route("/bar-chart", bar)
    .route("/heatmap-chart", heatmap)
    .route("/donut-chart", donut);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof _routes;
