import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api)["charts"][":id"]["$delete"]
>;

// Type for PUT request body
type ResponseType = InferResponseType<
    (typeof client.api)["charts"][":id"]["$delete"],
    200
>;

export const useDeleteChartMetadata = ({
    onSuccess,
}: {
    onSuccess: () => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (props) => {
            const response = await client.api["charts"][":id"].$delete(props);
            if (!response.ok) {
                throw new Error("Failed to delete chart");
            }
            return await response.json();
        },
        onSuccess: (_, id) => {
            onSuccess();
            queryClient.invalidateQueries({
                queryKey: ["chart-metadata-collection"],
            });
            queryClient.removeQueries({ queryKey: ["chart-metadata", id] });
        },
    });
};
