import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import charts from "@/features/charts/server/route";

const app = new Hono().basePath("/api");

const _routes = app.route("/auth", auth).route("/charts", charts);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof _routes;
