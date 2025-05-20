"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { BoxLoader } from "@/components/ui/Loader";
import { ChartStateProvider } from "@/constants";
import {
    createRadialChartStore,
    initRadialChartStore,
    RadialChartStore,
} from "@/modules/Radial/store/state";
import { useRadialChart } from "@/modules/Radial/api/client/use-radial-chart";

export type RadialChartStoreApi = ReturnType<typeof createRadialChartStore>;
export const RadialChartStoreContext = createContext<
    RadialChartStoreApi | undefined
>(undefined);

export const RadialChartStoreProvider: ChartStateProvider = ({
    children,
    chartId,
}) => {
    const storeRef = useRef<RadialChartStoreApi>(null);
    const { data: chart, isLoading, error, isError } = useRadialChart(chartId);

    if (!chart || isLoading) {
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
        storeRef.current = createRadialChartStore(initRadialChartStore(chart));
    }

    return (
        <RadialChartStoreContext.Provider value={storeRef.current}>
            {children}
        </RadialChartStoreContext.Provider>
    );
};

export const useRadialChartStore = <T,>(
    selector: (store: RadialChartStore) => T
): T => {
    const storeContext = useContext(RadialChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useRadialChartStore must be used within RadialChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
