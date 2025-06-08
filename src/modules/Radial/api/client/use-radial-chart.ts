import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

// Basic radial chart query
export const useRadialChart = (id: string) => {
    return useQuery({
        queryKey: ["radial-chart", id],
        queryFn: async () => {
            const response = await client.api["radial-chart"][":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch radial chart");
            }

            const data = await response.json();
            return data.chart;
        },
        enabled: !!id,
    });
};

// Full radial chart query (e.g. includes metadata, data, config, etc.)
export const useFullRadialChart = (id: string) => {
    return useQuery({
        queryKey: ["full-radial-chart", id],
        queryFn: async () => {
            const response = await client.api["radial-chart"][":id"][
                "full"
            ].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch full radial chart");
            }

            const data = await response.json();
            return data.chart;
        },
        enabled: !!id,
    });
};
