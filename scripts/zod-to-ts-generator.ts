import {
    Project,
    CallExpression,
    PropertyAccessExpression,
    Node,
} from "ts-morph";

interface ZodTypeMapping {
    [key: string]: string;
}

const basicTypeMapping: ZodTypeMapping = {
    string: "string",
    number: "number",
    boolean: "boolean",
    bigint: "bigint",
    date: "Date",
    undefined: "undefined",
    null: "null",
    any: "any",
    unknown: "unknown",
    never: "never",
};

/**
 * Convert a Zod schema expression to TypeScript type
 * @param zodExpression - The Zod schema as a string (e.g., "z.object({ name: z.string() })")
 * @returns TypeScript type string
 */
export function convertZodToTypeScript(zodExpression: string): string {
    const project = new Project();

    // Wrap the expression in a variable declaration to parse it
    const sourceCode = `const schema = ${zodExpression};`;

    const sourceFile = project.createSourceFile("temp.ts", sourceCode, {
        overwrite: true,
    });

    let result = "unknown";

    // Find the variable declaration and parse its initializer
    sourceFile.forEachDescendant((node) => {
        if (Node.isVariableDeclaration(node)) {
            const initializer = node.getInitializer();
            if (initializer && isZodExpression(initializer)) {
                result = parseZodExpression(initializer);
            }
        }
    });

    // Clean up
    project.removeSourceFile(sourceFile);

    return result;
}

/**
 * Check if an expression is a Zod expression (starts with z.)
 */
function isZodExpression(node: Node): boolean {
    if (Node.isCallExpression(node)) {
        return startsWithZ(node);
    }
    if (Node.isPropertyAccessExpression(node)) {
        return startsWithZ(node);
    }
    return false;
}

/**
 * Check if expression chain starts with 'z'
 */
function startsWithZ(node: Node): boolean {
    let current = node;

    while (
        Node.isPropertyAccessExpression(current) ||
        Node.isCallExpression(current)
    ) {
        if (Node.isCallExpression(current)) {
            current = current.getExpression();
        } else if (Node.isPropertyAccessExpression(current)) {
            current = current.getExpression();
        }
    }

    return Node.isIdentifier(current) && current.getText() === "z";
}

/**
 * Parse a Zod expression and convert to TypeScript type
 */
function parseZodExpression(node: Node): string {
    if (Node.isCallExpression(node)) {
        return parseCallExpression(node);
    }
    if (Node.isPropertyAccessExpression(node)) {
        return parsePropertyAccess(node);
    }
    return "unknown";
}

/**
 * Parse a call expression (method call)
 */
function parseCallExpression(node: CallExpression): string {
    const expression = node.getExpression();

    if (Node.isPropertyAccessExpression(expression)) {
        const methodName = expression.getName();
        const baseExpression = expression.getExpression();

        // Handle chained methods
        if (isZodExpression(baseExpression)) {
            const baseType = parseZodExpression(baseExpression);
            return applyZodMethod(baseType, methodName, node.getArguments());
        }

        // Handle base z.method() calls
        if (
            Node.isIdentifier(baseExpression) &&
            baseExpression.getText() === "z"
        ) {
            return convertZodMethod(methodName, node.getArguments());
        }
    }

    return "unknown";
}

/**
 * Parse property access (for methods without parentheses)
 */
function parsePropertyAccess(node: PropertyAccessExpression): string {
    const methodName = node.getName();
    const baseExpression = node.getExpression();

    if (Node.isIdentifier(baseExpression) && baseExpression.getText() === "z") {
        return convertZodMethod(methodName, []);
    }

    return "unknown";
}

/**
 * Convert basic Zod methods to TypeScript types
 */
function convertZodMethod(methodName: string, args: Node[]): string {
    // Basic types
    if (basicTypeMapping[methodName]) {
        return basicTypeMapping[methodName];
    }

    // Complex types with arguments
    switch (methodName) {
        case "literal":
            if (args.length > 0) {
                const literalValue = args[0].getText();
                return literalValue;
            }
            return "unknown";

        case "enum":
            if (args.length > 0) {
                const enumArg = args[0];
                if (Node.isArrayLiteralExpression(enumArg)) {
                    const elements = enumArg
                        .getElements()
                        .map((el) => el.getText())
                        .join(" | ");
                    return elements;
                }
            }
            return "string";

        case "union":
            if (args.length > 0) {
                const unionArg = args[0];
                if (Node.isArrayLiteralExpression(unionArg)) {
                    const types = unionArg
                        .getElements()
                        .map((el) => parseZodExpression(el));
                    return types.join(" | ");
                }
            }
            return "unknown";

        case "object":
            if (args.length > 0) {
                const objectArg = args[0];
                if (Node.isObjectLiteralExpression(objectArg)) {
                    return parseObjectSchema(objectArg);
                }
            }
            return "object";

        case "array":
            if (args.length > 0) {
                const elementType = parseZodExpression(args[0]);
                return `${elementType}[]`;
            }
            return "unknown[]";

        case "optional":
            if (args.length > 0) {
                const innerType = parseZodExpression(args[0]);
                return `${innerType} | undefined`;
            }
            return "unknown";

        case "nullable":
            if (args.length > 0) {
                const innerType = parseZodExpression(args[0]);
                return `${innerType} | null`;
            }
            return "unknown";

        default:
            return "unknown";
    }
}

/**
 * Parse object schema to TypeScript interface
 */
function parseObjectSchema(objectLiteral: Node): string {
    if (!Node.isObjectLiteralExpression(objectLiteral)) {
        return "object";
    }

    const properties: string[] = [];

    objectLiteral.getProperties().forEach((prop) => {
        if (Node.isPropertyAssignment(prop)) {
            const key = prop.getName();
            const value = prop.getInitializer();
            if (value && isZodExpression(value)) {
                const type = parseZodExpression(value);
                properties.push(`  ${key}: ${type}`);
            }
        }
    });

    return `{\n${properties.join(";\n")}${properties.length > 0 ? ";\n" : ""}}`;
}

/**
 * Apply chained Zod methods (like .optional(), .nullable(), etc.)
 */
function applyZodMethod(
    baseType: string,
    methodName: string,
    _args: Node[]
): string {
    switch (methodName) {
        case "optional":
            return `${baseType} | undefined`;

        case "nullable":
            return `${baseType} | null`;

        case "nullish":
            return `${baseType} | null | undefined`;

        case "default":
            // Default removes undefined from the type
            return baseType.replace(" | undefined", "");

        case "nonempty":
            // For strings, nonempty doesn't change the TypeScript type
            // For arrays, it could be handled differently, but for simplicity we keep the same type
            return baseType;

        case "refine":
        case "transform":
        case "superRefine":
        case "describe":
            // These don't change the basic type structure
            return baseType;

        default:
            // For unknown methods, just return the base type
            return baseType;
    }
}

// Example usage:
// const result = convertZodToTypeScript('z.object({ collection_id: z.string().nonempty() })');
// console.log(result); // Output: { collection_id: string; }
