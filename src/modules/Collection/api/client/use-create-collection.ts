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
        mutationFn: async (props) => {
            const response =
                await client.api.collections["create-collection"].$post(props);

            if (!response.ok) {
                throw new Error("Failed to update chart");
            }

            const data = await response.json();
            return { collection: data.collection };
        },
    });
};
