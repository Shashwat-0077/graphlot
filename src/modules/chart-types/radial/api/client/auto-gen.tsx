import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type GetRadialParams = {
  id: string;
};

export const useGetRadial = ({params}: {params: GetRadialParams}) => {
    return useQuery({
        queryKey: ["charts.radial", JSON.stringify({ params })],
        queryFn: async () => {
    const response = await client.api.v1["charts"]["radial"][":id"].$get({
                param: params,
            });

    if (!response.ok) {
        const error = await response.json();
        if (error) {
            throw new Error(`${error}`);
        } else {
            throw new Error("Failed to fetch charts/radial");
        }
    }

    return await response.json();
},
        
    });
};

type UpdateRadialRequest = InferRequestType<
    (typeof client.api.v1)["charts"]["radial"][":id"]["$put"]
>;
type UpdateRadialResponse = InferResponseType<
    (typeof client.api.v1)["charts"]["radial"][":id"]["$put"],
    200
>;

export const useUpdateRadial = () => {
    return useMutation<UpdateRadialResponse, Error, UpdateRadialRequest>({
        mutationFn: async (props) => {
    const response = await client.api.v1["charts"]["radial"][":id"].$put(props);

    if (!response.ok) {
        const error = await response.json();
        if (error) {
            throw new Error(`${error}`);
        } else {
            throw new Error("Failed to put charts/radial");
        }
    }

    return await response.json();
},
    });
};

