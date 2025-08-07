// utils/defineRoute.ts
import { z } from "zod";
import type { MiddlewareHandler } from "hono";

import type { RouteConfig, HttpMethod } from "@/types";

export function defineRoute<
    TVariables extends Record<string, unknown>,
    TParams extends z.ZodTypeAny = z.ZodObject<Record<string, never>>,
    TQuery extends z.ZodTypeAny = z.ZodObject<Record<string, never>>,
    TBody extends z.ZodTypeAny = z.ZodObject<Record<string, never>>,
>(config: {
    path: string;
    method: HttpMethod;
    middlewares?: MiddlewareHandler<{ Variables: TVariables }>[];
    validators?: {
        params?: TParams;
        query?: TQuery;
        body?: TBody;
    };
    handler: RouteConfig<TVariables, TParams, TQuery, TBody>["handler"];
}): RouteConfig<TVariables, TParams, TQuery, TBody> {
    return {
        middlewares: [],
        // eslint-disable-next-line
        validators: {} as any,
        ...config,
    };
}
