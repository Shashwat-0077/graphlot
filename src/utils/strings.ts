export function capitalize<T extends string>(str: T): Capitalize<T> {
    return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

export function extractPathParams(path: string): string[] {
    const matches = path.match(/:(\w+)/g);
    return matches ? matches.map((match) => match.slice(1)) : [];
}

export function convertHonoPathToReactQuery(path: string): string {
    return path.replace(/:(\w+)/g, "${$1}");
}
