import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

// Type for PUT request body
type RequestType = InferRequestType<
    (typeof client.api)["heatmap-chart"][":id"]["$put"]
>;

// Type for PUT response
type ResponseType = InferResponseType<
    (typeof client.api)["heatmap-chart"][":id"]["$put"],
    200
>;

export const useUpdateHeatmap = ({
    onSuccess: propOnSuccess,
    onError: propOnError,
}: {
    onSuccess: () => void;
    onError?: (error: Error) => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            // BUG : heatmap is not updating properly
            const response = await client.api["heatmap-chart"][":id"].$put({
                param,
                json,
            });
            if (!response.ok) {
                throw new Error("Failed to update heatmap chart");
            }

            return await response.json();
        },
        onSuccess: (data, variables) => {
            propOnSuccess();
            queryClient.setQueryData(
                ["heatmap-chart", variables.param.id],
                data
            );
        },

        onError: (error) => {
            if (propOnError) {
                propOnError(error);
            }
        },
    });
};
