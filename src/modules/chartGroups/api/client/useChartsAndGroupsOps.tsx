"use client";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api)["chart-groups"][":group_id"]["set-charts"]["$put"]
>;
type ResponseType = InferResponseType<
    (typeof client.api)["chart-groups"][":group_id"]["set-charts"]["$put"],
    200
>;

export const useSetChartsInGroup = () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const response = await client.api["chart-groups"][":group_id"][
                "set-charts"
            ].$put({
                param,
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
