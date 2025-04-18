"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    AreaChartStore,
    createAreaChartStore,
    initAreaChartStore,
} from "@/modules/Area/store/state";
import { StateProviderType } from "@/constants";

export type AreaChartStoreApi = ReturnType<typeof createAreaChartStore>;
export const AreaChartStoreContext = createContext<
    AreaChartStoreApi | undefined
>(undefined);

export const AreaChartStoreProvider: StateProviderType = ({ children }) => {
    const storeRef = useRef<AreaChartStoreApi>(null);

    if (!storeRef.current) {
        storeRef.current = createAreaChartStore(initAreaChartStore());
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
