import { v4 as uuid } from "uuid";
import {
    integer,
    real,
    sqliteTable,
    text,
    unique,
} from "drizzle-orm/sqlite-core";

import { Users } from "@/db/schema";

export const Collections = sqliteTable(
    "collections",
    {
        collection_id: text("id")
            .primaryKey()
            .$defaultFn(() => uuid()),
        user_id: text("userId")
            .notNull()
            .references(() => Users.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        description: text("description").notNull(),
        chart_count: integer("chartCount", { mode: "number" })
            .notNull()
            .default(0),
        created_at: real("createdAt").notNull().$type<Date>(),
    },
    (table) => [
        unique("collections_user_name_unique").on(table.user_id, table.name),
    ]
);
