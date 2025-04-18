"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    DonutChartStore,
    createDonutChartStore,
    initDonutChartStore,
} from "@/modules/Donut/store/state";

export type DonutChartStoreApi = ReturnType<typeof createDonutChartStore>;
export const DonutChartStoreContext = createContext<
    DonutChartStoreApi | undefined
>(undefined);

export const DonutChartStoreProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const storeRef = useRef<DonutChartStoreApi>(null);

    if (!storeRef.current) {
        storeRef.current = createDonutChartStore(initDonutChartStore());
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
