"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    type HeatmapChartAppearanceStore,
    createHeatmapChartAppearanceStore,
    initChartHeatmapAppearanceStore,
} from "@/modules/charts/Heatmap/state/store/appearance-store";
import { StateProviderType } from "@/modules/charts/types";

export type HeatmapChartAppearanceStoreApi = ReturnType<
    typeof createHeatmapChartAppearanceStore
>;

export const HeatmapChartAppearanceStoreContext = createContext<
    HeatmapChartAppearanceStoreApi | undefined
>(undefined);

export interface HeatmapChartStoreProviderProps {
    children: ReactNode;
}

export const HeatmapChartStoreProvider: StateProviderType = ({ children }) => {
    const appearanceStoreRef = useRef<HeatmapChartAppearanceStoreApi>(null);

    if (!appearanceStoreRef.current) {
        appearanceStoreRef.current = createHeatmapChartAppearanceStore(
            initChartHeatmapAppearanceStore()
        );
    }

    return (
        <HeatmapChartAppearanceStoreContext.Provider
            value={appearanceStoreRef.current}
        >
            {children}
        </HeatmapChartAppearanceStoreContext.Provider>
    );
};

export const useHeatmapChartAppearanceStore = <T,>(
    selector: (store: HeatmapChartAppearanceStore) => T
): T => {
    const chartAppearanceStoreContext = useContext(
        HeatmapChartAppearanceStoreContext
    );

    if (!chartAppearanceStoreContext) {
        throw new Error(
            `useHeatmapChartAppearanceStore must be used within HeatmapChartStoreProvider`
        );
    }

    return useStore(chartAppearanceStoreContext, selector);
};
