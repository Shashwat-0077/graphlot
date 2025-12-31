"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { ChartStateProvider } from "@/constants";
import {
    useGetChartBoxModel,
    useGetChartColors,
    useGetChartTypography,
    useGetChartVisuals,
} from "@/modules/chart-attributes/api/client";
import {
    BarRootStore,
    createBarChartStore,
} from "@/modules/chart-types/bar/store/state";
import { useGetBar } from "@/modules/chart-types/bar/api/client";

export type BarChartStoreApi = ReturnType<typeof createBarChartStore>;
export const BarChartStoreContext = createContext<BarChartStoreApi | undefined>(
    undefined
);

export const BarChartStoreProvider: ChartStateProvider = ({
    children,
    chartId,
}) => {
    const storeRef = useRef<BarChartStoreApi>(null);
    const {
        data: barConfig,
        isLoading: barConfigLoading,
        error: barConfigError,
    } = useGetBar({ params: { id: chartId } });
    const {
        data: chartVisuals,
        isLoading: chartVisualsLoading,
        error: chartVisualsError,
    } = useGetChartVisuals({ params: { id: chartId } });
    const {
        data: chartBoxModel,
        isLoading: chartBoxModelLoading,
        error: chartBoxModelError,
    } = useGetChartBoxModel({ params: { id: chartId } });
    const {
        data: chartColors,
        isLoading: chartColorsLoading,
        error: chartColorsError,
    } = useGetChartColors({ params: { id: chartId } });
    const {
        data: chartTypography,
        isLoading: chartTypographyLoading,
        error: chartTypographyError,
    } = useGetChartTypography({ params: { id: chartId } });

    storeRef.current = createBarChartStore({
        isLoading:
            barConfigLoading ||
            chartVisualsLoading ||
            chartBoxModelLoading ||
            chartColorsLoading ||
            chartTypographyLoading,
        error:
            barConfigError ||
            chartVisualsError ||
            chartBoxModelError ||
            chartColorsError ||
            chartTypographyError,
        ...barConfig,
        ...barConfig?.specificConfig,
        ...chartVisuals,
        ...chartBoxModel,
        ...chartColors,
        ...chartTypography,
    });

    return (
        <BarChartStoreContext.Provider value={storeRef.current}>
            {children}
        </BarChartStoreContext.Provider>
    );
};

export const useBarChartStore = <T,>(
    selector: (store: BarRootStore) => T
): T => {
    const storeContext = useContext(BarChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useBarChartStore must be used within BarChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
