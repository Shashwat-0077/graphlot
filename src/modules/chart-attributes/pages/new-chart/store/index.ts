import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
    ChartType,
    COLUMN_SELECT_TYPES,
    ColumnMapSelectOptions,
    DatabaseType,
} from "@/constants";

type HeaderMappingType = {
    displayName: string;
    skipColumn: boolean;
    removeNullEntries: boolean;
} & (
    | {
          type: (typeof COLUMN_SELECT_TYPES)["NONE"];
      }
    | {
          type: (typeof COLUMN_SELECT_TYPES)["NUMBER"];
          precision: number;
          parseCurrency: boolean;
          defaultValue: number;
      }
    | {
          type: (typeof COLUMN_SELECT_TYPES)["DATE"];
          dateFormat: string;
          defaultValue: string;
      }
    | {
          type: (typeof COLUMN_SELECT_TYPES)["SELECT"];
          normalizeValue: boolean;
          defaultValue: string;
      }
    | {
          type: (typeof COLUMN_SELECT_TYPES)["MULTISELECT"];
          delimiter: string;
          defaultValue: string[];
      }
);

interface ChartFormState {
    dataSource: DatabaseType | null;
    notionDatabaseId: string | null;
    databaseName: string | null;

    chartType: ChartType | null;

    chartName: string;
    chartDesc: string;

    fileData: {
        fileName: string;
        fileSize: number;
        headers: Record<string, HeaderMappingType>;
        // eslint-disable-next-line
        data: any[];
        rowCount: number;
    };

    addHeaderMapping: (key: string, value: HeaderMappingType) => void;
    getHeaderMapping: (key: string) => HeaderMappingType | undefined;
    removeHeaderMapping: (key: string) => void;
    clearHeaders: () => void;
    getSampleData: (key: string) => string[];
    updateHeaderType: (key: string, type: ColumnMapSelectOptions) => void;
    toggleSkipColumn: (key: string) => void;

    setChartFormData: <
        T extends keyof Omit<ChartFormState, "setChartFormData">,
    >(
        key: T,
        value: ChartFormState[T] | undefined
    ) => void;
    resetFileData: () => void;
    reset: () => void;
}

export const useChartFormStore = create<ChartFormState>()(
    immer((set, get) => ({
        dataSource: null,
        notionDatabaseId: null,
        databaseName: null,

        fileData: {
            fileName: "",
            fileSize: 0,
            headers: {},
            data: [],
            rowCount: 0,
        },

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

        removeHeaderMapping: (key) =>
            set((state) => {
                delete state.fileData.headers[key];
            }),

        clearHeaders: () =>
            set((state) => {
                state.fileData.headers = {};
            }),

        addHeaderMapping: (key, value) =>
            set((state) => {
                state.fileData.headers[key] = value;
            }),

        getHeaderMapping: (key) => {
            const state = get();
            return state.fileData.headers[key];
        },

        updateHeaderType: (key, type) => {
            set((state) => {
                const header = state.fileData.headers[key];
                if (header) {
                    header.type = type;
                }
            });
        },

        toggleSkipColumn: (key) => {
            set((state) => {
                const header = state.fileData.headers[key];
                if (header) {
                    header.skipColumn = !header.skipColumn;
                }
            });
        },

        getSampleData: (key) => {
            const state = get();
            const header = state.fileData.headers[key];
            if (!header) {
                return [];
            }
            const sampleData = state.fileData.data.slice(0, 3);
            return sampleData
                .filter((row) => row[key] !== undefined)
                .map((row) => row[key] || "");
        },

        resetFileData: () =>
            set((state) => {
                state.fileData = {
                    fileName: "",
                    fileSize: 0,
                    headers: {},
                    data: [],
                    rowCount: 0,
                };
            }),

        reset: () =>
            set((state) => {
                state.dataSource = null;
                state.notionDatabaseId = null;
                state.databaseName = null;
                state.chartType = null;
                state.chartName = "";
                state.chartDesc = "";
            }),
    }))
);
