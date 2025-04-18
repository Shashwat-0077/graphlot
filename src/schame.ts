import { z } from "zod";

export const RgbaColorSchema = z
    .string()
    .regex(
        /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01](?:\.\d+)?)\s*\)$/,
        {
            message:
                "Invalid RGBA color format. Expected format: rgba(r, g, b, a)",
        }
    )
    .refine(
        (value) => {
            const matches = value.match(
                /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01](?:\.\d+)?)\s*\)/
            );
            if (!matches) {
                return false;
            }

            const [, r, g, b, a] = matches;
            const redValid = parseInt(r) >= 0 && parseInt(r) <= 255;
            const greenValid = parseInt(g) >= 0 && parseInt(g) <= 255;
            const blueValid = parseInt(b) >= 0 && parseInt(b) <= 255;
            const alphaValid = parseFloat(a) >= 0 && parseFloat(a) <= 1;

            return redValid && greenValid && blueValid && alphaValid;
        },
        {
            message:
                "RGB values must be between 0-255, and alpha must be between 0-1",
        }
    );

// Color array schema for multi-color properties
export const ColorsArraySchema = z.array(RgbaColorSchema).or(
    z.string().transform((val, ctx) => {
        try {
            const parsed = JSON.parse(val);
            if (!Array.isArray(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Color must be a valid JSON array of RGBA colors",
                });
                return z.NEVER;
            }
            return parsed;
            // eslint-disable-next-line
        } catch (e) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Color must be a valid JSON array of RGBA colors",
            });
            return z.NEVER;
        }
    })
);

export const requiredStringSchema = (field: string, maxLength: number = 255) =>
    z
        .string({
            required_error: `${field} is required`,
            invalid_type_error: `${field} must be a string`,
        })
        .min(1, { message: `${field} is required` })
        .max(maxLength, {
            message: `${field} must be at most ${maxLength} characters`,
        });

export const optionalStringSchema = (field: string, maxLength: number = 255) =>
    z
        .string({
            invalid_type_error: `${field} must be a string`,
        })
        .max(maxLength, {
            message: `${field} must be at most ${maxLength} characters`,
        })
        .optional();
