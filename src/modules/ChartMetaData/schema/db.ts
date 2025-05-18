import { v4 as uuid } from "uuid";
import { real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

import { Collections } from "@/modules/Collection/schema/db";
import { ChartType } from "@/constants";

export const Charts = sqliteTable(
    "charts",
    {
        chart_id: text("chart_id")
            .primaryKey()
            .$defaultFn(() => uuid()),
        collection_id: text("collection_id")
            .notNull()
            .references(() => Collections.collection_id, {
                onDelete: "cascade",
            }),
        name: text("name").notNull(),
        description: text("description").notNull(),
        notion_database_id: text("notion_database_id").notNull(),
        notion_database_name: text("notion_database_name").notNull(),
        type: text("type").notNull().$type<ChartType>(),
        created_at: real("created_at").notNull().$type<Date>(),
        updated_at: real("updated_at").notNull().$type<Date>(),
    },
    (table) => [
        unique("charts_collection_name_unique").on(
            table.collection_id,
            table.name
        ),
    ]
);
