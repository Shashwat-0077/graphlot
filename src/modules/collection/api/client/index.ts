import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

export const useGetCollectionsAll = () => {
    return useQuery({
        queryKey: ["collections", "all"],
        queryFn: async () => {
            const response = await client.api.v1["collections"]["all"].$get();

            if (!response.ok) {
                throw new Error("Failed to fetch collections");
            }

            return await response.json();
        },
        staleTime: 0,
    });
};

type GetCollectionParams = {
  id: string;
};

export const useGetCollection = (params: GetCollectionParams) => {
    return useQuery({
        queryKey: ["collections", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["collections"][":id"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch collections");
            }

            return await response.json();
        },
        
    });
};

type PostCollectionsCreateRequest = InferRequestType<
    (typeof client.api.v1["collections"])["create"]["$post"]
>;
type PostCollectionsCreateResponse = InferResponseType<
    (typeof client.api.v1["collections"])["create"]["$post"],
    200
>;

export const usePostCollectionsCreate = () => {
    return useMutation<PostCollectionsCreateResponse, Error, PostCollectionsCreateRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["collections"]["create"].$post(props);

            if (!response.ok) {
                throw new Error("Failed to post collections");
            }

            return await response.json();
        },
    });
};

type UpdateCollectionRequest = InferRequestType<
    (typeof client.api.v1["collections"])[":id"]["$put"]
>;
type UpdateCollectionResponse = InferResponseType<
    (typeof client.api.v1["collections"])[":id"]["$put"],
    200
>;

export const useUpdateCollection = () => {
    return useMutation<UpdateCollectionResponse, Error, UpdateCollectionRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["collections"][":id"].$put(props);

            if (!response.ok) {
                throw new Error("Failed to put collections");
            }

            return await response.json();
        },
    });
};

type DeleteCollectionRequest = InferRequestType<
    (typeof client.api.v1["collections"])[":id"]["$delete"]
>;
type DeleteCollectionResponse = InferResponseType<
    (typeof client.api.v1["collections"])[":id"]["$delete"],
    200
>;

export const useDeleteCollection = () => {
    return useMutation<DeleteCollectionResponse, Error, DeleteCollectionRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["collections"][":id"].$delete(props);

            if (!response.ok) {
                throw new Error("Failed to delete collections");
            }

            return await response.json();
        },
    });
};

