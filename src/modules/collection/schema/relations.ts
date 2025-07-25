import { relations } from 'drizzle-orm';

import { Collections, user } from '@/db/schema';

export const collectionRelations = relations(Collections, ({ one, many }) => ({
    user: one(user, {
        fields: [Collections.userId],
        references: [user.id],
    }),

    charts: many(Collections),
}));
