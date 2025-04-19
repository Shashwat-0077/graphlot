"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    RadarChartStore,
    createRadarChartStore,
    initRadarChartStore,
} from "@/modules/Radar/store/state";
import { StateProviderType } from "@/constants";
import { useGetRadarChartWithId } from "@/modules/Radar/api/client/useGetRadarChart";
import { BoxLoader } from "@/components/ui/Loader";

export type RadarChartStoreApi = ReturnType<typeof createRadarChartStore>;
export const RadarChartStoreContext = createContext<
    RadarChartStoreApi | undefined
>(undefined);

export const RadarChartStoreProvider: StateProviderType = ({
    children,
    char_id,
}) => {
    const storeRef = useRef<RadarChartStoreApi>(null);
    const { data, isLoading, error, isError } = useGetRadarChartWithId(char_id);

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

    if (!storeRef.current) {
        storeRef.current = createRadarChartStore(
            initRadarChartStore(data.chart)
        );
    }

    return (
        <RadarChartStoreContext.Provider value={storeRef.current}>
            {children}
        </RadarChartStoreContext.Provider>
    );
};

export const useRadarChartStore = <T,>(
    selector: (store: RadarChartStore) => T
): T => {
    const storeContext = useContext(RadarChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useRadarChartStore must be used within RadarChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
