import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { SelectCollection } from "@/db/types";

export async function getAllCollections(): Promise<
    | {
          ok: true;
          collections: Zod.infer<typeof SelectCollection>[];
      }
    | {
          ok: false;
          error: string;
      }
> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { ok: false, error: "User not found" };
    }

    const collections = await db
        .select()
        .from(Collections)
        .where(eq(Collections.userId, user?.id))
        .all();

    return { ok: true, collections };
}
