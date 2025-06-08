"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api)["chart-groups"][":groupId"]["$delete"]
>;
type ResponseType = InferResponseType<
    (typeof client.api)["chart-groups"][":groupId"]["$delete"],
    200
>;

export const useDeleteGroup = () => {
    return useMutation<ResponseType, unknown, RequestType>({
        mutationFn: async (props) => {
            const response =
                await client.api["chart-groups"][":groupId"].$delete(props);

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }

            return await response.json();
        },
    });
};
