import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetAllDatabases = ({ user_id }: { user_id?: string }) => {
    const query = useQuery({
        queryKey: ["all-databases"],
        queryFn: async () => {
            if (!user_id) {
                throw new Error("user_id is required");
            }

            const response = await client.api.notion["get-databases"]["$get"]({
                query: {
                    user_id,
                },
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }

            const { databases } = await response.json();
            return databases;
        },
    });

    return query;
};
