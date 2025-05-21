import { v4 as uuid } from "uuid";
import {
    integer,
    real,
    sqliteTable,
    text,
    unique,
} from "drizzle-orm/sqlite-core";

import { Users } from "@/modules/auth/schema/db";

export const Collections = sqliteTable(
    "collections",
    {
        collectionId: text("id")
            .primaryKey()
            .$defaultFn(() => uuid()),
        userId: text("userId")
            .notNull()
            .references(() => Users.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        description: text("description").notNull(),
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
        unique("collections_user_name_unique").on(table.userId, table.name),
    ]
);
