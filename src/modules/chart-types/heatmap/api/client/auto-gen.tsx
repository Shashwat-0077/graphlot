import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type GetHeatmapParams = {
  id: string;
};

export const useGetHeatmap = ({params}: {params: GetHeatmapParams}) => {
    return useQuery({
        queryKey: ["charts.heatmap", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"]["heatmap"][":id"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts/heatmap");
            }

            return await response.json();
        },
        
    });
};

type UpdateHeatmapRequest = InferRequestType<
    (typeof client.api.v1)["charts"]["heatmap"][":id"]["$put"]
>;
type UpdateHeatmapResponse = InferResponseType<
    (typeof client.api.v1)["charts"]["heatmap"][":id"]["$put"],
    200
>;

export const useUpdateHeatmap = () => {
    return useMutation<UpdateHeatmapResponse, Error, UpdateHeatmapRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"]["heatmap"][":id"].$put(props);

            if (!response.ok) {
                throw new Error("Failed to put charts/heatmap");
            }

            return await response.json();
        },
    });
};

