"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    HeatmapChartStore,
    createHeatmapChartStore,
    initHeatmapChartStore,
} from "@/modules/Heatmap/store/state";

export type HeatmapChartStoreApi = ReturnType<typeof createHeatmapChartStore>;
export const HeatmapChartStoreContext = createContext<
    HeatmapChartStoreApi | undefined
>(undefined);

export const HeatmapChartStoreProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const storeRef = useRef<HeatmapChartStoreApi>(null);

    if (!storeRef.current) {
        storeRef.current = createHeatmapChartStore(initHeatmapChartStore());
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
