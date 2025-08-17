/* eslint-disable */

import { Project, SourceFile, SyntaxKind, VariableDeclaration } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

import pluralize, { singular } from "pluralize";

import { convertZodToTypeScript } from "./zod-to-ts-generator";

interface RouteInfo {
    path: string;
    method: string;
    hasParams: boolean;
    hasQuery: boolean;
    hasJson: boolean;
    paramNames: string[];
    paramsZodType?: string;
    queryZodType?: string;
    jsonZodType?: string;
    queryOptions?: string;
    mutationOptions?: string;
    queryHookName?: string; // New optional field for custom hook names
    includeOnSuccess?: boolean; // New field for onSuccess callback
    includeOnError?: boolean; // New field for onError callback
}

interface ConfigInfo {
    routeName: string;
    moduleName: string;
    routes: RouteInfo[];
}

interface ImportUsage {
    useQuery: boolean;
    useMutation: boolean;
    inferRequestType: boolean;
    inferResponseType: boolean;
    client: boolean;
}

class ReactQueryCodeGenerator {
    private project: Project;

    constructor() {
        this.project = new Project({
            tsConfigFilePath: "./tsconfig.json",
        });
    }

    findConfigFiles(dir: string): string[] {
        const configFiles: string[] = [];

        const traverse = (currentDir: string) => {
            const items = fs.readdirSync(currentDir);

            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    traverse(fullPath);
                } else if (item === "config.ts") {
                    const content = fs.readFileSync(fullPath, "utf-8");
                    if (content.includes('"react-query-codegen"')) {
                        configFiles.push(fullPath);
                    }
                }
            }
        };

        traverse(dir);
        return configFiles;
    }

    parseConfigDirectives(content: string): {
        routeName: string;
        moduleName: string;
    } {
        const lines = content.split("\n");
        let routeName = "";
        const moduleName = "";

        // Look for the directive pattern: "routeName"; "hono-codegen"; "react-query-codegen";
        for (let i = 0; i < Math.min(5, lines.length); i++) {
            const line = lines[i].trim();
            if (line.startsWith('"') && line.endsWith('";')) {
                const directive = line.slice(1, -2); // Remove quotes and semicolon

                if (
                    directive !== "hono-codegen" &&
                    directive !== "react-query-codegen"
                ) {
                    routeName = directive;
                    break;
                }
            }
        }

        return { routeName, moduleName };
    }

    parseRouteConfig(sourceFile: SourceFile): RouteInfo[] {
        const routes: RouteInfo[] = [];

        // Get the default export assignment
        const exportAssignment = sourceFile.getExportAssignment(() => true);
        if (!exportAssignment) {
            return routes;
        }

        let expression = exportAssignment.getExpression();

        if (!expression) {
            return routes;
        }

        // If it's an identifier, resolve it to its variable declaration
        if (expression.getKind() === SyntaxKind.Identifier) {
            const symbol = expression.getSymbol();
            if (symbol) {
                const decl = symbol.getDeclarations()[0];
                if (VariableDeclaration.isVariableDeclaration(decl)) {
                    const init = decl.getInitializer();
                    if (init) {
                        expression = init;
                    }
                }
            }
        }

        // Now check if the resolved expression is an array literal
        if (expression.getKind() === SyntaxKind.ArrayLiteralExpression) {
            const arrayLiteral = expression.asKindOrThrow(
                SyntaxKind.ArrayLiteralExpression
            );
            for (const element of arrayLiteral.getElements()) {
                const route = this.parseRouteElement(element);
                if (route) {
                    routes.push(route);
                }
            }
        }

        return routes;
    }

    private parseRouteElement(element: any): RouteInfo | null {
        if (element.getKind() === SyntaxKind.CallExpression) {
            return this.parseCallExpression(element);
        }

        return null;
    }

    private parseCallExpression(callExpression: any): RouteInfo | null {
        const expression = callExpression.getExpression();
        const args = callExpression.getArguments();

        // Case 1: Direct function call like defineRoute({ ... })
        if (expression.getKind() === SyntaxKind.Identifier) {
            const functionName = expression.getText();

            if (
                args.length > 0 &&
                args[0].getKind() === SyntaxKind.ObjectLiteralExpression
            ) {
                return this.parseRouteObject(args[0]);
            }
        }

        // Case 2: Chained call like defineRouteWithVariables<Variables>()({ ... })
        else if (expression.getKind() === SyntaxKind.CallExpression) {
            const innerCall = expression.asKindOrThrow(
                SyntaxKind.CallExpression
            );
            const innerExpression = innerCall.getExpression();

            // This could be defineRouteWithVariables<Variables> or similar
            if (
                innerExpression.getKind() === SyntaxKind.Identifier ||
                innerExpression.getKind() === SyntaxKind.CallExpression
            ) {
                const fullExpressionText = innerExpression.getText();

                // Look for any route definition function
                if (
                    fullExpressionText.includes("defineRoute") ||
                    fullExpressionText.includes("Route") ||
                    (args.length > 0 &&
                        args[0].getKind() ===
                            SyntaxKind.ObjectLiteralExpression)
                ) {
                    if (
                        args.length > 0 &&
                        args[0].getKind() === SyntaxKind.ObjectLiteralExpression
                    ) {
                        return this.parseRouteObject(args[0]);
                    }
                }
            }
        }

        // Case 3: Generic call expression with object argument (fallback)
        else {
            if (
                args.length > 0 &&
                args[0].getKind() === SyntaxKind.ObjectLiteralExpression
            ) {
                return this.parseRouteObject(args[0]);
            }
        }

        // Case 4: Last resort - if we have any object literal argument, try to parse it
        if (args.length > 0) {
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                if (arg.getKind() === SyntaxKind.ObjectLiteralExpression) {
                    const result = this.parseRouteObject(arg);
                    if (result) return result;
                }
            }
        }

        return null;
    }

    private parseRouteObject(
        objectLiteral: any,
        typeNode?: any
    ): RouteInfo | null {
        const properties = objectLiteral.getProperties();
        let path = "";
        let method = "";
        let hasParams = false;
        let hasQuery = false;
        let hasJson = false;
        let paramNames: string[] = [];
        let paramsZodType: string | undefined;
        let queryZodType: string | undefined;
        let jsonZodType: string | undefined;
        let queryOptions: string | undefined;
        let mutationOptions: string | undefined;
        let queryHookName: string | undefined; // New field for custom hook name
        let includeOnSuccess = false; // New field for onSuccess callback
        let includeOnError = false; // New field for onError callback

        // Extract Zod types from RouteConfig generic type parameters
        if (typeNode && typeNode.getKind() === SyntaxKind.TypeReference) {
            const typeArgs = typeNode.getTypeArguments();
            if (typeArgs && typeArgs.length >= 4) {
                // RouteConfig<Variables, ParamsType, QueryType, JsonType>
                paramsZodType = typeArgs[1]?.getText();
                queryZodType = typeArgs[2]?.getText();
                jsonZodType = typeArgs[3]?.getText();

                // Set flags based on presence of non-empty Zod types
                hasParams = !!(
                    paramsZodType && !this.isEmptyZodType(paramsZodType)
                );
                hasQuery = !!(
                    queryZodType && !this.isEmptyZodType(queryZodType)
                );
                hasJson = !!(jsonZodType && !this.isEmptyZodType(jsonZodType));
            }
        }

        for (const prop of properties) {
            if (prop.getKind() === SyntaxKind.PropertyAssignment) {
                const name = prop.getName();
                const value = prop.getInitializer();

                if (name === "path" && value) {
                    path = value.getText().replace(/['"]/g, "");
                } else if (name === "method" && value) {
                    method = value.getText().replace(/['"]/g, "");
                } else if (name === "queryHookName" && value) {
                    // Parse the custom hook name
                    queryHookName = value.getText().replace(/['"]/g, "");
                } else if (name === "includeOnSuccess" && value) {
                    // Parse includeOnSuccess boolean
                    const valueText = value.getText();
                    includeOnSuccess = valueText === "true";
                } else if (name === "includeOnError" && value) {
                    // Parse includeOnError boolean
                    const valueText = value.getText();
                    includeOnError = valueText === "true";
                } else if (name === "queryOptions" && value) {
                    queryOptions = this.extractObjectLiteralAsString(value);
                } else if (name === "mutationOptions" && value) {
                    mutationOptions = this.extractObjectLiteralAsString(value);
                } else if (
                    name === "validators" &&
                    value &&
                    value.getKind() === SyntaxKind.ObjectLiteralExpression
                ) {
                    const validatorObj = value.asKindOrThrow(
                        SyntaxKind.ObjectLiteralExpression
                    );
                    const validatorProps = validatorObj.getProperties();

                    for (const validatorProp of validatorProps) {
                        if (
                            validatorProp.getKind() ===
                            SyntaxKind.PropertyAssignment
                        ) {
                            const validatorName = validatorProp.getName();
                            const validatorValue =
                                validatorProp.getInitializer();

                            if (validatorName === "params") {
                                hasParams = true;
                                if (!paramsZodType && validatorValue) {
                                    paramsZodType = validatorValue.getText();
                                }
                                paramNames =
                                    this.extractParamNamesFromValidator(
                                        validatorValue
                                    );
                            } else if (validatorName === "query") {
                                hasQuery = true;
                                if (!queryZodType && validatorValue) {
                                    queryZodType = validatorValue.getText();
                                }
                            } else if (validatorName === "json") {
                                hasJson = true;
                                if (!jsonZodType && validatorValue) {
                                    jsonZodType = validatorValue.getText();
                                }
                            }
                        }
                    }
                }
            }
        }

        // Also check for parameters in path even if no validators defined
        if (path && !hasParams) {
            const matches = path.match(/:(\w+)/g);
            if (matches) {
                hasParams = true;
                paramNames = matches.map((match) => match.substring(1));
            }
        }

        // Fallback: if we have params but no param names, extract from path
        if (hasParams && paramNames.length === 0) {
            const matches = path.match(/:(\w+)/g);
            if (matches) {
                paramNames = matches.map((match) => match.substring(1));
            }
        }

        if (path && method) {
            return {
                path,
                method,
                hasParams,
                hasQuery,
                hasJson,
                paramNames,
                paramsZodType,
                queryZodType,
                jsonZodType,
                queryOptions,
                mutationOptions,
                queryHookName, // Include the custom hook name
                includeOnSuccess, // Include the onSuccess flag
                includeOnError, // Include the onError flag
            };
        }

        return null;
    }

    private extractObjectLiteralAsString(value: any): string {
        if (value.getKind() === SyntaxKind.ObjectLiteralExpression) {
            // Get the full text of the object literal, preserving formatting
            const objectText = value.getText();
            // Clean up the object literal text to be properly formatted
            return objectText;
        }
        return "";
    }

    private isEmptyZodType(zodType: string): boolean {
        return (
            zodType.includes("z.ZodObject<{}>") ||
            zodType.includes("z.ZodObject<Record<string, never>>") ||
            zodType.trim() === "{}"
        );
    }

    private extractParamNamesFromValidator(validator: any): string[] {
        const paramNames: string[] = [];

        if (!validator) return paramNames;

        const validatorText = validator.getText();

        // Look for patterns like z.object({ id: z.string(), sample: z.string() })
        const objectMatch = validatorText.match(
            /z\.object\(\s*\{([^}]+)\}\s*\)/
        );
        if (objectMatch) {
            const objectContent = objectMatch[1];
            // Extract property names (simple regex - might need enhancement for complex cases)
            const propertyMatches = objectContent.match(/(\w+):\s*z\./g);
            if (propertyMatches) {
                paramNames.push(
                    ...propertyMatches.map((match: string) =>
                        match.replace(/:\s*z\./, "").trim()
                    )
                );
            }
        }

        return paramNames;
    }

    // Helper method to convert Zod schema to TypeScript type
    private convertZodSchemaToType(zodSchema: string): string {
        try {
            return convertZodToTypeScript(zodSchema);
        } catch (error) {
            console.warn(
                `Failed to convert Zod schema to TypeScript: ${zodSchema}`,
                error
            );
            // Fallback to z.infer approach if conversion fails
            return `z.infer<${zodSchema}>`;
        }
    }

    // Helper method to convert routeName to client path format
    private convertRouteNameToClientPath(routeName: string): string {
        // Split by slash and convert each segment to property access
        const segments = routeName.split("/").filter((s) => s);
        return segments.map((segment) => `["${segment}"]`).join("");
    }

    // IMPROVED: Better semantic hook name generation with custom name support
    private generateSemanticHookName(
        route: RouteInfo,
        routeName: string
    ): string {
        // If custom hook name is provided, use it directly
        if (route.queryHookName && route.queryHookName.trim()) {
            return route.queryHookName.trim();
        }

        // Otherwise, generate the name using existing logic
        const method = route.method.toLowerCase();
        const routeSegments = routeName.split("/").filter((s) => s);
        const resourceName = routeSegments[routeSegments.length - 1] || "";

        // Convert to singular form for better naming
        const resourceSingular = singular(resourceName);
        const resourceCapitalized = this.capitalize(resourceSingular);

        // Handle different path patterns
        const pathSegments = route.path.split("/").filter((s) => s);

        // Root collection endpoints
        if (route.path === "/" || route.path === "/all") {
            if (method === "get")
                return `useGet${pluralize(resourceCapitalized)}`;
            if (method === "post") return `useCreate${resourceCapitalized}`;
        }

        // Create endpoints
        if (
            route.path === "/create" ||
            (route.path === "/" && method === "post")
        ) {
            return `useCreate${resourceCapitalized}`;
        }

        // Single resource by ID
        if (route.path === "/:id") {
            if (method === "get") return `useGet${resourceCapitalized}`;
            if (method === "put" || method === "patch")
                return `useUpdate${resourceCapitalized}`;
            if (method === "delete") return `useDelete${resourceCapitalized}`;
        }

        // Nested resources (e.g., /:id/comments, /:id/box-model)
        if (pathSegments.length >= 2) {
            const lastSegment = pathSegments[pathSegments.length - 1];
            const nestedResource = this.kebabToPascalCase(lastSegment);

            if (method === "get")
                return `useGet${resourceCapitalized}${nestedResource}`;
            if (method === "post")
                return `useCreate${resourceCapitalized}${nestedResource}`;
            if (method === "put" || method === "patch")
                return `useUpdate${resourceCapitalized}${nestedResource}`;
            if (method === "delete")
                return `useDelete${resourceCapitalized}${nestedResource}`;
        }

        // Custom endpoints (e.g., /search, /export, /analytics)
        if (pathSegments.length === 1 && !pathSegments[0].startsWith(":")) {
            const action = this.capitalize(pathSegments[0]);
            if (method === "get")
                return `use${action}${pluralize(resourceCapitalized)}`;
            if (method === "post") return `use${action}${resourceCapitalized}`;
        }

        // Fallback: use method + resource + path description
        const pathDescription = pathSegments
            .filter((s) => !s.startsWith(":"))
            .map((s) => this.kebabToPascalCase(s))
            .join("");

        return `use${this.capitalize(method)}${resourceCapitalized}${pathDescription}`;
    }

    // Helper method to convert kebab-case to PascalCase
    private kebabToPascalCase(str: string): string {
        return str
            .split("-")
            .map((word) => this.capitalize(word))
            .join("");
    }

    // Clean type name generation - now also considers custom hook names
    private generateTypeName(
        route: RouteInfo,
        routeName: string,
        suffix: string
    ): string {
        const hookName = this.generateSemanticHookName(route, routeName);
        const baseName = hookName.replace(/^use/, "");
        return `${baseName}${suffix}`;
    }

    // NEW: Analyze import usage across all routes
    private analyzeImportUsage(routes: RouteInfo[]): ImportUsage {
        const usage: ImportUsage = {
            useQuery: false,
            useMutation: false,
            inferRequestType: false,
            inferResponseType: false,
            client: true, // Always needed for API calls
        };

        for (const route of routes) {
            if (route.method === "GET") {
                usage.useQuery = true;
            } else {
                usage.useMutation = true;
                usage.inferRequestType = true;
                usage.inferResponseType = true;
            }

            // If we already found all imports are needed, no need to continue
            if (
                usage.useQuery &&
                usage.useMutation &&
                usage.inferRequestType &&
                usage.inferResponseType
            ) {
                break;
            }
        }

        return usage;
    }

    // NEW: Generate optimized imports based on usage
    private generateOptimizedImports(usage: ImportUsage): string {
        const imports: string[] = [];

        // React Query imports
        const reactQueryImports: string[] = [];
        if (usage.useQuery) reactQueryImports.push("useQuery");
        if (usage.useMutation) reactQueryImports.push("useMutation");

        if (reactQueryImports.length > 0) {
            imports.push(
                `import { ${reactQueryImports.join(", ")} } from "@tanstack/react-query";`
            );
        }

        // Hono type imports
        const honoImports: string[] = [];
        if (usage.inferRequestType) honoImports.push("InferRequestType");
        if (usage.inferResponseType) honoImports.push("InferResponseType");

        if (honoImports.length > 0) {
            imports.push(`import { ${honoImports.join(", ")} } from "hono";`);
        }

        // Client import (always needed)
        if (usage.client) {
            imports.push(`import { client } from "@/lib/rpc";`);
        }

        return imports.join("\n") + (imports.length > 0 ? "\n\n" : "");
    }

    generateReactQueryHooks(config: ConfigInfo): string {
        const { routeName, routes } = config;

        // Analyze which imports are actually needed
        const importUsage = this.analyzeImportUsage(routes);
        const imports = this.generateOptimizedImports(importUsage);

        let hooks = "";

        for (const route of routes) {
            if (route.method === "GET") {
                hooks += this.generateQueryHook(route, routeName);
            } else {
                hooks += this.generateMutationHook(route, routeName);
            }
        }

        return imports + hooks;
    }

    // IMPROVED: Query hook with better parameter wrapping
    private generateQueryHook(route: RouteInfo, routeName: string): string {
        const hookName = this.generateSemanticHookName(route, routeName);
        const clientPath = this.generateClientPath(route);
        const queryKey = this.generateQueryKey(route, routeName);
        const routeNamePath = this.convertRouteNameToClientPath(routeName);

        let functionParams = "()";
        let clientParams = "";
        let queryKeyParams = "";
        let typeDefinitions = "";

        const paramTypes: string[] = [];
        const paramNames: string[] = [];
        const paramProps: string[] = [];

        if (
            route.hasParams &&
            route.paramsZodType &&
            !this.isEmptyZodType(route.paramsZodType)
        ) {
            const paramsTypeName = this.generateTypeName(
                route,
                routeName,
                "Params"
            );
            const typeDefinition = this.convertZodSchemaToType(
                route.paramsZodType
            );
            typeDefinitions += `type ${paramsTypeName} = ${typeDefinition};

`;
            paramTypes.push(`params: ${paramsTypeName}`);
            paramNames.push("params");
            paramProps.push("params");
        }

        if (
            route.hasQuery &&
            route.queryZodType &&
            !this.isEmptyZodType(route.queryZodType)
        ) {
            const queryTypeName = this.generateTypeName(
                route,
                routeName,
                "Query"
            );
            const typeDefinition = this.convertZodSchemaToType(
                route.queryZodType
            );
            typeDefinitions += `type ${queryTypeName} = ${typeDefinition};

`;
            paramTypes.push(`query: ${queryTypeName}`);
            paramNames.push("query");
            paramProps.push("query");
        }

        // FIXED: Proper parameter wrapping
        if (paramTypes.length > 0) {
            functionParams = `({${paramProps.join(", ")}}: {${paramTypes.join("; ")}})`;
        }

        // Generate client parameters
        if (paramNames.length > 0) {
            const clientParamParts: string[] = [];
            if (paramNames.includes("params")) {
                clientParamParts.push("param: params");
            }
            if (paramNames.includes("query")) {
                clientParamParts.push("query: query");
            }
            clientParams = `{
                ${clientParamParts.join(",\n                ")},
            }`;
            queryKeyParams = `, JSON.stringify({ ${paramNames.join(", ")} })`;
        }

        const methodCall = `$${route.method.toLowerCase()}`;

        let queryOptionsSpread = "";
        if (route.queryOptions) {
            queryOptionsSpread = `
        ...${route.queryOptions},`;
        }

        return `${typeDefinitions}export const ${hookName} = ${functionParams} => {
    return useQuery({
        queryKey: [${queryKey}${queryKeyParams}],
        queryFn: async () => {
            const response = await client.api.v1${routeNamePath}${clientPath}.${methodCall}(${clientParams ? `${clientParams}` : ""});

            if (!response.ok) {
                throw new Error("Failed to fetch ${routeName}");
            }

            return await response.json();
        },${queryOptionsSpread}
        ${route.hasParams || route.queryOptions ? "" : "staleTime: 0,"}
    });
};

`;
    }

    private generateMutationHook(route: RouteInfo, routeName: string): string {
        const hookName = this.generateSemanticHookName(route, routeName);
        const clientPath = this.generateClientPath(route);
        const methodCall = `$${route.method.toLowerCase()}`;
        const routeNamePath = this.convertRouteNameToClientPath(routeName);

        const requestTypeName = this.generateTypeName(
            route,
            routeName,
            "Request"
        );
        const responseTypeName = this.generateTypeName(
            route,
            routeName,
            "Response"
        );

        let mutationOptionsSpread = "";
        if (route.mutationOptions) {
            mutationOptionsSpread = `
        ...${route.mutationOptions},`;
        }

        // Check if we need to include onSuccess and onError callbacks
        const includeCallbacks = route.includeOnSuccess || route.includeOnError;

        if (includeCallbacks) {
            // Generate hook with callback parameters
            let callbackTypes: string[] = [];
            let callbackParams: string[] = [];
            let callbackImplementations: string[] = [];

            if (route.includeOnSuccess) {
                callbackTypes.push(`onSuccess?: (
    data: ${responseTypeName},
    variables: ${requestTypeName},
    context: unknown
) => void`);
                callbackParams.push("onSuccess");
                callbackImplementations.push(`onSuccess: (data, variables, context) => {
            onSuccess?.(data, variables, context);
        }`);
            }

            if (route.includeOnError) {
                callbackTypes.push(`onError?: (
    error: Error,
    variables: ${requestTypeName},
    context: unknown
) => void`);
                callbackParams.push("onError");
                callbackImplementations.push(`onError: (error, variables, context) => {
            onError?.(error, variables, context);
        }`);
            }

            const functionParams =
                callbackTypes.length > 0
                    ? `{
${callbackParams.join(",\n")},
}: {
${callbackTypes.join(";\n")};
}`
                    : "()";

            const callbackImplStr =
                callbackImplementations.length > 0
                    ? `
        ${callbackImplementations.join(",\n        ")},`
                    : "";

            return `type ${requestTypeName} = InferRequestType<
    (typeof client.api.v1)${routeNamePath}${clientPath}["${methodCall}"]
>;
type ${responseTypeName} = InferResponseType<
    (typeof client.api.v1)${routeNamePath}${clientPath}["${methodCall}"],
    200
>;

export const ${hookName} = (${functionParams}) => {
    return useMutation<${responseTypeName}, Error, ${requestTypeName}>({
        mutationFn: async (props) => {
            const response = await client.api.v1${routeNamePath}${clientPath}.${methodCall}(props);

            if (!response.ok) {
                throw new Error("Failed to ${route.method.toLowerCase()} ${routeName}");
            }

            return await response.json();
        },${mutationOptionsSpread}${callbackImplStr}
    });
};

`;
        } else {
            // Generate hook without callback parameters (original behavior)
            return `type ${requestTypeName} = InferRequestType<
    (typeof client.api.v1)${routeNamePath}${clientPath}["${methodCall}"]
>;
type ${responseTypeName} = InferResponseType<
    (typeof client.api.v1)${routeNamePath}${clientPath}["${methodCall}"],
    200
>;

export const ${hookName} = () => {
    return useMutation<${responseTypeName}, Error, ${requestTypeName}>({
        mutationFn: async (props) => {
            const response = await client.api.v1${routeNamePath}${clientPath}.${methodCall}(props);

            if (!response.ok) {
                throw new Error("Failed to ${route.method.toLowerCase()} ${routeName}");
            }

            return await response.json();
        },${mutationOptionsSpread}
    });
};

`;
        }
    }

    private generateClientPath(route: RouteInfo): string {
        let path = route.path;

        if (path === "/all") return '["all"]';
        if (path === "/create") return '["create"]';
        if (path === "/:id") return '[":id"]';
        if (path === "/") return "";

        const segments = path.split("/").filter((s) => s);
        return segments
            .map((segment) => {
                if (segment.startsWith(":")) {
                    return `[":${segment.substring(1)}"]`;
                }
                return `["${segment}"]`;
            })
            .join("");
    }

    private generateQueryKey(route: RouteInfo, routeName: string): string {
        let path = route.path;
        const queryKeyRouteName = routeName.replace("/", ".");

        if (path === "/all" || path === "/") {
            return `"${queryKeyRouteName}", "all"`;
        }

        const cleanPath = path.replace(/\/:\w+/g, "").replace(/^\//, "");

        if (cleanPath) {
            return `"${queryKeyRouteName}", "${cleanPath}"`;
        }

        return `"${queryKeyRouteName}"`;
    }

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async generate(rootDir: string) {
        const configFiles = this.findConfigFiles(rootDir);

        if (configFiles.length === 0) {
            console.log(
                "No config files found with 'react-query-codegen' directive."
            );
            return;
        }

        console.log(`Found ${configFiles.length} config file(s) to process:`);
        configFiles.forEach((file) => {
            console.log(`  - ${file}`);
        });

        for (const configFile of configFiles) {
            try {
                console.log(`Processing: ${configFile}`);

                const content = fs.readFileSync(configFile, "utf-8");
                const { routeName } = this.parseConfigDirectives(content);

                const sourceFile = this.project.addSourceFileAtPath(configFile);
                const routes = this.parseRouteConfig(sourceFile);

                if (routes.length === 0) {
                    console.log(`  ⚠ No routes found in ${configFile}`);
                    continue;
                }

                const pathParts = configFile.split(path.sep);
                const modulesIndex = pathParts.findIndex(
                    (part) => part === "modules"
                );
                const fallbackModuleName = pathParts[modulesIndex + 1];

                const config: ConfigInfo = {
                    routeName: routeName || fallbackModuleName,
                    moduleName: fallbackModuleName,
                    routes,
                };

                const hooksCode = this.generateReactQueryHooks(config);

                // Create the ../api/client directory structure
                const configDir = path.dirname(configFile);
                const apiDir = path.resolve(configDir, "..", "api");
                const clientDir = path.join(apiDir, "client");

                // Ensure the directory exists
                if (!fs.existsSync(clientDir)) {
                    fs.mkdirSync(clientDir, { recursive: true });
                }

                // Write to auto-gen.tsx instead of index.ts
                const autoGenFile = path.join(clientDir, "auto-gen.tsx");
                fs.writeFileSync(autoGenFile, hooksCode);

                console.log(`✓ Generated: ${autoGenFile}`);
                console.log(`✓ Updated: ${path.join(clientDir, "index.tsx")}`);
            } catch (error) {
                console.error(`✗ Error processing ${configFile}:`, error);
            }
        }
    }
}

// CLI usage
async function main() {
    const args = process.argv.slice(2);
    const rootDir = args[0] || process.cwd();

    const generator = new ReactQueryCodeGenerator();
    await generator.generate(rootDir);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { ReactQueryCodeGenerator };
