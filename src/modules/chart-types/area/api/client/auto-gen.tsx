import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { getQueryClient } from "@/lib/query-client";

type GetAreaParams = {
  id: string;
};

export const useGetArea = ({params}: {params: GetAreaParams}) => {
    return useQuery({
        queryKey: ["area-chart", JSON.stringify({ params })],
        queryFn: async () => {
    const response = await client.api.v1["charts"]["area"][":id"].$get({
                param: params,
            });

    if (!response.ok) {
        const error = await response.json();
        if (error) {
            throw new Error(`${error}`);
        } else {
            throw new Error("Failed to fetch charts/area");
        }
    }

    return await response.json();
},
        
    });
};

type UpdateAreaRequest = InferRequestType<
    (typeof client.api.v1)["charts"]["area"][":id"]["$put"]
>;
type UpdateAreaResponse = InferResponseType<
    (typeof client.api.v1)["charts"]["area"][":id"]["$put"],
    200
>;

export const useUpdateArea = ({
onSuccess,
}: {
onSuccess?: (
    data: UpdateAreaResponse,
    variables: UpdateAreaRequest,
    context: unknown
) => void;
}) => {
    return useMutation<UpdateAreaResponse, Error, UpdateAreaRequest>({
        mutationFn: async (props) => {
    const response = await client.api.v1["charts"]["area"][":id"].$put(props);

    if (!response.ok) {
        const error = await response.json();
        if (error) {
            throw new Error(`${error}`);
        } else {
            throw new Error("Failed to put charts/area");
        }
    }

    return await response.json();
},
        onSuccess: (data, variables, context) => {
            onSuccess?.(data, variables, context);
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({ queryKey: ["area-chart"] });
        },
    });
};

