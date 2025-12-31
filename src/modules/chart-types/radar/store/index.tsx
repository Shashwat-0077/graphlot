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
    RadarRootStore,
    createRadarChartStore,
} from "@/modules/chart-types/radar/store/state";
import { useGetRadar } from "@/modules/chart-types/radar/api/client";

export type RadarChartStoreApi = ReturnType<typeof createRadarChartStore>;
export const RadarChartStoreContext = createContext<
    RadarChartStoreApi | undefined
>(undefined);

export const RadarChartStoreProvider: ChartStateProvider = ({
    children,
    chartId,
}) => {
    const storeRef = useRef<RadarChartStoreApi>(null);
    const {
        data: radarConfig,
        isLoading: radarConfigLoading,
        error: radarConfigError,
    } = useGetRadar({ params: { id: chartId } });
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

    storeRef.current = createRadarChartStore({
        isLoading:
            radarConfigLoading ||
            chartVisualsLoading ||
            chartBoxModelLoading ||
            chartColorsLoading ||
            chartTypographyLoading,
        error:
            radarConfigError ||
            chartVisualsError ||
            chartBoxModelError ||
            chartColorsError ||
            chartTypographyError,
        ...radarConfig,
        ...chartVisuals,
        ...chartBoxModel,
        ...chartColors,
        ...chartTypography,
    });

    return (
        <RadarChartStoreContext.Provider value={storeRef.current}>
            {children}
        </RadarChartStoreContext.Provider>
    );
};

export const useRadarChartStore = <T,>(
    selector: (store: RadarRootStore) => T
): T => {
    const storeContext = useContext(RadarChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useRadarChartStore must be used within RadarChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
