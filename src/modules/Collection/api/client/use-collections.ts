import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetAllCollections = () => {
    const query = useQuery({
        queryKey: ["collections", "all"],
        queryFn: async () => {
            const response = await client.api.collections["all"].$get();

            if (!response.ok) {
                throw new Error("Failed to fetch chart");
            }

            const { collections } = await response.json();
            return collections;
        },
    });

    return query;
};

export const useGetCollectionById = (id: string) => {
    const query = useQuery({
        queryKey: ["collections", id],
        queryFn: async () => {
            const response = await client.api.collections[":id"].$get({
                param: {
                    id: id,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chart");
            }

            const { collection } = await response.json();
            return collection;
        },
    });

    return query;
};
