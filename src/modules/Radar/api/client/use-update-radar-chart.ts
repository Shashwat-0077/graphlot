import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

// Type for PUT request body
type RequestType = InferRequestType<
    (typeof client.api)["radar-chart"][":id"]["$put"]
>;

// Type for PUT response
type ResponseType = InferResponseType<
    (typeof client.api)["radar-chart"][":id"]["$put"],
    200
>;

export const useUpdateRadarChart = ({
    onSuccess: propOnSuccess,
}: {
    onSuccess: () => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const response = await client.api["radar-chart"][":id"].$put({
                param,
                json,
            });

            if (!response.ok) {
                throw new Error("Failed to update radar chart");
            }

            return await response.json();
        },
        onSuccess: (data, variables) => {
            propOnSuccess();
            queryClient.setQueryData(["radar-chart", variables.param.id], data);
        },
    });
};
