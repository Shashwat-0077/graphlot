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
    RadialRootStore,
    createRadialChartStore,
} from "@/modules/chart-types/radial/store/state";
import { useGetRadial } from "@/modules/chart-types/radial/api/client";

export type RadialChartStoreApi = ReturnType<typeof createRadialChartStore>;
export const RadialChartStoreContext = createContext<
    RadialChartStoreApi | undefined
>(undefined);

export const RadialChartStoreProvider: ChartStateProvider = ({
    children,
    chartId,
}) => {
    const storeRef = useRef<RadialChartStoreApi>(null);
    const {
        data: radialConfig,
        isLoading: radialConfigLoading,
        error: radialConfigError,
    } = useGetRadial({ params: { id: chartId } });
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

    storeRef.current = createRadialChartStore({
        isLoading:
            radialConfigLoading ||
            chartVisualsLoading ||
            chartBoxModelLoading ||
            chartColorsLoading ||
            chartTypographyLoading,
        error:
            radialConfigError ||
            chartVisualsError ||
            chartBoxModelError ||
            chartColorsError ||
            chartTypographyError,
        ...radialConfig,
        ...chartVisuals,
        ...chartBoxModel,
        ...chartColors,
        ...chartTypography,
    });

    return (
        <RadialChartStoreContext.Provider value={storeRef.current}>
            {children}
        </RadialChartStoreContext.Provider>
    );
};

export const useRadialChartStore = <T,>(
    selector: (store: RadialRootStore) => T
): T => {
    const storeContext = useContext(RadialChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useRadialChartStore must be used within RadialChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
