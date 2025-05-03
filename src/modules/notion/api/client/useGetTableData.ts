import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api.notion)[":notion_table_id"]["get-table-data"]["$get"],
    200
>;

export const useGetTableData = ({
    notion_table_id,
    user_id,
}: {
    notion_table_id: string;
    user_id: string;
}) => {
    const query = useQuery<ResponseType, Error>({
        queryKey: ["table-data"],
        queryFn: async () => {
            const response = await client.api.notion[":notion_table_id"][
                "get-table-data"
            ]["$get"]({
                param: {
                    notion_table_id: notion_table_id,
                },
                query: {
                    user_id,
                },
            });

            if (!response.ok) {
                throw new Error("error occurred");
            }

            return await response.json();
        },
        enabled: !!notion_table_id,
    });

    return query;
};
