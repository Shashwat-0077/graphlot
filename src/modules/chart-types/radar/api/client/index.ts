import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type GetRadarParams = {
  id: string;
};

export const useGetRadar = (params: GetRadarParams) => {
    return useQuery({
        queryKey: ["charts.radar", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"]["radar"][":id"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts/radar");
            }

            return await response.json();
        },
        
    });
};

type UpdateRadarRequest = InferRequestType<
    (typeof client.api.v1["charts"]["radar"])[":id"]["$put"]
>;
type UpdateRadarResponse = InferResponseType<
    (typeof client.api.v1["charts"]["radar"])[":id"]["$put"],
    200
>;

export const useUpdateRadar = () => {
    return useMutation<UpdateRadarResponse, Error, UpdateRadarRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"]["radar"][":id"].$put(props);

            if (!response.ok) {
                throw new Error("Failed to put charts/radar");
            }

            return await response.json();
        },
    });
};

