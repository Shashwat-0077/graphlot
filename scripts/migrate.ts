import { fileURLToPath } from 'url';
import path from 'path';

import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from '@/db';

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('Running migrations ... ');

    await migrate(db, {
        migrationsFolder: path.join(__dirname, '../drizzle/migrations'),
    });

    console.log('Database migration complete');
})();
