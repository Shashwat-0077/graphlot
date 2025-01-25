import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { Collections } from "@/db/schema";

import { CollectionSchema } from "../schema";

export const createCollection = async ({
    userId,
    newCollection,
}: {
    userId: string;
    newCollection: z.infer<typeof CollectionSchema.Insert>;
}): Promise<
    | {
          ok: true;
          newCollection: {
              id: string;
              name: string;
          };
      }
    | {
          ok: false;
          error: string;
      }
> => {
    try {
        const [collection] = await db
            .select()
            .from(Collections)
            .where(
                and(
                    eq(Collections.userId, userId),
                    eq(Collections.name, newCollection.name)
                )
            );

        if (collection) {
            return {
                ok: false,
                error: `Collection with name "${newCollection.name}" already exists`,
            };
        }

        const [{ id, name }] = await db
            .insert(Collections)
            .values({
                userId: userId,
                name: newCollection.name,
                description: newCollection.description,
            })
            .returning({ id: Collections.id, name: Collections.name });

        return { ok: true, newCollection: { id, name } };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.",
        };
    }
};
