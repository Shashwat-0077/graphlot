import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type GetAreaParams = {
  id: string;
};

export const useGetArea = ({params}: {params: GetAreaParams}) => {
    return useQuery({
        queryKey: ["charts.area", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"]["area"][":id"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts/area");
            }

            return await response.json();
        },
        
    });
};

type UpdateAreaRequest = InferRequestType<
    (typeof client.api.v1)["charts"]["area"][":id"]["$put"]
>;
type UpdateAreaResponse = InferResponseType<
    (typeof client.api.v1)["charts"]["area"][":id"]["$put"],
    200
>;

export const useUpdateArea = () => {
    return useMutation<UpdateAreaResponse, Error, UpdateAreaRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"]["area"][":id"].$put(props);

            if (!response.ok) {
                throw new Error("Failed to put charts/area");
            }

            return await response.json();
        },
    });
};

