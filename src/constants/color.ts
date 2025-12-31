import z from 'zod';

export const ColorSchema = z.object({
    r: z.number().min(0).max(255),
    g: z.number().min(0).max(255),
    b: z.number().min(0).max(255),
    a: z.number().min(0).max(1),
});
export type RGBAColor = z.infer<typeof ColorSchema>;
