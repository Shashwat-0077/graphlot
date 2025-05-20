import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { Accounts, Users } from "@/db/schema";

export const getNotionAccessToken = async (
    user_id: string
): Promise<
    | {
          ok: true;
          access_token: string;
      }
    | {
          ok: false;
          error: string;
      }
> => {
    const response = await db
        .select()
        .from(Users)
        .where(eq(Users.id, user_id))
        .innerJoin(
            Accounts,
            and(eq(Accounts.provider, "notion"), eq(Accounts.userId, user_id))
        )
        .then(([res]) => res);

    if (!response || !response.user) {
        return {
            ok: false,
            error: "User or account not found",
        };
    }

    if (!response.account) {
        return {
            ok: false,
            error: "Notion Account not found",
        };
    }

    const { access_token } = response.account;

    if (!access_token) {
        return {
            ok: false,
            error: "Access token not found",
        };
    }

    return {
        ok: true,
        access_token,
    };
};
