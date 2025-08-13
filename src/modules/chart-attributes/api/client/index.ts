import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type GetChartByCollectionParams = {
  collection_id: string;
};

export const useGetChartByCollection = ({params}: {params: GetChartByCollectionParams}) => {
    return useQuery({
        queryKey: ["charts", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":collection_id"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts");
            }

            return await response.json();
        },
        
    });
};

type GetChartParams = {
  id: string;
};

export const useGetChart = ({params}: {params: GetChartParams}) => {
    return useQuery({
        queryKey: ["charts", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts");
            }

            return await response.json();
        },
        
    });
};

type CreateChartRequest = InferRequestType<
    (typeof client.api.v1)["charts"]["$post"]
>;
type CreateChartResponse = InferResponseType<
    (typeof client.api.v1)["charts"]["$post"],
    200
>;

export const useCreateChart = ({
onSuccess,
onError,
}: {
onSuccess?: (
    data: CreateChartResponse,
    variables: CreateChartRequest,
    context: unknown
) => void;
onError?: (
    error: Error,
    variables: CreateChartRequest,
    context: unknown
) => void;
}) => {
    return useMutation<CreateChartResponse, Error, CreateChartRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"].$post(props);

            if (!response.ok) {
                throw new Error("Failed to post charts");
            }

            return await response.json();
        },
        onSuccess: (data, variables, context) => {
            onSuccess?.(data, variables, context);
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

export const useUpdateChart = () => {
    return useMutation<UpdateChartResponse, Error, UpdateChartRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"][":id"].$put(props);

            if (!response.ok) {
                throw new Error("Failed to put charts");
            }

            return await response.json();
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

export const useDeleteChart = () => {
    return useMutation<DeleteChartResponse, Error, DeleteChartRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"][":id"].$delete(props);

            if (!response.ok) {
                throw new Error("Failed to delete charts");
            }

            return await response.json();
        },
    });
};

type GetChartVisualsParams = {
  id: string;
};

export const useGetChartVisuals = ({params}: {params: GetChartVisualsParams}) => {
    return useQuery({
        queryKey: ["charts", "visuals", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"]["visuals"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts");
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

export const useUpdateChartVisuals = () => {
    return useMutation<UpdateChartVisualsResponse, Error, UpdateChartVisualsRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"][":id"]["visuals"].$put(props);

            if (!response.ok) {
                throw new Error("Failed to put charts");
            }

            return await response.json();
        },
    });
};

type GetChartTypographyParams = {
  id: string;
};

export const useGetChartTypography = ({params}: {params: GetChartTypographyParams}) => {
    return useQuery({
        queryKey: ["charts", "typography", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"]["typography"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts");
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

export const useUpdateChartTypography = () => {
    return useMutation<UpdateChartTypographyResponse, Error, UpdateChartTypographyRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"][":id"]["typography"].$put(props);

            if (!response.ok) {
                throw new Error("Failed to put charts");
            }

            return await response.json();
        },
    });
};

type GetChartBoxModelParams = {
  id: string;
};

export const useGetChartBoxModel = ({params}: {params: GetChartBoxModelParams}) => {
    return useQuery({
        queryKey: ["charts", "box-model", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"]["box-model"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts");
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

export const useUpdateChartBoxModel = () => {
    return useMutation<UpdateChartBoxModelResponse, Error, UpdateChartBoxModelRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"][":id"]["box-model"].$put(props);

            if (!response.ok) {
                throw new Error("Failed to put charts");
            }

            return await response.json();
        },
    });
};

type GetChartColorsParams = {
  id: string;
};

export const useGetChartColors = ({params}: {params: GetChartColorsParams}) => {
    return useQuery({
        queryKey: ["charts", "colors", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"][":id"]["colors"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts");
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

export const useUpdateChartColors = () => {
    return useMutation<UpdateChartColorsResponse, Error, UpdateChartColorsRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"][":id"]["colors"].$put(props);

            if (!response.ok) {
                throw new Error("Failed to put charts");
            }

            return await response.json();
        },
    });
};

