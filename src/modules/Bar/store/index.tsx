"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { ChartStateProvider } from "@/constants";
import { SimpleLoader } from "@/components/ui/Loader";
import {
    BarChartStore,
    createBarChartStore,
    initBarChartStore,
} from "@/modules/Bar/store/state";
import { useBarChart } from "@/modules/Bar/api/client/use-bar-chart";

export type BarChartStoreApi = ReturnType<typeof createBarChartStore>;
export const BarChartStoreContext = createContext<BarChartStoreApi | undefined>(
    undefined
);

export const BarChartStoreProvider: ChartStateProvider = ({
    children,
    chartId,
}) => {
    const storeRef = useRef<BarChartStoreApi>(null);
    const { data: chart, isLoading, error, isError } = useBarChart(chartId);

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

        storeRef.current = createBarChartStore(
            initBarChartStore({
                ...rest,
                ...specificConfig,
            })
        );
    }

    return (
        <BarChartStoreContext.Provider value={storeRef.current}>
            {children}
        </BarChartStoreContext.Provider>
    );
};

export const useBarChartStore = <T,>(
    selector: (store: BarChartStore) => T
): T => {
    const storeContext = useContext(BarChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useBarChartStore must be used within BarChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
