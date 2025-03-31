"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { StateProviderType } from "@/modules/charts/types";
import {
    createDonutChartAppearanceStore,
    DonutChartAppearanceStore,
    initChartDonutAppearanceStore,
} from "@/modules/charts/specificCharts/Donut/state/store/appearance-store";
import {
    createDonutChartConfigStore,
    DonutChartConfigStore,
    initDonutChartConfigStore,
} from "@/modules/charts/specificCharts/Donut/state/store/config-store";

export type DonutChartAppearanceStoreApi = ReturnType<
    typeof createDonutChartAppearanceStore
>;
export type DonutChartConfigStoreApi = ReturnType<
    typeof createDonutChartConfigStore
>;

export const DonutChartAppearanceStoreContext = createContext<
    DonutChartAppearanceStoreApi | undefined
>(undefined);

export const DonutChartConfigStoreContext = createContext<
    DonutChartConfigStoreApi | undefined
>(undefined);

export interface DonutChartStoreProviderProps {
    children: ReactNode;
}

export const DonutChartStoreProvider: StateProviderType = ({ children }) => {
    const appearanceStoreRef = useRef<DonutChartAppearanceStoreApi>(null);
    const configStoreRef = useRef<DonutChartConfigStoreApi>(null);

    if (!appearanceStoreRef.current) {
        appearanceStoreRef.current = createDonutChartAppearanceStore(
            initChartDonutAppearanceStore()
        );
    }

    if (!configStoreRef.current) {
        configStoreRef.current = createDonutChartConfigStore(
            initDonutChartConfigStore()
        );
    }

    return (
        <DonutChartAppearanceStoreContext.Provider
            value={appearanceStoreRef.current}
        >
            <DonutChartConfigStoreContext.Provider
                value={configStoreRef.current}
            >
                {children}
            </DonutChartConfigStoreContext.Provider>
        </DonutChartAppearanceStoreContext.Provider>
    );
};

export const useDonutChartAppearanceStore = <T,>(
    selector: (store: DonutChartAppearanceStore) => T
): T => {
    const chartAppearanceStoreContext = useContext(
        DonutChartAppearanceStoreContext
    );

    if (!chartAppearanceStoreContext) {
        throw new Error(
            `useDonutChartAppearanceStore must be used within DonutChartStoreProvider`
        );
    }

    return useStore(chartAppearanceStoreContext, selector);
};

export const useDonutChartConfigStore = <T,>(
    selector: (store: DonutChartConfigStore) => T
): T => {
    const chartConfigStoreContext = useContext(DonutChartConfigStoreContext);

    if (!chartConfigStoreContext) {
        throw new Error(
            `useDonutChartConfigStore must be used within DonutChartStoreProvider`
        );
    }

    return useStore(chartConfigStoreContext, selector);
};
