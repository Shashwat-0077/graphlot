"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { ChartStateProvider } from "@/constants";
import {
    createHeatmapStore,
    HeatmapRootStore,
} from "@/modules/chart-types/heatmap/store/state";
import { useGetHeatmap } from "@/modules/chart-types/heatmap/api/client";

export type HeatmapStoreApi = ReturnType<typeof createHeatmapStore>;
export const HeatmapStoreContext = createContext<HeatmapStoreApi | undefined>(
    undefined
);

export const HeatmapStoreProvider: ChartStateProvider = ({
    children,
    chartId,
}) => {
    const storeRef = useRef<HeatmapStoreApi>(null);
    const {
        data: heatmapConfig,
        isLoading: heatmapConfigLoading,
        error: heatmapConfigError,
    } = useGetHeatmap({ params: { id: chartId } });

    storeRef.current = createHeatmapStore({
        isLoading: heatmapConfigLoading,
        error: heatmapConfigError,
        ...heatmapConfig,
    });

    return (
        <HeatmapStoreContext.Provider value={storeRef.current}>
            {children}
        </HeatmapStoreContext.Provider>
    );
};

export const useHeatmapStore = <T,>(
    selector: (store: HeatmapRootStore) => T
): T => {
    const storeContext = useContext(HeatmapStoreContext);

    if (!storeContext) {
        throw new Error(
            `useHeatmapChartStore must be used within HeatmapChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
