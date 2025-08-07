import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { z } from "zod";
import { client } from "@/lib/rpc";

export const useCollections = () => {
    const queryResult = useQuery({
        queryKey: ["collections", "all"],
        queryFn: async () => {
            const response = await client.api.v1.collections["all"].$get();

            if (!response.ok) {
                throw new Error("Failed to fetch collections");
            }

            return await response.json();
        },
        staleTime: 0,
    });

    return queryResult;
};

type CollectionByIdParams = z.infer<z.ZodObject<{ id: z.ZodString; sample: z.ZodOptional<z.ZodString> }>>;

export const useCollectionById = (params: CollectionByIdParams) => {
    const queryResult = useQuery({
        queryKey: ["collections", params],
        queryFn: async () => {
            const response = await client.api.v1.collections[":id"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch collections");
            }

            return await response.json();
        },
        
    });

    return queryResult;
};

type CreateCollectionRequestType = InferRequestType<
    (typeof client.api.v1.collections)["create"]["$post"]
>;
type CreateCollectionResponseType = InferResponseType<
    (typeof client.api.v1.collections)["create"]["$post"],
    200
>;

export const useCreateCollection = () => {
    return useMutation<CreateCollectionResponseType, Error, CreateCollectionRequestType>({
        mutationFn: async (props) => {
            const response = await client.api.v1.collections["create"].$post(props);

            if (!response.ok) {
                throw new Error("Failed to post collections");
            }

            return await response.json();
        },
    });
};

type UpdateCollectionRequestType = InferRequestType<
    (typeof client.api.v1.collections)[":id"]["$put"]
>;
type UpdateCollectionResponseType = InferResponseType<
    (typeof client.api.v1.collections)[":id"]["$put"],
    200
>;

export const useUpdateCollection = () => {
    return useMutation<UpdateCollectionResponseType, Error, UpdateCollectionRequestType>({
        mutationFn: async (props) => {
            const response = await client.api.v1.collections[":id"].$put(props);

            if (!response.ok) {
                throw new Error("Failed to put collections");
            }

            return await response.json();
        },
    });
};

type DeleteCollectionRequestType = InferRequestType<
    (typeof client.api.v1.collections)[":id"]["$delete"]
>;
type DeleteCollectionResponseType = InferResponseType<
    (typeof client.api.v1.collections)[":id"]["$delete"],
    200
>;

export const useDeleteCollection = () => {
    return useMutation<DeleteCollectionResponseType, Error, DeleteCollectionRequestType>({
        mutationFn: async (props) => {
            const response = await client.api.v1.collections[":id"].$delete(props);

            if (!response.ok) {
                throw new Error("Failed to delete collections");
            }

            return await response.json();
        },
    });
};

