import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type GetBarParams = {
  id: string;
};

export const useGetBar = (params: GetBarParams) => {
    return useQuery({
        queryKey: ["charts.bar", JSON.stringify({ params })],
        queryFn: async () => {
            const response = await client.api.v1["charts"]["bar"][":id"].$get({
                param: params,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch charts/bar");
            }

            return await response.json();
        },
        
    });
};

type UpdateBarRequest = InferRequestType<
    (typeof client.api.v1["charts"]["bar"])[":id"]["$put"]
>;
type UpdateBarResponse = InferResponseType<
    (typeof client.api.v1["charts"]["bar"])[":id"]["$put"],
    200
>;

export const useUpdateBar = () => {
    return useMutation<UpdateBarResponse, Error, UpdateBarRequest>({
        mutationFn: async (props) => {
            const response = await client.api.v1["charts"]["bar"][":id"].$put(props);

            if (!response.ok) {
                throw new Error("Failed to put charts/bar");
            }

            return await response.json();
        },
    });
};

