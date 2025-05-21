import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
// Type for GET response
type RequestType = InferRequestType<
    (typeof client.api)["charts"]["create-chart"]["notion"]["$post"]
>;

// Type for PUT request body
type ResponseType = InferResponseType<
    (typeof client.api)["charts"]["create-chart"]["notion"]["$post"],
    200
>;
export const useCreateChartFromNotion = () => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api["charts"]["create-chart"][
                "notion"
            ].$post({
                json: json,
            });
            if (!response.ok) {
                throw new Error("Failed to create chart from Notion");
            }
            return response;
        },
    });
};
