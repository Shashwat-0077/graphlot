import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";

import { Users, Accounts } from "@/modules/auth/schema/db";

const baseUserInsertSchema = createInsertSchema(Users);
const baseUserSelectSchema = createSelectSchema(Users);
const baseUserUpdateSchema = createUpdateSchema(Users);

const baseAccountInsertSchema = createInsertSchema(Accounts);
const baseAccountSelectSchema = createSelectSchema(Accounts);
const baseAccountUpdateSchema = createUpdateSchema(Accounts);

export const UserSchema = {
    Insert: baseUserInsertSchema.omit({
        id: true,
    }),
    Select: baseUserSelectSchema,
    Update: baseUserUpdateSchema.omit({
        id: true,
    }),
};

export const AccountSchema = {
    Insert: baseAccountInsertSchema,
    Select: baseAccountSelectSchema,
    Update: baseAccountUpdateSchema,
};

export const UserWithAccountSchema = {
    Select: UserSchema.Select.extend({
        accounts: z.array(AccountSchema.Select),
    }),
};

// Types for the schemas
export type UserInsert = z.infer<typeof UserSchema.Insert>;
export type UserSelect = z.infer<typeof UserSchema.Select>;
export type UserUpdate = z.infer<typeof UserSchema.Update>;

export type AccountInsert = z.infer<typeof AccountSchema.Insert>;
export type AccountSelect = z.infer<typeof AccountSchema.Select>;
export type AccountUpdate = z.infer<typeof AccountSchema.Update>;

export type UserWithAccountSelect = z.infer<
    typeof UserWithAccountSchema.Select
>;
