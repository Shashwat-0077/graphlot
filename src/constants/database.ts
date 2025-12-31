export const DATABASE_NOTION = "notion";
export const DATABASE_UPLOAD = "upload";
export type DatabaseType = typeof DATABASE_NOTION | typeof DATABASE_UPLOAD;
export const DATABASE_OPTIONS = [DATABASE_NOTION, DATABASE_UPLOAD] as const;
