import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetDatabaseSchema = ({
    notion_table_id,
    user_id,
}: {
    notion_table_id: string;
    user_id?: string;
}) => {
    const query = useQuery({
        queryKey: ["database-schema"],
        queryFn: async () => {
            if (!user_id) {
                throw new Error("user_id is required");
            }

            const response = await client.api.notion[":notion_table_id"][
                "get-table-schema"
            ]["$get"]({
                param: {
                    notion_table_id,
                },
                query: {
                    user_id,
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
