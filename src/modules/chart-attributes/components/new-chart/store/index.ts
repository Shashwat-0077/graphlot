import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { ChartType, DatabaseType } from "@/constants";

interface ChartFormState {
    dataSource: DatabaseType | null;
    databaseId: string | null;
    databaseName: string | null;

    chartType: ChartType | null;

    chartName: string;
    chartDesc: string;

    setChartFormData: <
        T extends keyof Omit<ChartFormState, "setChartFormData">,
    >(
        key: T,
        value: ChartFormState[T] | undefined
    ) => void;

    reset: () => void;
}

export const useChartFormStore = create<ChartFormState>()(
    immer((set) => ({
        dataSource: null,
        databaseId: null,
        databaseName: null,

        chartType: null,

        chartName: "",
        chartDesc: "",

        setChartFormData: (key, value) =>
            set((state) => {
                if (value === undefined) {
                    return;
                }
                state[key] = value;
            }),

        reset: () =>
            set((state) => {
                state.dataSource = null;
                state.databaseId = null;
                state.databaseName = null;
                state.chartType = null;
                state.chartName = "";
                state.chartDesc = "";
            }),
    }))
);
