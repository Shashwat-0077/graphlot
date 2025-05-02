import "server-only";
import path from "path";

import { migrate } from "drizzle-orm/libsql/migrator";

import { db } from ".";

(async () => {
    console.log("Running migrations ... "); // eslint-disable-line

    await migrate(db, {
        migrationsFolder: path.join(__dirname, "../../drizzle/migrations"),
    });

    console.log("Database migration complete"); // eslint-disable-line
})();
