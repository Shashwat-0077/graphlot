import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api.collections)["create-collection"]["$post"]
>;
type ResponseType = InferResponseType<
    (typeof client.api.collections)["create-collection"]["$post"],
    200
>;

export const useCreateCollection = () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form: { name, description } }) => {
            const response = await client.api.collections[
                "create-collection"
            ].$post({
                form: {
                    name: name,
                    description: description,
                },
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }

            const newCollection = await response.json();

            return newCollection;
        },
    });
};
