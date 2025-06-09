import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

// Type for GET response
type RequestType = InferRequestType<
    (typeof client.api)["bar-chart"][":id"]["$put"]
>;

// Type for PUT request body
type ResponseType = InferResponseType<
    (typeof client.api)["bar-chart"][":id"]["$put"],
    200
>;

export const useUpdateBarChart = ({
    onSuccess: propOnSuccess,
}: {
    onSuccess: () => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const response = await client.api["bar-chart"][":id"].$put({
                param: param,
                json: json,
            });

            if (!response.ok) {
                throw new Error("Failed to update chart");
            }

            return await response.json();
        },
        // When mutation is successful, invalidate the corresponding query
        onSuccess: (data, variables) => {
            propOnSuccess();
            queryClient.setQueryData(["bar-chart", variables.param.id], data);
        },
    });
};
