import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Collection = sqliteTable("collection", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 100 }).notNull(),
    description: text("description", { length: 500 }).notNull(),
    created_at: text("created_at", { length: 255 })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export type InsertCollection = typeof Collection.$inferInsert;
export type SelectCollection = typeof Collection.$inferSelect;
