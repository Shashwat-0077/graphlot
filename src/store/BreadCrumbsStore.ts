import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

export type BreadCrumbType = {
    path: string;
    name: string;
    isLast: boolean;
};

export type BreadCrumbsState = {
    breadCrumbs: BreadCrumbType[];
};

export type BreadCrumbsActions = {
    setBreadCrumbs: (breadCrumbs: BreadCrumbType[]) => void;
};

export type BreadCrumbStore = BreadCrumbsState & BreadCrumbsActions;

export const defaultInitState: BreadCrumbsState = {
    breadCrumbs: [],
};

export const initBreadCrumbsStore = (): BreadCrumbsState => {
    return defaultInitState;
};

export const createBreadCrumbsStore = (
    initState: BreadCrumbsState = defaultInitState
) => {
    return createStore<BreadCrumbStore>()(
        immer((set) => ({
            ...initState,
            setBreadCrumbs: (breadCrumbs) =>
                set((state) => {
                    state.breadCrumbs = breadCrumbs;
                }),
        }))
    );
};
