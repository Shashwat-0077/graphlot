import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api.charts)["create-chart"]["$post"]
>;
type ResponseType = InferResponseType<
    (typeof client.api.charts)["create-chart"]["$post"],
    200
>;

export const useCreateNewChart = () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form }) => {
            const response = await client.api.charts["create-chart"].$post({
                form,
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error.message);
            }

            return await response.json();
        },
    });
};
