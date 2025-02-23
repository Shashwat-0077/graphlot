"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    type ChartAppearanceStore,
    createChartAppearanceStore,
    initChartAppearanceStore,
} from "@/store/charts/appearance-store";
import {
    type ChartConfigStore,
    createChartConfigStore,
    initChartConfigStore,
} from "@/store/charts/config-store";

export type ChartAppearanceStoreApi = ReturnType<
    typeof createChartAppearanceStore
>;
export type ChartConfigStoreApi = ReturnType<typeof createChartConfigStore>;

export const ChartAppearanceStoreContext = createContext<
    ChartAppearanceStoreApi | undefined
>(undefined);

export const ChartConfigStoreContext = createContext<
    ChartConfigStoreApi | undefined
>(undefined);

export interface ChartStoreProviderProps {
    children: ReactNode;
}

export const ChartStoreProvider = ({ children }: ChartStoreProviderProps) => {
    const appearanceStoreRef = useRef<ChartAppearanceStoreApi>(null);
    const configStoreRef = useRef<ChartConfigStoreApi>(null);

    if (!appearanceStoreRef.current) {
        appearanceStoreRef.current = createChartAppearanceStore(
            initChartAppearanceStore()
        );
    }

    if (!configStoreRef.current) {
        configStoreRef.current = createChartConfigStore(initChartConfigStore());
    }

    return (
        <ChartAppearanceStoreContext.Provider
            value={appearanceStoreRef.current}
        >
            <ChartConfigStoreContext.Provider value={configStoreRef.current}>
                {children}
            </ChartConfigStoreContext.Provider>
        </ChartAppearanceStoreContext.Provider>
    );
};

export const useChartAppearanceStore = <T,>(
    selector: (store: ChartAppearanceStore) => T
): T => {
    const chartAppearanceStoreContext = useContext(ChartAppearanceStoreContext);

    if (!chartAppearanceStoreContext) {
        throw new Error(
            `useChartAppearanceStore must be used within ChartConfigStoreProvider`
        );
    }

    return useStore(chartAppearanceStoreContext, selector);
};

export const useChartConfigStore = <T,>(
    selector: (store: ChartConfigStore) => T
): T => {
    const chartConfigStoreContext = useContext(ChartConfigStoreContext);

    if (!chartConfigStoreContext) {
        throw new Error(
            `useChartConfigStore must be used within ChartConfigStoreProvider`
        );
    }

    return useStore(chartConfigStoreContext, selector);
};
