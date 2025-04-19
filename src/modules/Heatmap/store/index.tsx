"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    HeatmapChartStore,
    createHeatmapChartStore,
    initHeatmapChartStore,
} from "@/modules/Heatmap/store/state";
import { StateProviderType } from "@/constants";
import { useGetHeatMapChartWithId } from "@/modules/Heatmap/api/client/useGetHeatmap";
import { BoxLoader } from "@/components/ui/Loader";

export type HeatmapChartStoreApi = ReturnType<typeof createHeatmapChartStore>;
export const HeatmapChartStoreContext = createContext<
    HeatmapChartStoreApi | undefined
>(undefined);

export const HeatmapChartStoreProvider: StateProviderType = ({
    children,
    char_id,
}) => {
    const storeRef = useRef<HeatmapChartStoreApi>(null);
    const { data, isLoading, error, isError } =
        useGetHeatMapChartWithId(char_id);

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
        storeRef.current = createHeatmapChartStore(
            initHeatmapChartStore(data.chart)
        );
    }

    return (
        <HeatmapChartStoreContext.Provider value={storeRef.current}>
            {children}
        </HeatmapChartStoreContext.Provider>
    );
};

export const useHeatmapChartStore = <T,>(
    selector: (store: HeatmapChartStore) => T
): T => {
    const storeContext = useContext(HeatmapChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useHeatmapChartStore must be used within HeatmapChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
