import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetAllCollections = () => {
    const query = useQuery({
        queryKey: ["current"],
        queryFn: async () => {
            const response = await client.api.collections["all"].$get();

            if (!response.ok) {
                return null;
            }

            const { collections } = await response.json();
            return collections;
        },
    });

    return query;
};
