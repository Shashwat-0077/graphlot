import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { FieldError } from "@/utils/FieldError";
import { CollectionInsert } from "@/modules/Collection/schema";

type RequestType = InferRequestType<
    (typeof client.api.collections)["create-collection"]["$post"]
>;
type ResponseType = InferResponseType<
    (typeof client.api.collections)["create-collection"]["$post"],
    200
>;

export const useCreateCollection = () => {
    return useMutation<
        ResponseType,
        FieldError<keyof CollectionInsert>,
        RequestType
    >({
        mutationFn: async ({ form: { name, description } }) => {
            const response = await client.api.collections[
                "create-collection"
            ].$post({
                form: {
                    name: name,
                    description: description,
                },
            });

            const data = await response.json();

            if (
                (!response.ok && "error" in data) ||
                !("newCollection" in data)
            ) {
                const { error, field } = data;
                throw new FieldError({
                    message: error,
                    field: field || "root",
                });
            }

            return { newCollection: data.newCollection };
        },
    });
};
