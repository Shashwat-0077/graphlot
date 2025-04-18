"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    RadarChartStore,
    createRadarChartStore,
    initRadarChartStore,
} from "@/modules/Radar/store/state";
import { StateProviderType } from "@/constants";

export type RadarChartStoreApi = ReturnType<typeof createRadarChartStore>;
export const RadarChartStoreContext = createContext<
    RadarChartStoreApi | undefined
>(undefined);

export const RadarChartStoreProvider: StateProviderType = ({ children }) => {
    const storeRef = useRef<RadarChartStoreApi>(null);

    if (!storeRef.current) {
        storeRef.current = createRadarChartStore(initRadarChartStore());
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
