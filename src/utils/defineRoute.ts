import { z } from "zod";
import type { MiddlewareHandler } from "hono";
import type {
    UseQueryOptions,
    UseMutationOptions,
    QueryKey,
} from "@tanstack/react-query";

import type { RouteConfig, HttpMethod, ApiResponse } from "@/types";

export function defineRoute<
    TVariables extends Record<string, unknown>,
    TParams extends z.ZodTypeAny = z.ZodObject<Record<string, never>>,
    TQuery extends z.ZodTypeAny = z.ZodObject<Record<string, never>>,
    TBody extends z.ZodTypeAny = z.ZodObject<Record<string, never>>,
    TResponseData = unknown,
>(config: {
    path: string;
    method: HttpMethod;
    queryHookName?: string;
    middlewares?: MiddlewareHandler<{ Variables: TVariables }>[];
    validators?: {
        params?: TParams;
        query?: TQuery;
        json?: TBody;
    };
    handler: RouteConfig<
        TVariables,
        TParams,
        TQuery,
        TBody,
        TResponseData
    >["handler"];

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
    queryKey?: string[];

    includeOnSuccess?: () => void;
    includeOnError?: () => void;
}): RouteConfig<TVariables, TParams, TQuery, TBody, TResponseData> {
    return {
        middlewares: [],
        // eslint-disable-next-line
        validators: {} as any,
        ...config,
    };
}

export function defineRouteWithVariables<
    TVariables extends Record<string, unknown>,
>() {
    return function <
        TParams extends z.ZodTypeAny = z.ZodObject<Record<string, never>>,
        TQuery extends z.ZodTypeAny = z.ZodObject<Record<string, never>>,
        TBody extends z.ZodTypeAny = z.ZodObject<Record<string, never>>,
        TResponseData = unknown,
    >(config: {
        path: string;
        method: HttpMethod;
        queryHookName?: string;
        middlewares?: MiddlewareHandler<{ Variables: TVariables }>[];
        validators?: {
            params?: TParams;
            query?: TQuery;
            json?: TBody;
        };
        handler: RouteConfig<
            TVariables,
            TParams,
            TQuery,
            TBody,
            TResponseData
        >["handler"];

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
        queryKey?: string[];

        includeOnSuccess?: () => void;
        includeOnError?: () => void;
    }): RouteConfig<TVariables, TParams, TQuery, TBody, TResponseData> {
        return {
            middlewares: config.middlewares || [],
            validators: {
                params: config.validators?.params,
                query: config.validators?.query,
                body: config.validators?.json,
            },
            queryOptions: config.queryOptions,
            mutationOptions: config.mutationOptions,
            ...config,
        };
    };
}
