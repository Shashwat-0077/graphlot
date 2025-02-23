import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api.charts)[":chart_id"]["$get"],
    200
>;

export const useGetChartWithId = (chart_id: string, collection_id: string) => {
    return useQuery<ResponseType, Error>({
        queryKey: ["chart", chart_id, collection_id], // Unique cache key
        queryFn: async () => {
            const response = await client.api.charts[":chart_id"].$get({
                param: { chart_id },
                query: { collection_id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart");
            }

            return response.json();
        },
        enabled: !!chart_id && !!collection_id, // Avoid unnecessary requests
    });
};
