import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api)["radar-chart"][":chart_id"]["$get"],
    200
>;

export const useGetRadarChartWithId = (chart_id: string) => {
    return useQuery<ResponseType, Error>({
        queryKey: ["radar-chart", chart_id], // Unique cache key
        queryFn: async () => {
            const response = await client.api["radar-chart"][":chart_id"].$get({
                param: { chart_id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart");
            }
            const data = await response.json();
            return data;
        },
        enabled: !!chart_id, // Avoid unnecessary requests
    });
};
