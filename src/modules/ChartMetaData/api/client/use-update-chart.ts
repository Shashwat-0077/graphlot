import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

// Type for GET response
type MetaDataUpdateRequestType = InferRequestType<
    (typeof client.api)["charts"][":id"]["$put"]
>;

// Type for PUT request body
type MetaDataUpdateResponseType = InferResponseType<
    (typeof client.api)["charts"][":id"]["$put"],
    200
>;

export const useUpdateChartMetadata = ({
    onSuccess,
}: {
    onSuccess: () => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation<
        MetaDataUpdateResponseType,
        Error,
        MetaDataUpdateRequestType
    >({
        mutationFn: async (props) => {
            const response = await client.api["charts"][":id"].$put(props);
            if (!response.ok) {
                throw new Error("Failed to update chart metadata");
            }
            return await response.json();
        },
        onSuccess: (data) => {
            onSuccess();
            queryClient.invalidateQueries({
                queryKey: ["chart-metadata", data.chartId],
            });
        },
    });
};

type ChangeTypeRequestType = InferRequestType<
    (typeof client.api)["charts"]["change-type"][":id"]["$patch"]
>;
type ChangeTypeResponseType = InferResponseType<
    (typeof client.api)["charts"]["change-type"][":id"]["$patch"],
    200
>;

export const useChangeChartType = () => {
    return useMutation<ChangeTypeResponseType, Error, ChangeTypeRequestType>({
        mutationFn: async (props) => {
            const response =
                await client.api["charts"]["change-type"][":id"].$patch(props);
            if (!response.ok) {
                throw new Error("Failed to change chart type");
            }
            return await response.json();
        },
    });
};
