// import { useQuery } from "@tanstack/react-query";
// import { InferRequestType, InferResponseType } from "hono";

// import { client } from "@/lib/rpc";
// import {
//     AreaChartSchema,
//     FullChartUpdateSchema,
// } from "@/modules/charts/schema";
// import { AREA, BAR } from "@/modules/charts/constants";
// import {
//     useAreaChartAppearanceStore,
//     useAreaChartConfigStore,
// } from "@/modules/charts/specificCharts/Area/state/provider/area-chart-store-provider";
// import { getRGBAString } from "@/utils/getRGBAString";

// type RequestType = InferRequestType<
//     (typeof client.api.charts.full)[":chart_id"]["$put"]
// >;

// type ResponseType = InferResponseType<
//     (typeof client.api.charts.full)[":chart_id"]["$put"],
//     200
// >;

// const getAreaChartsAttr = (): Zod.infer<typeof FullChartUpdateSchema> => {
//     const app_state = useAreaChartAppearanceStore((state) => state);
//     const conf_state = useAreaChartConfigStore((state) => state);
//     return {
//         type: AREA,
//         background_color: getRGBAString(app_state.bgColor),
//         x_axis: conf_state.xAxis,
//         y_axis: conf_state.yAxis,
//         grid_color: getRGBAString(app_state.gridColor),
//         show_grid: app_state.showGrid ? 1 : 0,
//         show_legend: app_state.showLegends ? 1 : 0,
//         show_tooltip: app_state.showToolTip ? 1 : 0,
//         text_color: getRGBAString(app_state.labelColor),
//         colors: app_state.colors,
//     };
// };

// export const useUpdateChart = (chart_id: string) => {
//     return useQuery<ResponseType, Error, RequestType>({
//         queryKey: ["chart", chart_id], // Unique cache key
//         queryFn: async () => {
//             const response = await client.api.charts[":chart_id"].$get({
//                 param: { chart_id },
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to fetch chart");
//             }

//             return response.json();
//         },
//         enabled: !!chart_id, // Avoid unnecessary requests
//     });
// };
