import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api)["area-chart"][":id"]["$get"],
    200
>;

export const useAreaChart = (id: string) => {
    return useQuery<ResponseType, Error>({
        queryKey: ["area-chart", id], // Unique cache key
        queryFn: async () => {
            const response = await client.api["area-chart"][":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart");
            }
            const data = await response.json();
            return data;
        },
        enabled: !!id, // Avoid unnecessary requests
    });
};
