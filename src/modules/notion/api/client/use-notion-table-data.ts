import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api.notion)[":notionTableId"]["get-table-data"]["$get"],
    200
>;

export const useNotionTableData = ({
    notionTableId,
    userId,
}: {
    notionTableId: string;
    userId: string;
}) => {
    const query = useQuery<ResponseType, Error>({
        queryKey: ["table-data"],
        queryFn: async () => {
            const response = await client.api.notion[":notionTableId"][
                "get-table-data"
            ]["$get"]({
                param: {
                    notionTableId: notionTableId,
                },
                query: {
                    userId,
                },
            });

            if (!response.ok) {
                throw new Error("error occurred");
            }

            return await response.json();
        },
        enabled: !!notionTableId,
    });

    return query;
};
