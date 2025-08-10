import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type GetChartParams = {
  id: string;
};

export const useGetChart = (params: GetChartParams) => {
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

type UpdateChartRequest = InferRequestType<
    (typeof client.api.v1["charts"])[":id"]["$put"]
>;
type UpdateChartResponse = InferResponseType<
    (typeof client.api.v1["charts"])[":id"]["$put"],
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
    (typeof client.api.v1["charts"])[":id"]["$delete"]
>;
type DeleteChartResponse = InferResponseType<
    (typeof client.api.v1["charts"])[":id"]["$delete"],
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

export const useGetChartVisuals = (params: GetChartVisualsParams) => {
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
    (typeof client.api.v1["charts"])[":id"]["visuals"]["$post"]
>;
type UpdateChartVisualsResponse = InferResponseType<
    (typeof client.api.v1["charts"])[":id"]["visuals"]["$post"],
    200
>;

export const useUpdateChartVisuals = () => {
    return useMutation<UpdateChartVisualsResponse, Error, UpdateChartVisualsRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"][":id"]["visuals"].$post(props);

            if (!response.ok) {
                throw new Error("Failed to post charts");
            }

            return await response.json();
        },
    });
};

type GetChartTypographyParams = {
  id: string;
};

export const useGetChartTypography = (params: GetChartTypographyParams) => {
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
    (typeof client.api.v1["charts"])[":id"]["typography"]["$post"]
>;
type UpdateChartTypographyResponse = InferResponseType<
    (typeof client.api.v1["charts"])[":id"]["typography"]["$post"],
    200
>;

export const useUpdateChartTypography = () => {
    return useMutation<UpdateChartTypographyResponse, Error, UpdateChartTypographyRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"][":id"]["typography"].$post(props);

            if (!response.ok) {
                throw new Error("Failed to post charts");
            }

            return await response.json();
        },
    });
};

type GetChartBoxModelParams = {
  id: string;
};

export const useGetChartBoxModel = (params: GetChartBoxModelParams) => {
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
    (typeof client.api.v1["charts"])[":id"]["box-model"]["$post"]
>;
type UpdateChartBoxModelResponse = InferResponseType<
    (typeof client.api.v1["charts"])[":id"]["box-model"]["$post"],
    200
>;

export const useUpdateChartBoxModel = () => {
    return useMutation<UpdateChartBoxModelResponse, Error, UpdateChartBoxModelRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"][":id"]["box-model"].$post(props);

            if (!response.ok) {
                throw new Error("Failed to post charts");
            }

            return await response.json();
        },
    });
};

type GetChartColorsParams = {
  id: string;
};

export const useGetChartColors = (params: GetChartColorsParams) => {
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
    (typeof client.api.v1["charts"])[":id"]["colors"]["$post"]
>;
type UpdateChartColorsResponse = InferResponseType<
    (typeof client.api.v1["charts"])[":id"]["colors"]["$post"],
    200
>;

export const useUpdateChartColors = () => {
    return useMutation<UpdateChartColorsResponse, Error, UpdateChartColorsRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"][":id"]["colors"].$post(props);

            if (!response.ok) {
                throw new Error("Failed to post charts");
            }

            return await response.json();
        },
    });
};

