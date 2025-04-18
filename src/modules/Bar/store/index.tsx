"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    BarChartStore,
    createBarChartStore,
    initBarChartStore,
} from "@/modules/Bar/store/state";
import { StateProviderType } from "@/constants";

export type BarChartStoreApi = ReturnType<typeof createBarChartStore>;
export const BarChartStoreContext = createContext<BarChartStoreApi | undefined>(
    undefined
);

export const BarChartStoreProvider: StateProviderType = ({ children }) => {
    const storeRef = useRef<BarChartStoreApi>(null);

    if (!storeRef.current) {
        storeRef.current = createBarChartStore(initBarChartStore());
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
