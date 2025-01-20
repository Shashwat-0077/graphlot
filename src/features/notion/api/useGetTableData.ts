import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api.notion)[":id"]["get-table-data"]["$get"]
>;
type RequestType = InferRequestType<
    (typeof client.api.notion)[":id"]["get-table-data"]["$get"]
>;

export const useGetAllDatabases = () => {
    const query = useQuery<ResponseType, Error, RequestType>({
        queryKey: ["table-data"],
        queryFn: async () => {
            const response = await client.api.notion[":id"]["get-table-data"][
                "$get"
            ]({
                param: {
                    id: "1534edf4-c844-80e2-8104-c3a8017b216c",
                },
            });

            if (!response.ok) {
                return null;
            }

            const { parsedData } = await response.json();
            return parsedData;
        },
    });

    return query;
};
