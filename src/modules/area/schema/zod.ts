import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { AreaCharts } from '.';

export const AreaChartSelectSchema = createSelectSchema(AreaCharts);
export const AreaChartInsertSchema = createInsertSchema(AreaCharts);
