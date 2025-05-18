"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    BarChartStore,
    createBarChartStore,
    initBarChartStore,
} from "@/modules/Bar/store/state";
import { StateProviderType } from "@/constants";
import { BoxLoader } from "@/components/ui/Loader";
import { useBarCharts } from "@/modules/Bar/api/client/useGetBarChart";

export type BarChartStoreApi = ReturnType<typeof createBarChartStore>;
export const BarChartStoreContext = createContext<BarChartStoreApi | undefined>(
    undefined
);

export const BarChartStoreProvider: StateProviderType = ({
    children,
    char_id,
}) => {
    const storeRef = useRef<BarChartStoreApi>(null);
    const { data, isLoading, error, isError } = useBarCharts(char_id);

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
        storeRef.current = createBarChartStore(initBarChartStore(data.chart));
    }

    return (
        <BarChartStoreContext.Provider value={storeRef.current}>
            {children}
        </BarChartStoreContext.Provider>
    );
};

export const useBarChartStore = <T,>(
    selector: (store: BarChartStore) => T
): T => {
    const storeContext = useContext(BarChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useBarChartStore must be used within BarChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
