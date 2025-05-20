"use client";

import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import { BoxLoader } from "@/components/ui/Loader";
import { ChartStateProvider } from "@/constants";
import { useAreaChart } from "@/modules/Area/api/client";
import {
    ChartBoxModelStore,
    ChartColorStore,
    ChartTypographyStore,
    ChartVisualStore,
    createChartBoxModelStore,
    createChartColorStore,
    createChartTypographyStore,
    createChartVisualStore,
    initChartBoxModelState,
    initChartColorState,
    initChartTypographyState,
    initChartVisualState,
} from "@/modules/ChartMetaData/store/state";

// === ChartVisualStore ===
export type ChartVisualStoreApi = ReturnType<typeof createChartVisualStore>;
export type ChartTypographyStoreApi = ReturnType<
    typeof createChartTypographyStore
>;
export type ChartBoxModelStoreApi = ReturnType<typeof createChartBoxModelStore>;
export type ChartColorStoreApi = ReturnType<typeof createChartColorStore>;

export const ChartVisualStoreContext = createContext<
    ChartVisualStoreApi | undefined
>(undefined);
export const ChartTypographyStoreContext = createContext<
    ChartTypographyStoreApi | undefined
>(undefined);
export const ChartBoxModelStoreContext = createContext<
    ChartBoxModelStoreApi | undefined
>(undefined);
export const ChartColorStoreContext = createContext<
    ChartColorStoreApi | undefined
>(undefined);

export const ChartConfigStoreProvider: ChartStateProvider = ({
    children,
    chartId,
}) => {
    const visualStoreRef = useRef<ChartVisualStoreApi>(null);
    const boxModelStoreRef = useRef<ChartBoxModelStoreApi>(null);
    const typographyStoreRef = useRef<ChartTypographyStoreApi>(null);
    const colorStoreRef = useRef<ChartColorStoreApi>(null);

    const { data, isLoading, error, isError } = useAreaChart(chartId);

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

    const {
        chart: {
            chart_visual,
            chart_typography,
            chart_box_model,
            chart_colors,
        },
    } = data;

    if (!visualStoreRef.current) {
        visualStoreRef.current = createChartVisualStore(
            initChartVisualState(chart_visual)
        );
    }

    if (!typographyStoreRef.current) {
        typographyStoreRef.current = createChartTypographyStore(
            initChartTypographyState(chart_typography)
        );
    }

    if (!boxModelStoreRef.current) {
        boxModelStoreRef.current = createChartBoxModelStore(
            initChartBoxModelState(chart_box_model)
        );
    }

    if (!colorStoreRef.current) {
        colorStoreRef.current = createChartColorStore(
            initChartColorState(chart_colors)
        );
    }

    return (
        <ChartVisualStoreContext.Provider value={visualStoreRef.current}>
            <ChartTypographyStoreContext.Provider
                value={typographyStoreRef.current}
            >
                <ChartBoxModelStoreContext.Provider
                    value={boxModelStoreRef.current}
                >
                    <ChartColorStoreContext.Provider
                        value={colorStoreRef.current}
                    >
                        {children}
                    </ChartColorStoreContext.Provider>
                </ChartBoxModelStoreContext.Provider>
            </ChartTypographyStoreContext.Provider>
        </ChartVisualStoreContext.Provider>
    );
};

export const useChartVisualStore = <T,>(
    selector: (store: ChartVisualStore) => T
): T => {
    const storeContext = useContext(ChartVisualStoreContext);

    if (!storeContext) {
        throw new Error(
            "useChartVisualStore must be used within a ChartStateProvider"
        );
    }

    return useStore(storeContext, selector);
};

export const useChartTypographyStore = <T,>(
    selector: (store: ChartTypographyStore) => T
): T => {
    const storeContext = useContext(ChartTypographyStoreContext);

    if (!storeContext) {
        throw new Error(
            "useChartTypographyStore must be used within a ChartStateProvider"
        );
    }

    return useStore(storeContext, selector);
};

export const useChartBoxModelStore = <T,>(
    selector: (store: ChartBoxModelStore) => T
): T => {
    const storeContext = useContext(ChartBoxModelStoreContext);

    if (!storeContext) {
        throw new Error(
            "useChartBoxModelStore must be used within a ChartStateProvider"
        );
    }

    return useStore(storeContext, selector);
};

export const useChartColorStore = <T,>(
    selector: (store: ChartColorStore) => T
): T => {
    const storeContext = useContext(ChartColorStoreContext);

    if (!storeContext) {
        throw new Error(
            "useChartColorStore must be used within a ChartStateProvider"
        );
    }

    return useStore(storeContext, selector);
};
