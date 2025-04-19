"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    DonutChartStore,
    createDonutChartStore,
    initDonutChartStore,
} from "@/modules/Donut/store/state";
import { StateProviderType } from "@/constants";
import { BoxLoader } from "@/components/ui/Loader";
import { useGetDonutChartWithId } from "@/modules/Donut/api/client/useGetDonutChart";

export type DonutChartStoreApi = ReturnType<typeof createDonutChartStore>;
export const DonutChartStoreContext = createContext<
    DonutChartStoreApi | undefined
>(undefined);

export const DonutChartStoreProvider: StateProviderType = ({
    children,
    char_id,
}) => {
    const storeRef = useRef<DonutChartStoreApi>(null);
    const { data, isLoading, error, isError } = useGetDonutChartWithId(char_id);

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
        storeRef.current = createDonutChartStore(
            initDonutChartStore(data.chart)
        );
    }

    return (
        <DonutChartStoreContext.Provider value={storeRef.current}>
            {children}
        </DonutChartStoreContext.Provider>
    );
};

export const useDonutChartStore = <T,>(
    selector: (store: DonutChartStore) => T
): T => {
    const storeContext = useContext(DonutChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useDonutChartStore must be used within DonutChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
