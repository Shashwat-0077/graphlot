"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    AreaChartStore,
    createAreaChartStore,
    initAreaChartStore,
} from "@/modules/Area/store/state";
import { useAreaChart } from "@/modules/Area/api/client/use-area-charts";
import { ChartStateProvider } from "@/constants";
import { SimpleLoader } from "@/components/ui/Loader";

export type AreaChartStoreApi = ReturnType<typeof createAreaChartStore>;
export const AreaChartStoreContext = createContext<
    AreaChartStoreApi | undefined
>(undefined);

export const AreaChartStoreProvider: ChartStateProvider = ({
    children,
    chartId,
}) => {
    const storeRef = useRef<AreaChartStoreApi>(null);
    const { data: chart, isLoading, error, isError } = useAreaChart(chartId);

    if (!chart || isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <SimpleLoader />
            </div>
        );
    }

    if (isError || error) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="text-red-500">
                    Error: {error?.message || "Something went wrong"}
                </div>
            </div>
        );
    }

    if (!storeRef.current) {
        const { specificConfig, ...rest } = chart;

        storeRef.current = createAreaChartStore(
            initAreaChartStore({
                ...rest,
                ...specificConfig,
            })
        );
    }

    return (
        <AreaChartStoreContext.Provider value={storeRef.current}>
            {children}
        </AreaChartStoreContext.Provider>
    );
};

export const useAreaChartStore = <T,>(
    selector: (store: AreaChartStore) => T
): T => {
    const storeContext = useContext(AreaChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useAreaChartStore must be used within AreaChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
