import { chartEndpoints } from "./endpoints";

import { createReactQueryHooks } from "@/utils/react-query-factory";


export const chartHooks = createReactQueryHooks(chartEndpoints, "charts");
