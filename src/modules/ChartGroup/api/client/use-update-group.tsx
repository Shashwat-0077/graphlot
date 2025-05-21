"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
    (typeof client.api)["chart-groups"][":groupId"]["$put"]
>;
type ResponseType = InferResponseType<
    (typeof client.api)["chart-groups"][":groupId"]["$put"],
    200
>;

import { client } from "@/lib/rpc";

export const useUpdateGroup = () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (props) => {
            const response =
                await client.api["chart-groups"][":groupId"].$put(props);

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }

            return await response.json();
        },
    });
};
