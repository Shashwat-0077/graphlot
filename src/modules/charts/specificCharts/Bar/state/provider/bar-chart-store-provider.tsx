"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { StateProviderType } from "@/modules/charts/types";
import {
    BarChartAppearanceStore,
    createBarChartAppearanceStore,
    initChartBarAppearanceStore,
} from "@/modules/charts/specificCharts/Bar/state/store/appearance-store";
import {
    BarChartConfigStore,
    createBarChartConfigStore,
    initBarChartConfigStore,
} from "@/modules/charts/specificCharts/Bar/state/store/config-store";

export type BarChartAppearanceStoreApi = ReturnType<
    typeof createBarChartAppearanceStore
>;
export type BarChartConfigStoreApi = ReturnType<
    typeof createBarChartConfigStore
>;

export const BarChartAppearanceStoreContext = createContext<
    BarChartAppearanceStoreApi | undefined
>(undefined);

export const BarChartConfigStoreContext = createContext<
    BarChartConfigStoreApi | undefined
>(undefined);

export const BarChartStoreProvider: StateProviderType = ({ children }) => {
    const appearanceStoreRef = useRef<BarChartAppearanceStoreApi>(null);
    const configStoreRef = useRef<BarChartConfigStoreApi>(null);

    if (!appearanceStoreRef.current) {
        appearanceStoreRef.current = createBarChartAppearanceStore(
            initChartBarAppearanceStore()
        );
    }

    if (!configStoreRef.current) {
        configStoreRef.current = createBarChartConfigStore(
            initBarChartConfigStore()
        );
    }

    return (
        <BarChartAppearanceStoreContext.Provider
            value={appearanceStoreRef.current}
        >
            <BarChartConfigStoreContext.Provider value={configStoreRef.current}>
                {children}
            </BarChartConfigStoreContext.Provider>
        </BarChartAppearanceStoreContext.Provider>
    );
};

export const useBarChartAppearanceStore = <T,>(
    selector: (store: BarChartAppearanceStore) => T
): T => {
    const chartAppearanceStoreContext = useContext(
        BarChartAppearanceStoreContext
    );

    if (!chartAppearanceStoreContext) {
        throw new Error(
            `useBarChartAppearanceStore must be used within BarChartStoreProvider`
        );
    }

    return useStore(chartAppearanceStoreContext, selector);
};

export const useBarChartConfigStore = <T,>(
    selector: (store: BarChartConfigStore) => T
): T => {
    const chartConfigStoreContext = useContext(BarChartConfigStoreContext);

    if (!chartConfigStoreContext) {
        throw new Error(
            `useBarChartConfigStore must be used within BarChartStoreProvider`
        );
    }

    return useStore(chartConfigStoreContext, selector);
};
