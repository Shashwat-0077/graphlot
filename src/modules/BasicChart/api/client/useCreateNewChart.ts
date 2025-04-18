"use client";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { FieldError } from "@/utils/FieldError";

type RequestType = InferRequestType<
    (typeof client.api.charts)["create-chart"]["$post"]
>;
type ResponseType = InferResponseType<
    (typeof client.api.charts)["create-chart"]["$post"],
    200
>;

type FieldWithErrors =
    | "type"
    | "name"
    | "description"
    | "notion_database_id"
    | "root";

export const useCreateNewChart = () => {
    return useMutation<ResponseType, FieldError<FieldWithErrors>, RequestType>({
        mutationFn: async ({ form }) => {
            const response = await client.api.charts["create-chart"].$post({
                form,
            });

            if (!response.ok) {
                const { error, field } = await response.json();
                let errField = field;
                if (
                    !(
                        errField === "type" ||
                        errField === "name" ||
                        errField === "description" ||
                        errField === "notion_database_id"
                    )
                ) {
                    errField = "root";
                }

                throw new FieldError<FieldWithErrors>({
                    message: error,
                    field: errField as FieldWithErrors,
                });
            }

            return await response.json();
        },
    });
};
