import { z } from "zod";
import { Context, MiddlewareHandler } from "hono";
import type {
    UseQueryOptions,
    UseMutationOptions,
    QueryKey,
} from "@tanstack/react-query";

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

// Generic response type for API endpoints
export type ApiResponse<TData = unknown> = {
    data: TData;
    success: boolean;
    message?: string;
};

export interface RouteConfig<
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TParams extends z.ZodSchema = z.ZodSchema,
    TQuery extends z.ZodSchema = z.ZodSchema,
    TBody extends z.ZodSchema = z.ZodSchema,
    TResponseData = unknown,
> {
    path: string;
    method: HttpMethod;
    queryHookName?: string;
    middlewares?: MiddlewareHandler<{ Variables: TVariables }>[];
    validators: {
        params?: TParams;
        query?: TQuery;
        body?: TBody;
    };
    handler: (
        c: ValidatedContext<TParams, TQuery, TBody, TVariables>
    ) => Promise<Response> | Response;

    // TanStack Query options
    queryOptions?: Omit<
        UseQueryOptions<
            ApiResponse<TResponseData>,
            Error,
            ApiResponse<TResponseData>,
            QueryKey
        >,
        "queryFn" | "queryKey"
    >;

    mutationOptions?: Omit<
        UseMutationOptions<
            ApiResponse<TResponseData>,
            Error,
            z.infer<TBody>,
            unknown
        >,
        "mutationFn"
    >;

    includeOnSuccess?: boolean;
    includeOnError?: boolean;
}
