/* eslint-disable */

import { Project, SourceFile, SyntaxKind } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

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

        // Extract module name from file path as fallback
        return { routeName, moduleName };
    }

    parseRouteConfig(sourceFile: SourceFile): RouteInfo[] {
        const routes: RouteInfo[] = [];

        // Find the routeConfigs array
        const variableDeclarations = sourceFile.getVariableDeclarations();

        for (const declaration of variableDeclarations) {
            if (declaration.getName() === "routeConfigs") {
                const initializer = declaration.getInitializer();
                if (
                    initializer &&
                    initializer.getKind() === SyntaxKind.ArrayLiteralExpression
                ) {
                    const arrayLiteral = initializer.asKindOrThrow(
                        SyntaxKind.ArrayLiteralExpression
                    );

                    for (const element of arrayLiteral.getElements()) {
                        if (
                            element.getKind() ===
                            SyntaxKind.ObjectLiteralExpression
                        ) {
                            const route = this.parseRouteObject(
                                element.asKindOrThrow(
                                    SyntaxKind.ObjectLiteralExpression
                                )
                            );
                            if (route) {
                                routes.push(route);
                            }
                        } else if (
                            element.getKind() === SyntaxKind.AsExpression
                        ) {
                            // Handle routes with type assertions like "as RouteConfig<...>"
                            const asExpression = element.asKindOrThrow(
                                SyntaxKind.AsExpression
                            );
                            const expression = asExpression.getExpression();
                            const typeNode = asExpression.getTypeNode();

                            if (
                                expression.getKind() ===
                                SyntaxKind.ObjectLiteralExpression
                            ) {
                                const route = this.parseRouteObject(
                                    expression.asKindOrThrow(
                                        SyntaxKind.ObjectLiteralExpression
                                    ),
                                    typeNode
                                );
                                if (route) {
                                    routes.push(route);
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log(
            `Found ${routes.length} routes in ${sourceFile.getFilePath()}`
        );
        return routes;
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
                            if (validatorName === "params") {
                                hasParams = true;
                                // If we don't have the type from RouteConfig, try to extract it
                                if (!paramsZodType) {
                                    paramsZodType = validatorProp
                                        .getInitializer()
                                        ?.getText();
                                }
                                // Extract parameter names
                                paramNames =
                                    this.extractParamNamesFromValidator(
                                        validatorProp.getInitializer()
                                    );
                            } else if (validatorName === "query") {
                                hasQuery = true;
                                if (!queryZodType) {
                                    queryZodType = validatorProp
                                        .getInitializer()
                                        ?.getText();
                                }
                            } else if (validatorName === "json") {
                                hasJson = true;
                                if (!jsonZodType) {
                                    jsonZodType = validatorProp
                                        .getInitializer()
                                        ?.getText();
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
            console.log(
                `Parsed route: ${method} ${path} - params: ${paramNames.join(", ")}`
            );
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
            };
        }

        return null;
    }

    private isEmptyZodType(zodType: string): boolean {
        return (
            zodType.includes("z.ZodObject<{}>") ||
            zodType.includes("z.ZodObject<Record<string, never>>") ||
            zodType.trim() === "{}"
        );
    }

    private isZodTypeOptional(zodType: string): boolean {
        // Check if all properties in the Zod object are optional
        // This is a simple heuristic - you might need to enhance this for complex cases

        // If the type contains only ZodOptional, then it's optional
        const hasRequiredFields =
            zodType.includes("z.ZodString") &&
            !zodType.includes("z.ZodOptional<z.ZodString>");
        const hasRequiredNumber =
            zodType.includes("z.ZodNumber") &&
            !zodType.includes("z.ZodOptional<z.ZodNumber>");
        const hasRequiredBoolean =
            zodType.includes("z.ZodBoolean") &&
            !zodType.includes("z.ZodOptional<z.ZodBoolean>");

        // If there are required fields, query is not optional
        if (hasRequiredFields || hasRequiredNumber || hasRequiredBoolean) {
            return false;
        }

        // If it only contains optional fields or is empty, it's optional
        return true;
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

    generateReactQueryHooks(config: ConfigInfo): string {
        const { routeName, routes } = config;

        let imports = `import { useQuery, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { z } from "zod";
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
        const hookName = this.generateHookName(route, "use", routeName);
        const clientPath = this.generateClientPath(route);
        const queryKey = this.generateQueryKey(route, routeName);

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
            const paramsTypeName = `${hookName.replace("use", "")}Params`;
            typeDefinitions += `type ${paramsTypeName} = z.infer<${route.paramsZodType}>;

`;
            paramTypes.push(`params: ${paramsTypeName}`);
            paramNames.push("params");
        }

        if (
            route.hasQuery &&
            route.queryZodType &&
            !this.isEmptyZodType(route.queryZodType)
        ) {
            const queryTypeName = `${hookName.replace("use", "")}Query`;
            typeDefinitions += `type ${queryTypeName} = z.infer<${route.queryZodType}>;

`;
            // Check if all query fields are optional by examining the Zod type
            const isQueryOptional = this.isZodTypeOptional(route.queryZodType);
            paramTypes.push(
                `query${isQueryOptional ? "?" : ""}: ${queryTypeName}`
            );
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
            queryKeyParams = `, ${paramNames.join(", ")}`;
        }

        const methodCall = `$${route.method.toLowerCase()}`;

        return `${typeDefinitions}export const ${hookName} = ${functionParams} => {
    const queryResult = useQuery({
        queryKey: [${queryKey}${queryKeyParams}],
        queryFn: async () => {
            const response = await client.api.v1.${routeName}${clientPath}.${methodCall}(${clientParams ? `${clientParams}` : ""});

            if (!response.ok) {
                throw new Error("Failed to fetch ${routeName}");
            }

            return await response.json();
        },
        ${route.hasParams ? "" : "staleTime: 0,"}
    });

    return queryResult;
};

`;
    }

    private generateMutationHook(route: RouteInfo, routeName: string): string {
        const hookName = this.generateHookName(route, "use", routeName);
        const clientPath = this.generateClientPath(route);
        const methodCall = `$${route.method.toLowerCase()}`;

        let typeDefinitions = "";

        // Only generate type definitions for non-empty types for mutations
        // We don't need separate types for mutations since we use InferRequestType
        // But we can still generate them for reference if needed in the future

        return `type ${hookName.replace("use", "")}RequestType = InferRequestType<
    (typeof client.api.v1.${routeName})${clientPath}["${methodCall}"]
>;
type ${hookName.replace("use", "")}ResponseType = InferResponseType<
    (typeof client.api.v1.${routeName})${clientPath}["${methodCall}"],
    200
>;

export const ${hookName} = () => {
    return useMutation<${hookName.replace("use", "")}ResponseType, Error, ${hookName.replace("use", "")}RequestType>({
        mutationFn: async (props) => {
            const response = await client.api.v1.${routeName}${clientPath}.${methodCall}(props);

            if (!response.ok) {
                throw new Error("Failed to ${route.method.toLowerCase()} ${routeName}");
            }

            return await response.json();
        },
    });
};

`;
    }

    private generateHookName(
        route: RouteInfo,
        prefix: string,
        routeName: string
    ): string {
        const method = route.method.toLowerCase();
        const routeNameSingular = this.getSingularForm(routeName);

        // Handle special cases
        if (route.path === "/all") {
            if (method === "get") {
                return `${prefix}${this.capitalize(routeName)}`;
            }
        }

        if (route.path.includes("/:id") && method === "get") {
            return `${prefix}${this.capitalize(routeNameSingular)}ById`;
        }

        if (route.path === "/create" && method === "post") {
            return `${prefix}Create${this.capitalize(routeNameSingular)}`;
        }

        if (route.path.includes("/:id") && method === "put") {
            return `${prefix}Update${this.capitalize(routeNameSingular)}`;
        }

        if (route.path.includes("/:id") && method === "delete") {
            return `${prefix}Delete${this.capitalize(routeNameSingular)}`;
        }

        // Fallback logic
        let pathPart = route.path
            .replace(/^\//, "")
            .replace(/\/:/g, "By")
            .replace(/\//g, "");

        if (!pathPart) {
            pathPart = "all";
        }

        if (method === "get") {
            return `${prefix}${this.capitalize(pathPart)}`;
        }

        return `${prefix}${this.capitalize(method)}${this.capitalize(pathPart)}`;
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

        if (path === "/all" || path === "/") {
            return `"${routeName}", "all"`;
        }

        // Remove parameters for query key
        const cleanPath = path.replace(/\/:\w+/g, "").replace(/^\//, "");

        if (cleanPath) {
            return `"${routeName}", "${cleanPath}"`;
        }

        return `"${routeName}"`;
    }

    private getSingularForm(plural: string): string {
        // Simple singularization - you might want to use a library for more complex cases
        if (plural.endsWith("ies")) {
            return plural.slice(0, -3) + "y";
        }
        if (plural.endsWith("es")) {
            return plural.slice(0, -2);
        }
        if (plural.endsWith("s")) {
            return plural.slice(0, -1);
        }
        return plural;
    }

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async generate(rootDir: string) {
        const configFiles = this.findConfigFiles(rootDir);

        for (const configFile of configFiles) {
            console.log(`Processing: ${configFile}`);

            // Read file content to parse directives
            const content = fs.readFileSync(configFile, "utf-8");
            const { routeName } = this.parseConfigDirectives(content);

            // Add the file to the project
            const sourceFile = this.project.addSourceFileAtPath(configFile);

            // Parse routes
            const routes = this.parseRouteConfig(sourceFile);

            if (routes.length === 0) {
                console.log(`No routes found in ${configFile}`);
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

            console.log(`Generated: ${outputFile}`);
            console.log(`Route name used: ${config.routeName}`);
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
