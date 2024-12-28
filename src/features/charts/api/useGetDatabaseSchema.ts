import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetDatabaseSchema = () => {
    const query = useQuery({
        queryKey: ["all-databases"],
        queryFn: async () => {
            const response = await client.api.charts[":id"]["get-table-schema"][
                "$get"
            ]({
                param: {
                    id: "1534edf4-c844-80e2-8104-c3a8017b216c",
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
