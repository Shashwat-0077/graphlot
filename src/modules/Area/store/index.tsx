"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    AreaChartStore,
    createAreaChartStore,
    initAreaChartStore,
} from "@/modules/Area/store/state";
import { useAreaChart } from "@/modules/Area/api/client/user-area-charts";
import { BoxLoader } from "@/components/ui/Loader";
import { ChartStateProvider } from "@/constants";

export type AreaChartStoreApi = ReturnType<typeof createAreaChartStore>;
export const AreaChartStoreContext = createContext<
    AreaChartStoreApi | undefined
>(undefined);

export const AreaChartStoreProvider: ChartStateProvider = ({
    children,
    chartId,
}) => {
    const storeRef = useRef<AreaChartStoreApi>(null);
    const { data, isLoading, error, isError } = useAreaChart(chartId);

    if (!data || isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <BoxLoader />
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
        storeRef.current = createAreaChartStore(initAreaChartStore(data.chart));
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
