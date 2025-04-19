import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api)["donut-chart"][":chart_id"]["$get"],
    200
>;

export const useGetDonutChartWithId = (chart_id: string) => {
    return useQuery<ResponseType, Error>({
        queryKey: ["donut-chart", chart_id], // Unique cache key
        queryFn: async () => {
            const response = await client.api["donut-chart"][":chart_id"].$get({
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
