/* eslint-disable */

import { Project, SourceFile, SyntaxKind, VariableDeclaration } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

import { singular } from "pluralize";

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
}

interface ConfigInfo {
    routeName: string;
    moduleName: string;
    routes: RouteInfo[];
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

    // NEW: Helper method to convert routeName to client path format
    private convertRouteNameToClientPath(routeName: string): string {
        // Split by slash and convert each segment to property access
        const segments = routeName.split("/").filter((s) => s);
        return segments.map((segment) => `["${segment}"]`).join("");
    }

    // NEW: Generate a unique identifier for each route
    private generateRouteId(route: RouteInfo, routeName: string): string {
        const method = route.method.toLowerCase();
        const pathParts = route.path
            .split("/")
            .filter((s) => s)
            .map((part) => {
                // Convert :id to Id, :userId to UserId, etc.
                if (part.startsWith(":")) {
                    return this.capitalize(part.substring(1));
                }
                return this.capitalize(part);
            })
            .join("");

        const routeBaseName = this.capitalize(routeName.split("/").pop() || "");

        return `${method}${routeBaseName}${pathParts}`;
    }

    // Helper method to convert kebab-case to PascalCase
    private kebabToPascalCase(str: string): string {
        return str
            .split("-")
            .map((word) => this.capitalize(word))
            .join("");
    }

    // NEW: Generate semantic hook names based on route purpose
    private generateSemanticHookName(
        route: RouteInfo,
        routeName: string
    ): string {
        const method = route.method.toLowerCase();
        const routeBaseName = this.capitalize(routeName.split("/").pop() || "");
        const routeBaseSingular = singular(routeBaseName);

        // Handle specific patterns for better naming
        if (route.path === "/:id" && method === "get") {
            return `useGet${routeBaseSingular}`;
        }

        if (route.path === "/:id" && method === "put") {
            return `useUpdate${routeBaseSingular}`;
        }

        if (route.path === "/:id" && method === "delete") {
            return `useDelete${routeBaseSingular}`;
        }

        // Handle nested resources like /:id/visuals or /:id/box-model
        const pathSegments = route.path.split("/").filter((s) => s);
        if (pathSegments.length >= 2) {
            const resourceName = pathSegments[pathSegments.length - 1];
            // Convert kebab-case to PascalCase (box-model -> BoxModel)
            const resourceCapitalized = this.kebabToPascalCase(resourceName);

            if (method === "get") {
                return `useGet${routeBaseSingular}${resourceCapitalized}`;
            }
            if (method === "post") {
                return `useUpdate${routeBaseSingular}${resourceCapitalized}`;
            }
        }

        // Fallback to route ID based naming
        const routeId = this.generateRouteId(route, routeName);
        return `use${this.capitalize(routeId)}`;
    }

    // NEW: Generate clean type names
    private generateTypeName(
        route: RouteInfo,
        routeName: string,
        suffix: string
    ): string {
        const hookName = this.generateSemanticHookName(route, routeName);
        const baseName = hookName.replace(/^use/, "");
        return `${baseName}${suffix}`;
    }

    generateReactQueryHooks(config: ConfigInfo): string {
        const { routeName, routes } = config;

        let imports = `import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

`;

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

    private generateQueryHook(route: RouteInfo, routeName: string): string {
        const hookName = this.generateSemanticHookName(route, routeName);
        const clientPath = this.generateClientPath(route);
        const queryKey = this.generateQueryKey(route, routeName);

        // Convert routeName to proper client path format
        const routeNamePath = this.convertRouteNameToClientPath(routeName);

        let functionParams = "()";
        let clientParams = "";
        let queryKeyParams = "";
        let typeDefinitions = "";

        // Generate type definitions and function parameters
        const paramTypes: string[] = [];
        const paramNames: string[] = [];

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
        }

        // Update function parameters
        if (paramTypes.length > 0) {
            functionParams = `(${paramTypes.join(", ")})`;
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
            // Use JSON.stringify for query key parameters
            queryKeyParams = `, JSON.stringify({ ${paramNames.join(", ")} })`;
        }

        const methodCall = `$${route.method.toLowerCase()}`;

        // Generate queryOptions spread
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

        // Convert routeName to proper client path format
        const routeNamePath = this.convertRouteNameToClientPath(routeName);

        // Generate clean type names
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

        // Generate mutationOptions spread
        let mutationOptionsSpread = "";
        if (route.mutationOptions) {
            mutationOptionsSpread = `
        ...${route.mutationOptions},`;
        }

        return `type ${requestTypeName} = InferRequestType<
    (typeof client.api.v1${routeNamePath})${clientPath}["${methodCall}"]
>;
type ${responseTypeName} = InferResponseType<
    (typeof client.api.v1${routeNamePath})${clientPath}["${methodCall}"],
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

    private generateClientPath(route: RouteInfo): string {
        let path = route.path;

        // Handle specific path cases
        if (path === "/all") {
            return '["all"]';
        }

        if (path === "/create") {
            return '["create"]';
        }

        if (path === "/:id") {
            return '[":id"]';
        }

        // Handle root path
        if (path === "/") {
            return "";
        }

        // Split path and create bracket notation
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

        // Use the full routeName for query keys, replacing slashes with dots
        const queryKeyRouteName = routeName.replace("/", ".");

        if (path === "/all" || path === "/") {
            return `"${queryKeyRouteName}", "all"`;
        }

        // Remove parameters for query key
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

        // Log the initial discovery
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

                // Read file content to parse directives
                const content = fs.readFileSync(configFile, "utf-8");
                const { routeName } = this.parseConfigDirectives(content);

                // Add the file to the project
                const sourceFile = this.project.addSourceFileAtPath(configFile);

                // Parse routes
                const routes = this.parseRouteConfig(sourceFile);

                if (routes.length === 0) {
                    console.log(`  ⚠ No routes found in ${configFile}`);
                    continue;
                }

                // Extract module name from path as fallback
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

                // Generate hooks
                const hooksCode = this.generateReactQueryHooks(config);

                // Create output directory
                const outputDir = path.join(path.dirname(configFile), "client");
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                // Write output file
                const outputFile = path.join(outputDir, "index.ts");
                fs.writeFileSync(outputFile, hooksCode);

                console.log(`✓ Generated: ${outputFile}`);
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
