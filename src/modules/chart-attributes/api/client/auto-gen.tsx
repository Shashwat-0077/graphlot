import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { getQueryClient } from "@/lib/query-client";

type GetChartByCollectionQuery = {
    collectionId: string;
};

export const useGetChartByCollection = ({
    query,
}: {
    query: GetChartByCollectionQuery;
}) => {
    return useQuery({
        queryKey: ["charts", "all", JSON.stringify({ query })],
        queryFn: async () => {
            const response = await client.api.v1["charts"].$get({
                query: query,
            });

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to fetch charts");
                }
            }

            return await response.json();
        },
        staleTime: 0,
    });
};

type GetChartParams = {
    id: string;
};

export const useGetChart = ({ params }: { params: GetChartParams }) => {
    return useQuery({
        queryKey: ["chart-metadata", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"].$get({
                param: params,
            });

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to fetch charts");
                }
            }

            return await response.json();
        },
    });
};

type NotionChartRequest = InferRequestType<
    (typeof client.api.v1)["charts"]["notion"]["$post"]
>;
type NotionChartResponse = InferResponseType<
    (typeof client.api.v1)["charts"]["notion"]["$post"],
    200
>;

export const useNotionChart = ({
    onSuccess,
    onError,
}: {
    onSuccess?: (
        data: NotionChartResponse,
        variables: NotionChartRequest,
        context: unknown
    ) => void;
    onError?: (
        error: Error,
        variables: NotionChartRequest,
        context: unknown
    ) => void;
}) => {
    return useMutation<NotionChartResponse, Error, NotionChartRequest>({
        mutationFn: async (props) => {
            const response =
                await client.api.v1["charts"]["notion"].$post(props);

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to post charts");
                }
            }

            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            onSuccess?.(data, variables, context);
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({ queryKey: ["chart-metadata"] });
        },
        onError: (error, variables, context) => {
            onError?.(error, variables, context);
        },
    });
};

type UpdateChartRequest = InferRequestType<
    (typeof client.api.v1)["charts"][":id"]["$put"]
>;
type UpdateChartResponse = InferResponseType<
    (typeof client.api.v1)["charts"][":id"]["$put"],
    200
>;

export const useUpdateChart = ({
    onSuccess,
}: {
    onSuccess?: (
        data: UpdateChartResponse,
        variables: UpdateChartRequest,
        context: unknown
    ) => void;
}) => {
    return useMutation<UpdateChartResponse, Error, UpdateChartRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"][":id"].$put(props);

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to put charts");
                }
            }

            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            onSuccess?.(data, variables, context);
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({ queryKey: ["chart-metadata"] });
        },
    });
};

type DeleteChartRequest = InferRequestType<
    (typeof client.api.v1)["charts"][":id"]["$delete"]
>;
type DeleteChartResponse = InferResponseType<
    (typeof client.api.v1)["charts"][":id"]["$delete"],
    200
>;

export const useDeleteChart = ({
    onSuccess,
}: {
    onSuccess?: (
        data: DeleteChartResponse,
        variables: DeleteChartRequest,
        context: unknown
    ) => void;
}) => {
    return useMutation<DeleteChartResponse, Error, DeleteChartRequest>({
        mutationFn: async (props) => {
            const response =
                await client.api.v1["charts"][":id"].$delete(props);

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to delete charts");
                }
            }

            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            onSuccess?.(data, variables, context);
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({ queryKey: ["chart-metadata"] });
        },
    });
};

type GetChartTableSchemaParams = {
    id: string;
};

type GetChartTableSchemaQuery = {
    userId: string;
};

export const useGetChartTableSchema = ({
    params,
    query,
}: {
    params: GetChartTableSchemaParams;
    query: GetChartTableSchemaQuery;
}) => {
    return useQuery({
        queryKey: ["charts", "table-schema", JSON.stringify({ params, query })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"][
                "table-schema"
            ].$get({
                param: params,
                query: query,
            });

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to fetch charts");
                }
            }

            return await response.json();
        },
    });
};

type GetChartTableDataParams = {
    id: string;
};

type GetChartTableDataQuery = {
    userId: string;
};

export const useGetChartTableData = ({
    params,
    query,
}: {
    params: GetChartTableDataParams;
    query: GetChartTableDataQuery;
}) => {
    return useQuery({
        queryKey: ["charts", "table-data", JSON.stringify({ params, query })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"][
                "table-data"
            ].$get({
                param: params,
                query: query,
            });

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to fetch charts");
                }
            }

            return await response.json();
        },
    });
};

type GetChartVisualsParams = {
    id: string;
};

export const useGetChartVisuals = ({
    params,
}: {
    params: GetChartVisualsParams;
}) => {
    return useQuery({
        queryKey: ["chart-visuals", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"][
                "visuals"
            ].$get({
                param: params,
            });

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to fetch charts");
                }
            }

            return await response.json();
        },
    });
};

