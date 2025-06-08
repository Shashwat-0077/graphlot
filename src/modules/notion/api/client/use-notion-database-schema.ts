import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useNotionDatabaseSchema = ({
    notionTableId,
    userId,
}: {
    notionTableId: string;
    userId?: string;
}) => {
    const query = useQuery({
        queryKey: ["notion-database-schema"],
        queryFn: async () => {
            if (!userId) {
                throw new Error("user_id is required");
            }

            const response = await client.api.notion[":notionTableId"][
                "get-table-schema"
            ]["$get"]({
                param: {
                    notionTableId: notionTableId,
                },
                query: {
                    userId: userId,
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
