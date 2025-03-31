"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { StateProviderType } from "@/modules/charts/types";
import {
    AreaChartAppearanceStore,
    createAreaChartAppearanceStore,
    initChartAreaAppearanceStore,
} from "@/modules/charts/specificCharts/Area/state/store/appearance-store";
import {
    AreaChartConfigStore,
    createAreaChartConfigStore,
    initAreaChartConfigStore,
} from "@/modules/charts/specificCharts/Area/state/store/config-store";

export type AreaChartAppearanceStoreApi = ReturnType<
    typeof createAreaChartAppearanceStore
>;
export type AreaChartConfigStoreApi = ReturnType<
    typeof createAreaChartConfigStore
>;

export const AreaChartAppearanceStoreContext = createContext<
    AreaChartAppearanceStoreApi | undefined
>(undefined);

export const AreaChartConfigStoreContext = createContext<
    AreaChartConfigStoreApi | undefined
>(undefined);

export const AreaChartStoreProvider: StateProviderType = ({ children }) => {
    const appearanceStoreRef = useRef<AreaChartAppearanceStoreApi>(null);
    const configStoreRef = useRef<AreaChartConfigStoreApi>(null);

    if (!appearanceStoreRef.current) {
        appearanceStoreRef.current = createAreaChartAppearanceStore(
            initChartAreaAppearanceStore()
        );
    }

    if (!configStoreRef.current) {
        configStoreRef.current = createAreaChartConfigStore(
            initAreaChartConfigStore()
        );
    }

    return (
        <AreaChartAppearanceStoreContext.Provider
            value={appearanceStoreRef.current}
        >
            <AreaChartConfigStoreContext.Provider
                value={configStoreRef.current}
            >
                {children}
            </AreaChartConfigStoreContext.Provider>
        </AreaChartAppearanceStoreContext.Provider>
    );
};

export const useAreaChartAppearanceStore = <T,>(
    selector: (store: AreaChartAppearanceStore) => T
): T => {
    const chartAppearanceStoreContext = useContext(
        AreaChartAppearanceStoreContext
    );

    if (!chartAppearanceStoreContext) {
        throw new Error(
            `useAreaChartAppearanceStore must be used within AreaChartStoreProvider`
        );
    }

    return useStore(chartAppearanceStoreContext, selector);
};

export const useAreaChartConfigStore = <T,>(
    selector: (store: AreaChartConfigStore) => T
): T => {
    const chartConfigStoreContext = useContext(AreaChartConfigStoreContext);

    if (!chartConfigStoreContext) {
        throw new Error(
            `useAreaChartConfigStore must be used within AreaChartStoreProvider`
        );
    }

    return useStore(chartConfigStoreContext, selector);
};
