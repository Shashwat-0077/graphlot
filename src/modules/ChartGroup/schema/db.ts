import { v4 as uuid } from "uuid";
import {
    integer,
    real,
    sqliteTable,
    text,
    unique,
} from "drizzle-orm/sqlite-core";

import { LayoutType } from "@/constants";
import { ChartMetadata, Collections } from "@/db/schema";

export const ChartGroup = sqliteTable(
    "chart_groups",
    {
        groupId: text("id")
            .primaryKey()
            .notNull()
            .$defaultFn(() => uuid()),
        collectionId: text("collection_id")
            .notNull()
            .references(() => Collections.collectionId, {
                onDelete: "cascade",
            }),
        name: text("name").notNull(),
        layoutType: text("layout_type").notNull().$type<LayoutType>(),
        chartCount: integer("chart_count", { mode: "number" })
            .notNull()
            .default(0),
        createdAt: real("created_at")
            .notNull()
            .$defaultFn(() => Date.now()),
        updatedAt: real("updated_at")
            .notNull()
            .$defaultFn(() => Date.now()),
    },
    (table) => [
        unique("chart_groups_collection_name_unique").on(
            table.collectionId,
            table.name
        ),
    ]
);

export const ChartGroupCharts = sqliteTable(
    "chart_group_charts",
    {
        groupId: text("groupId")
            .notNull()
            .references(() => ChartGroup.groupId, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        chartId: text("chartId")
            .notNull()
            .references(() => ChartMetadata.chartId, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        createdAt: real("created_at")
            .notNull()
            .$defaultFn(() => Date.now()),
        updatedAt: real("updated_at")
            .notNull()
            .$defaultFn(() => Date.now()),
    },
    (table) => [
        unique("chart_group_charts_group_chart_unique").on(
            table.groupId,
            table.chartId
        ),
    ]
);
