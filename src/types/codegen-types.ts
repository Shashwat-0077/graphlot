import { z } from "zod";
import { Context, MiddlewareHandler } from "hono";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type ValidatedContext<
    TParams extends z.ZodSchema = z.ZodSchema,
    TQuery extends z.ZodSchema = z.ZodSchema,
    TBody extends z.ZodSchema = z.ZodSchema,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
> = Context<{
    Variables: TVariables;
    Bindings: Record<string, unknown>;
}> & {
    req: Context["req"] & {
        valid(target: "param"): z.infer<TParams>;
        valid(target: "query"): z.infer<TQuery>;
        valid(target: "json"): z.infer<TBody>;
    };
};

export interface RouteConfig<
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TParams extends z.ZodSchema = z.ZodSchema,
    TQuery extends z.ZodSchema = z.ZodSchema,
    TBody extends z.ZodSchema = z.ZodSchema,
> {
    path: string;
    method: HttpMethod;
    middlewares?: MiddlewareHandler<{ Variables: TVariables }>[];
    validators: {
        params?: TParams;
        query?: TQuery;
        body?: TBody;
    };
    handler: (
        c: ValidatedContext<TParams, TQuery, TBody, TVariables>
    ) => Promise<Response> | Response;
}
