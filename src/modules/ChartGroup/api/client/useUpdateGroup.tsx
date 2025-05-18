"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
    (typeof client.api)["chart-groups"][":group_id"]["$put"]
>;
type ResponseType = InferResponseType<
    (typeof client.api)["chart-groups"][":group_id"]["$put"],
    200
>;

import { client } from "@/lib/rpc";

export const useUpdateGroup = () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const response = await client.api["chart-groups"][":group_id"].$put(
                {
                    param,
                    json,
                }
            );

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }

            return await response.json();
        },
    });
};
