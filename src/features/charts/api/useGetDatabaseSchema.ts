import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetDatabaseSchema = (id: string) => {
    const query = useQuery({
        queryKey: ["database-schema"],
        queryFn: async () => {
            const response = await client.api.charts[":id"]["get-table-schema"][
                "$get"
            ]({
                param: {
                    id: id,
                },
            });

            if (!response.ok) {
                return null;
            }

            const { schema } = await response.json();
            return schema;
        },
    });

    return query;
};
