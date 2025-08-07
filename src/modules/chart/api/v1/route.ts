import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { ChartMetadataInsert } from "../../schema";

import { createNewChart } from "./logic";

type variables = {
    userId: string;
};

const chartMetadataRoutes = new Hono<{ Variables: variables }>().post(
    "/create-chart",
    zValidator("json", z.object(ChartMetadataInsert)),
    async (c) => {
        const chart = c.req.valid("json");
        const response = await createNewChart(chart);
        if (!response.ok) {
            return c.json({ error: response.error }, 500);
        }

        return c.json({ chart: response.chart }, 200);
    }
);

export default chartMetadataRoutes;
