"use client";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api)["chart-groups"][":groupId"]["set-charts"]["$put"]
>;
type ResponseType = InferResponseType<
    (typeof client.api)["chart-groups"][":groupId"]["set-charts"]["$put"],
    200
>;

export const useSetChartsInGroup = () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (props) => {
            const response =
                await client.api["chart-groups"][":groupId"]["set-charts"].$put(
                    props
                );

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }

            return await response.json();
        },
    });
};
