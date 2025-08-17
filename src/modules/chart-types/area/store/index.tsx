"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    AreaRootStore,
    createAreaChartStore,
} from "@/modules/chart-types/area/store/state";
import { ChartStateProvider } from "@/constants";
import { useGetArea } from "@/modules/chart-types/area/api/client";
import {
    useGetChartBoxModel,
    useGetChartColors,
    useGetChartTypography,
    useGetChartVisuals,
} from "@/modules/chart-attributes/api/client";

export type AreaChartStoreApi = ReturnType<typeof createAreaChartStore>;
export const AreaChartStoreContext = createContext<
    AreaChartStoreApi | undefined
>(undefined);

export const AreaChartStoreProvider: ChartStateProvider = ({
    children,
    chartId,
}) => {
    const storeRef = useRef<AreaChartStoreApi>(null);
    const {
        data: areaConfig,
        isLoading: areaConfigLoading,
        error: areaConfigError,
    } = useGetArea({ params: { id: chartId } });
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

    storeRef.current = createAreaChartStore({
        isLoading:
            areaConfigLoading ||
            chartVisualsLoading ||
            chartBoxModelLoading ||
            chartColorsLoading ||
            chartTypographyLoading,
        error:
            areaConfigError ||
            chartVisualsError ||
            chartBoxModelError ||
            chartColorsError ||
            chartTypographyError,
        ...areaConfig,
        ...areaConfig?.specificConfig,
        ...chartVisuals,
        ...chartBoxModel,
        ...chartColors,
        ...chartTypography,
    });

    return (
        <AreaChartStoreContext.Provider value={storeRef.current}>
            {children}
        </AreaChartStoreContext.Provider>
    );
};

export const useAreaChartStore = <T,>(
    selector: (store: AreaRootStore) => T
): T => {
    const storeContext = useContext(AreaChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useAreaChartStore must be used within AreaChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
