"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    type ChartConfigStore,
    createChartConfigStore,
    initChartConfigStore,
} from "@/store/ChartConfigStore";

export type ChartConfigStoreApi = ReturnType<typeof createChartConfigStore>;

export const ChartConfigStoreContext = createContext<
    ChartConfigStoreApi | undefined
>(undefined);

export interface ChartConfigStoreProviderProps {
    children: ReactNode;
}

export const ChartConfigStoreProvider = ({
    children,
}: ChartConfigStoreProviderProps) => {
    const storeRef = useRef<ChartConfigStoreApi>();
    if (!storeRef.current) {
        storeRef.current = createChartConfigStore(initChartConfigStore());
    }

    return (
        <ChartConfigStoreContext.Provider value={storeRef.current}>
            {children}
        </ChartConfigStoreContext.Provider>
    );
};

export const useChartConfigStore = <T,>(
    selector: (store: ChartConfigStore) => T
): T => {
    const chartConfigStoreContext = useContext(ChartConfigStoreContext);

    if (!chartConfigStoreContext) {
        throw new Error(
            `useCounterStore must be used within CounterStoreProvider`
        );
    }

    return useStore(chartConfigStoreContext, selector);
};
