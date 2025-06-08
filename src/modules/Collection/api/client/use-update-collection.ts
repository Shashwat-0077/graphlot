import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

// Type for GET response
type RequestType = InferRequestType<
    (typeof client.api)["collections"][":id"]["$put"]
>;

// Type for PUT request body
type ResponseType = InferResponseType<
    (typeof client.api)["collections"][":id"]["$put"],
    200
>;

export const useUpdateChartMetadata = ({
    onSuccess,
}: {
    onSuccess: () => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (props) => {
            const response = await client.api["collections"][":id"].$put(props);
            if (!response.ok) {
                throw new Error("Failed to update chart metadata");
            }
            return await response.json();
        },
        onSuccess: (_data, variables) => {
            onSuccess();
            queryClient.removeQueries({
                queryKey: ["collections", variables.param.id],
            });
        },
    });
};
