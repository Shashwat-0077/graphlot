import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { Accounts, Users } from "@/db/schema";
import { auth } from "@/modules/auth";

export const getNotionAccessToken = async (): Promise<
    | {
          ok: true;
          access_token: string;
      }
    | {
          ok: false;
          error: string;
      }
> => {
    const session = await auth();

    if (!session) {
        return {
            ok: false,
            error: "Session not found",
        };
    }

    const { user } = session;

    if (!user || !user.id) {
        return {
            ok: false,
            error: "User not found",
        };
    }

    const response = await db
        .select()
        .from(Users)
        .where(eq(Users.id, user.id))
        .innerJoin(
            Accounts,
            and(eq(Accounts.provider, "notion"), eq(Accounts.userId, user.id))
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
