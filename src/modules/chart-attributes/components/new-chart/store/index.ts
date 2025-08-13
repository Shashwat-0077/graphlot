import { create } from "zustand";

import {
    type ChartType,
    DATABASE_NOTION,
    DATABASE_UPLOAD,
    type DatabaseType,
} from "@/constants";

type NotionConfig = {
    chartName: string;
    chartDescription: string;
    databaseId: string;
    databaseTitle: string;
};

interface ChartFormState {
    // Step 1: Chart Type
    chartType: ChartType | null;

    // Step 2: Data Source
    databaseSource: DatabaseType | null;

    // Step 3: Configuration (varies by data source)
    notionConfig: {
        chartName: string;
        chartDescription: string;
        databaseId: string;
        databaseTitle: string;
    } | null;

    // Form state
    currentStep: number;

    // Actions
    setChartType: (type: ChartType) => void;
    setDatabaseSource: (source: DatabaseType) => void;
    setNotionConfig: (config: NotionConfig) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetForm: () => void;
    getFormData: () =>
        | ({
              type: ChartType | null;
          } & (
              | {
                    databaseSource: typeof DATABASE_NOTION;
                    notionConfig: NotionConfig;
                }
              | {
                    databaseSource: typeof DATABASE_UPLOAD;
                    uploadConfig: null;
                }
          ))
        | undefined;
}

export const useChartFormStore = create<ChartFormState>((set, get) => ({
    // Initial state
    chartType: null,
    databaseSource: null,
    notionConfig: null,
    currentStep: 0,

    // Actions
    setChartType: (type) => set({ chartType: type }),
    setDatabaseSource: (source) => set({ databaseSource: source }),
    setNotionConfig: (config) => set({ notionConfig: config }),

    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () =>
        set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

    resetForm: () =>
        set({
            chartType: null,
            databaseSource: null,
            notionConfig: null,
            currentStep: 0,
        }),

    getFormData: () => {
        const state = get();

        if (state.databaseSource === DATABASE_NOTION && state.notionConfig) {
            return {
                type: state.chartType,
                databaseSource: DATABASE_NOTION,
                notionConfig: {
                    chartName: state.notionConfig.chartName,
                    chartDescription: state.notionConfig.chartDescription,
                    databaseId: state.notionConfig.databaseId,
                    databaseTitle: state.notionConfig.databaseTitle,
                },
            };
        }

        if (state.databaseSource === DATABASE_UPLOAD) {
            return {
                type: state.chartType,
                databaseSource: DATABASE_UPLOAD,
                uploadConfig: null,
            };
        }
    },
}));
