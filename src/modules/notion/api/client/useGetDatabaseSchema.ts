import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetDatabaseSchema = (id: string) => {
    const query = useQuery({
        queryKey: ["database-schema"],
        queryFn: async () => {
            const response = await client.api.notion[":notion_table_id"][
                "get-table-schema"
            ]["$get"]({
                param: {
                    notion_table_id: id,
                },
            });

            if (!response.ok) {
                return null;
            }

            const { schema } = await response.json();
            return schema;
        },
        staleTime: 0,
    });

    return query;
};
