"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    AreaChartStore,
    createAreaChartStore,
    initAreaChartStore,
} from "@/modules/Area/store/state";
import { StateProviderType } from "@/constants";
import { useGetAreaChartWithId } from "@/modules/Area/api/client/useGetAreaChart";
import { BoxLoader } from "@/components/ui/Loader";

export type AreaChartStoreApi = ReturnType<typeof createAreaChartStore>;
export const AreaChartStoreContext = createContext<
    AreaChartStoreApi | undefined
>(undefined);

export const AreaChartStoreProvider: StateProviderType = ({
    children,
    char_id,
}) => {
    const storeRef = useRef<AreaChartStoreApi>(null);
    const { data, isLoading, error, isError } = useGetAreaChartWithId(char_id);

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
        storeRef.current = createAreaChartStore(initAreaChartStore(data.chart));
    }

    return (
        <AreaChartStoreContext.Provider value={storeRef.current}>
            {children}
        </AreaChartStoreContext.Provider>
    );
};

export const useAreaChartStore = <T,>(
    selector: (store: AreaChartStore) => T
): T => {
    const storeContext = useContext(AreaChartStoreContext);

    if (!storeContext) {
        throw new Error(
            `useAreaChartStore must be used within AreaChartStoreProvider`
        );
    }

    return useStore(storeContext, selector);
};
