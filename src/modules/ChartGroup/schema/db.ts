import { v4 as uuid } from "uuid";
import {
    integer,
    real,
    sqliteTable,
    text,
    unique,
} from "drizzle-orm/sqlite-core";

import { Charts, Collections } from "@/db/schema";
import { LayoutType } from "@/constants";

export const ChartGroup = sqliteTable(
    "chart_groups",
    {
        group_id: text("id")
            .primaryKey()
            .notNull()
            .$defaultFn(() => uuid()),
        collection_id: text("collectionId")
            .notNull()
            .references(() => Collections.collection_id, {
                onDelete: "cascade",
            }),
        name: text("name").notNull(),
        layout_type: text("layoutType").notNull().$type<LayoutType>(),
        chart_count: integer("chartCount", { mode: "number" })
            .notNull()
            .default(0),
        created_at: real("created_at").notNull().$type<Date>(),
        updated_at: real("updated_at").notNull().$type<Date>(),
    },
    (table) => [
        unique("chart_groups_collection_name_unique").on(
            table.collection_id,
            table.name
        ),
    ]
);

export const ChartGroupCharts = sqliteTable(
    "chart_group_charts",
    {
        group_id: text("groupId")
            .notNull()
            .references(() => ChartGroup.group_id, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        chart_id: text("chartId")
            .notNull()
            .references(() => Charts.chartId, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        created_at: text("created_at").notNull().$type<Date>(),
        updated_at: text("updated_at").notNull().$type<Date>(),
    },
    (table) => [
        unique("chart_group_charts_group_chart_unique").on(
            table.group_id,
            table.chart_id
        ),
    ]
);
