"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    type RadarChartAppearanceStore,
    createRadarChartAppearanceStore,
    initChartRadarAppearanceStore,
} from "@/modules/charts/Radar/state/store/appearance-store";
import {
    type RadarChartConfigStore,
    createRadarChartConfigStore,
    initRadarChartConfigStore,
} from "@/modules/charts/Radar/state/store/config-store";
import { StateProviderType } from "@/modules/charts/types";

export type RadarChartAppearanceStoreApi = ReturnType<
    typeof createRadarChartAppearanceStore
>;
export type RadarChartConfigStoreApi = ReturnType<
    typeof createRadarChartConfigStore
>;

export const RadarChartAppearanceStoreContext = createContext<
    RadarChartAppearanceStoreApi | undefined
>(undefined);

export const RadarChartConfigStoreContext = createContext<
    RadarChartConfigStoreApi | undefined
>(undefined);

export interface RadarChartStoreProviderProps {
    children: ReactNode;
}

export const RadarChartStoreProvider: StateProviderType = ({ children }) => {
    const appearanceStoreRef = useRef<RadarChartAppearanceStoreApi>(null);
    const configStoreRef = useRef<RadarChartConfigStoreApi>(null);

    if (!appearanceStoreRef.current) {
        appearanceStoreRef.current = createRadarChartAppearanceStore(
            initChartRadarAppearanceStore()
        );
    }

    if (!configStoreRef.current) {
        configStoreRef.current = createRadarChartConfigStore(
            initRadarChartConfigStore()
        );
    }

    return (
        <RadarChartAppearanceStoreContext.Provider
            value={appearanceStoreRef.current}
        >
            <RadarChartConfigStoreContext.Provider
                value={configStoreRef.current}
            >
                {children}
            </RadarChartConfigStoreContext.Provider>
        </RadarChartAppearanceStoreContext.Provider>
    );
};

export const useRadarChartAppearanceStore = <T,>(
    selector: (store: RadarChartAppearanceStore) => T
): T => {
    const chartAppearanceStoreContext = useContext(
        RadarChartAppearanceStoreContext
    );

    if (!chartAppearanceStoreContext) {
        throw new Error(
            `useRadarChartAppearanceStore must be used within RadarChartStoreProvider`
        );
    }

    return useStore(chartAppearanceStoreContext, selector);
};

export const useRadarChartConfigStore = <T,>(
    selector: (store: RadarChartConfigStore) => T
): T => {
    const chartConfigStoreContext = useContext(RadarChartConfigStoreContext);

    if (!chartConfigStoreContext) {
        throw new Error(
            `useRadarChartConfigStore must be used within RadarChartStoreProvider`
        );
    }

    return useStore(chartConfigStoreContext, selector);
};
