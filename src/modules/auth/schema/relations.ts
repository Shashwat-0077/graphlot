import { relations } from 'drizzle-orm';

import { Collections } from '@/db/schema';

import { account, session, user } from '.';

// user → session (one-to-many)
export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    collections: many(Collections),
}));

// session → user (many-to-one)
export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

// account → user (many-to-one)
export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

// verification → no relations
// (no foreign keys present in the schema)