type UpdateChartVisualsRequest = InferRequestType<
    (typeof client.api.v1)["charts"][":id"]["visuals"]["$put"]
>;
type UpdateChartVisualsResponse = InferResponseType<
    (typeof client.api.v1)["charts"][":id"]["visuals"]["$put"],
    200
>;

export const useUpdateChartVisuals = ({
    onSuccess,
}: {
    onSuccess?: (
        data: UpdateChartVisualsResponse,
        variables: UpdateChartVisualsRequest,
        context: unknown
    ) => void;
}) => {
    return useMutation<
        UpdateChartVisualsResponse,
        Error,
        UpdateChartVisualsRequest
    >({
        mutationFn: async (props) => {
            const response =
                await client.api.v1["charts"][":id"]["visuals"].$put(props);

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to put charts");
                }
            }

            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            onSuccess?.(data, variables, context);
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({ queryKey: ["chart-visuals"] });
        },
    });
};

type GetChartTypographyParams = {
    id: string;
};

export const useGetChartTypography = ({
    params,
}: {
    params: GetChartTypographyParams;
}) => {
    return useQuery({
        queryKey: ["chart-typography", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"][
                "typography"
            ].$get({
                param: params,
            });

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to fetch charts");
                }
            }

            return await response.json();
        },
    });
};

type UpdateChartTypographyRequest = InferRequestType<
    (typeof client.api.v1)["charts"][":id"]["typography"]["$put"]
>;
type UpdateChartTypographyResponse = InferResponseType<
    (typeof client.api.v1)["charts"][":id"]["typography"]["$put"],
    200
>;

export const useUpdateChartTypography = ({
    onSuccess,
}: {
    onSuccess?: (
        data: UpdateChartTypographyResponse,
        variables: UpdateChartTypographyRequest,
        context: unknown
    ) => void;
}) => {
    return useMutation<
        UpdateChartTypographyResponse,
        Error,
        UpdateChartTypographyRequest
    >({
        mutationFn: async (props) => {
            const response =
                await client.api.v1["charts"][":id"]["typography"].$put(props);

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to put charts");
                }
            }

            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            onSuccess?.(data, variables, context);
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({ queryKey: ["chart-typography"] });
        },
    });
};

type GetChartBoxModelParams = {
    id: string;
};

export const useGetChartBoxModel = ({
    params,
}: {
    params: GetChartBoxModelParams;
}) => {
    return useQuery({
        queryKey: ["chart-box-model", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"][
                "box-model"
            ].$get({
                param: params,
            });

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to fetch charts");
                }
            }

            return await response.json();
        },
    });
};

type UpdateChartBoxModelRequest = InferRequestType<
    (typeof client.api.v1)["charts"][":id"]["box-model"]["$put"]
>;
type UpdateChartBoxModelResponse = InferResponseType<
    (typeof client.api.v1)["charts"][":id"]["box-model"]["$put"],
    200
>;

export const useUpdateChartBoxModel = ({
    onSuccess,
}: {
    onSuccess?: (
        data: UpdateChartBoxModelResponse,
        variables: UpdateChartBoxModelRequest,
        context: unknown
    ) => void;
}) => {
    return useMutation<
        UpdateChartBoxModelResponse,
        Error,
        UpdateChartBoxModelRequest
    >({
        mutationFn: async (props) => {
            const response =
                await client.api.v1["charts"][":id"]["box-model"].$put(props);

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to put charts");
                }
            }

            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            onSuccess?.(data, variables, context);
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({ queryKey: ["chart-box-model"] });
        },
    });
};

type GetChartColorsParams = {
    id: string;
};

export const useGetChartColors = ({
    params,
}: {
    params: GetChartColorsParams;
}) => {
    return useQuery({
        queryKey: ["chart-colors", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"][
                "colors"
            ].$get({
                param: params,
            });

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to fetch charts");
                }
            }

            return await response.json();
        },
    });
};

type UpdateChartColorsRequest = InferRequestType<
    (typeof client.api.v1)["charts"][":id"]["colors"]["$put"]
>;
type UpdateChartColorsResponse = InferResponseType<
    (typeof client.api.v1)["charts"][":id"]["colors"]["$put"],
    200
>;

export const useUpdateChartColors = ({
    onSuccess,
}: {
    onSuccess?: (
        data: UpdateChartColorsResponse,
        variables: UpdateChartColorsRequest,
        context: unknown
    ) => void;
}) => {
    return useMutation<
        UpdateChartColorsResponse,
        Error,
        UpdateChartColorsRequest
    >({
        mutationFn: async (props) => {
            const response =
                await client.api.v1["charts"][":id"]["colors"].$put(props);

            if (!response.ok) {
                const error = await response.json();
                if (error) {
                    throw new Error(`${error}`);
                } else {
                    throw new Error("Failed to put charts");
                }
            }

            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            onSuccess?.(data, variables, context);
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({ queryKey: ["chart-colors"] });
        },
    });
};
