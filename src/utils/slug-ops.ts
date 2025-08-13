import slugify from "slugify";

export function getSlug(object: { id: string; name: string }) {
    const slug = slugify(object.name, { lower: true, strict: true });
    return `${object.id}-${slug}`;
}

export function parseSlug(slug: string) {
    // UUIDs are always 36 characters long
    const id = slug.slice(0, 36);
    const name = slug.slice(37); // Skip the hyphen
    return { id, name };
}
