"use client";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api)["chart-groups"]["$post"]
>;
type ResponseType = InferResponseType<
    (typeof client.api)["chart-groups"]["$post"],
    200
>;

export const useCreateNewGroup = () => {
    return useMutation<ResponseType, unknown, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api["chart-groups"].$post({
                json,
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }

            return await response.json();
        },
    });
};
