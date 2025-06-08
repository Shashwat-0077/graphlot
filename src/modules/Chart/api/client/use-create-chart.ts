import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api)["charts"]["create-chart"]["$post"]
>;

type ResponseType = InferResponseType<
    (typeof client.api)["charts"]["create-chart"]["$post"],
    200
>;
export const useCreateNewChart = ({
    onSuccess,
    onError,
}: {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
}) => {
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api["charts"]["create-chart"].$post({
                json: json,
            });
            if (!response.ok) {
                throw new Error("Failed to create new chart");
            }

            return await response.json();
        },
        onSuccess: (data) => {
            if (onSuccess) {
                onSuccess(data);
            }
        },
        onError: (error) => {
            if (onError) {
                onError(error);
            }
        },
    });
};
