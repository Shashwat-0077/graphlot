export const encodedPathPrefix = "mtm";
export type PathObject = { path: string; name: string };

function base64Encode(str: string): string {
    return btoa(encodeURIComponent(str));
}

function base64Decode(str: string): string {
    return decodeURIComponent(atob(str));
}

function restorePadding(str: string): string {
    const padding = 4 - (str.length % 4);
    return padding === 4 ? str : str + "=".repeat(padding);
}

export function encodeForUrl(obj: PathObject): string {
    try {
        // Convert object to JSON string
        const jsonString = JSON.stringify(obj);

        // Encode to base64
        const base64Encoded = base64Encode(jsonString);

        // Make URL-safe and add MTM prefix
        const urlSafeEncoded = base64Encoded
            .replace(/\+/g, "-") // Replace + with -
            .replace(/\//g, "_") // Replace / with _
            .replace(/=+$/, ""); // Remove trailing =

        // Add MTM prefix to indicate encoded string
        return `${encodedPathPrefix}${urlSafeEncoded}`;
    } catch (error) {
        throw new Error(
            `Error encoding object: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

export function decodeFromUrl(encodedString: string): PathObject | null {
    try {
        if (!encodedString.startsWith(encodedPathPrefix)) {
            return null;
        }

        const base64String = encodedString.slice(encodedPathPrefix.length);

        // Restore base64 padding
        const paddedEncodedString = restorePadding(base64String);

        // Restore original base64 characters
        const base64Encoded = paddedEncodedString
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        // Decode base64
        const jsonString = base64Decode(base64Encoded);

        // Parse JSON
        return JSON.parse(jsonString);
    } catch (error) {
        throw new Error(
            `Error decoding string: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}
