"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api)["chart-groups"][":group_id"]["$delete"]
>;
type ResponseType = InferResponseType<
    (typeof client.api)["chart-groups"][":group_id"]["$delete"],
    200
>;

export const useDeleteGroup = () => {
    return useMutation<ResponseType, unknown, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api["chart-groups"][
                ":group_id"
            ].$delete({
                param,
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }

            return await response.json();
        },
    });
};
