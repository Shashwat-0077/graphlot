import path from "path";

import { sqliteGenerate } from "drizzle-dbml-generator";

import * as schema from "@/db/schema";

const out = path.join(__dirname, "../../drizzle/migrations/schema.dbml");
const relational = false;

sqliteGenerate({ schema, out, relational });
