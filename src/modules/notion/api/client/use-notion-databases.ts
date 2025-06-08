import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useNotionDatabases = (
    userId: string | undefined,
    options: {
        enabled?: boolean;
    }
) => {
    const query = useQuery({
        queryKey: ["all-databases"],
        queryFn: async () => {
            if (!userId) {
                throw new Error("userId is required");
            }

            const response = await client.api.notion["get-databases"]["$get"]({
                query: {
                    userId: userId,
                },
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }

            const { databases } = await response.json();
            return databases;
        },
        enabled: options?.enabled ?? true,
    });

    return query;
};
