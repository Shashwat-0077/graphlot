"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    type BreadCrumbStore,
    createBreadCrumbsStore,
    initBreadCrumbsStore,
} from "@/store/BreadCrumbsStore";

export type BreadCrumbsStoreApi = ReturnType<typeof createBreadCrumbsStore>;

export const BreadCrumbsStoreContext = createContext<
    BreadCrumbsStoreApi | undefined
>(undefined);

export interface BreadCrumbsStoreProviderProps {
    children: ReactNode;
}

export const BreadCrumbsStoreProvider = ({
    children,
}: BreadCrumbsStoreProviderProps) => {
    const storeRef = useRef<BreadCrumbsStoreApi>();
    if (!storeRef.current) {
        storeRef.current = createBreadCrumbsStore(initBreadCrumbsStore());
    }

    return (
        <BreadCrumbsStoreContext.Provider value={storeRef.current}>
            {children}
        </BreadCrumbsStoreContext.Provider>
    );
};

export const useBreadCrumbsStore = <T,>(
    selector: (store: BreadCrumbStore) => T
): T => {
    const breadCrumbsStoreContext = useContext(BreadCrumbsStoreContext);

    if (!breadCrumbsStoreContext) {
        throw new Error(
            `useBreadCrumbsStore must be used within BreadCrumbsStoreProvider`
        );
    }

    return useStore(breadCrumbsStoreContext, selector);
};
