/*eslint-disable*/

import path from "path";
import fs from "fs";

import { glob } from "glob";
import { Project, SyntaxKind } from "ts-morph";

interface ParsedRoute {
    path: string;
    method: string;
    middlewares: string[];
    validators: {
        params?: string;
        json?: string;
        query?: string;
    };
    handlerBody: string;
}

class HonoGenerator {
    private project: Project;

    constructor() {
        this.project = new Project({
            tsConfigFilePath: "tsconfig.json",
        });
    }

    async findConfigFiles(): Promise<string[]> {
        const files = await glob("**/config.ts", {
            ignore: ["node_modules/**", "dist/**", "build/**"],
        });

        return files.filter((file) => {
            const content = fs.readFileSync(file, "utf-8");
            return content.includes('"hono-codegen"');
        });
    }

    parseConfigFile(filePath: string): {
        routes: ParsedRoute[];
        imports: Set<string>;
        variables: string | null;
    } {
        const sourceFile = this.project.addSourceFileAtPath(filePath);
        const routes: ParsedRoute[] = [];
        const imports = new Set<string>();
        let variables: string | null = null;

        // Find the route config array (could be named differently now)
        const variableDeclarations = sourceFile.getVariableDeclarations();
        const routeConfigDeclaration = variableDeclarations.find((decl) => {
            const declText = decl.getText();
            return (
                declText.includes("defineRoute") ||
                declText.includes("RouteConfig") ||
                decl.getName().toLowerCase().includes("route")
            );
        });

        if (!routeConfigDeclaration) {
            throw new Error(`No route config array found in ${filePath}`);
        }

        const initializer = routeConfigDeclaration.getInitializer();
        if (
            !initializer ||
            initializer.getKind() !== SyntaxKind.ArrayLiteralExpression
        ) {
            throw new Error(`Invalid route config array in ${filePath}`);
        }

        // Parse each route config - get array elements properly
        const arrayElements = initializer
            .asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
            .getElements();

        arrayElements.forEach((element) => {
            // Handle defineRoute() call expressions
            if (element.getKind() === SyntaxKind.CallExpression) {
                const callExpr = element as import("ts-morph").CallExpression;
                const route = this.parseCallExpression(callExpr, imports);
                if (route) {
                    routes.push(route);
                }
            }
            // Handle direct object literals (legacy support)
            else if (element.getKind() === SyntaxKind.ObjectLiteralExpression) {
                const route = this.parseRouteObject(element, imports);
                if (route) {
                    routes.push(route);
                }
            }
            // Handle type assertions (as RouteConfig<...>)
            else if (element.getKind() === SyntaxKind.AsExpression) {
                const asExpr = element as import("ts-morph").AsExpression;
                const expression = asExpr.getExpression();
                if (
                    expression.getKind() === SyntaxKind.ObjectLiteralExpression
                ) {
                    const route = this.parseRouteObject(expression, imports);
                    if (route) {
                        routes.push(route);
                    }
                }
            }
        });

        // Extract imports from the source file and check for Variables import
        sourceFile.getImportDeclarations().forEach((importDecl) => {
            const moduleSpecifier = importDecl.getModuleSpecifierValue();
            const namedImports = importDecl
                .getNamedImports()
                .map((ni) => ni.getName())
                .filter(
                    (name) =>
                        name !== "RouteConfig" &&
                        name !== "defineRoute" &&
                        name !== "defineRouteWithVariables"
                );
            const defaultImport = importDecl.getDefaultImport()?.getText();

            // Check if Variables is imported
            const originalNamedImports = importDecl
                .getNamedImports()
                .map((ni) => ni.getName());
            if (originalNamedImports.includes("Variables")) {
                variables = "Variables";
            }

            if (namedImports.length > 0) {
                imports.add(
                    `import { ${namedImports.join(", ")} } from "${moduleSpecifier}";`
                );
            }
            if (defaultImport) {
                imports.add(
                    `import ${defaultImport} from "${moduleSpecifier}";`
                );
            }
        });

        return { routes, imports, variables };
    }

    private parseCallExpression(
        callExpr: import("ts-morph").CallExpression,
        imports: Set<string>
    ): ParsedRoute | null {
        const expression = callExpr.getExpression();
        let objectLiteral = null;

        // Handle defineRoute() - simple call
        if (expression.getText() === "defineRoute") {
            const args = callExpr.getArguments();
            if (
                args.length > 0 &&
                args[0].getKind() === SyntaxKind.ObjectLiteralExpression
            ) {
                objectLiteral = args[0];
            }
        }
        // Handle defineRouteWithVariables<Variables>()() - chained call
        else if (callExpr.getKind() === SyntaxKind.CallExpression) {
            // Check if this is a call to a call expression (chained call)
            const innerExpression = callExpr.getExpression();

            if (innerExpression.getKind() === SyntaxKind.CallExpression) {
                const innerCallExpr =
                    innerExpression as import("ts-morph").CallExpression;
                const innerExpressionText = innerCallExpr
                    .getExpression()
                    .getText();

                // Check if the inner call starts with defineRouteWithVariables
                if (
                    innerExpressionText.startsWith("defineRouteWithVariables")
                ) {
                    const args = callExpr.getArguments();
                    if (
                        args.length > 0 &&
                        args[0].getKind() === SyntaxKind.ObjectLiteralExpression
                    ) {
                        objectLiteral = args[0];
                    }
                }
            }
        }

        if (objectLiteral) {
            return this.parseRouteObject(objectLiteral, imports);
        }

        return null;
    }

    private parseRouteObject(
        objExpr: any,
        imports: Set<string>
    ): ParsedRoute | null {
        const properties = objExpr.getProperties();
        let path = "";
        let method = "";
        let middlewares: string[] = [];
        let validators: any = {};
        let handlerBody = "";

        properties.forEach((prop: any) => {
            const propName =
                prop.getName?.() || prop.getNameNode?.()?.getText();

            switch (propName) {
                case "path":
                    const pathInit = prop.getInitializer();
                    if (pathInit) {
                        path = pathInit.getText().replace(/['"]/g, "");
                    }
                    break;
                case "method":
                    const methodInit = prop.getInitializer();
                    if (methodInit) {
                        method = methodInit
                            .getText()
                            .replace(/['"]/g, "")
                            .toLowerCase();
                    }
                    break;
                case "middlewares":
                    const middlewareArray = prop.getInitializer();
                    if (middlewareArray) {
                        middlewares =
                            this.extractArrayElements(middlewareArray);
                    }
                    break;
                case "validators":
                    const validatorInit = prop.getInitializer();
                    if (validatorInit) {
                        validators = this.parseValidators(
                            validatorInit,
                            imports
                        );
                    }
                    break;
                case "handler":
                    const handlerInit = prop.getInitializer();
                    if (handlerInit) {
                        handlerBody = this.extractHandlerBody(handlerInit);
                    }
                    break;
            }
        });

        if (!path || !method || !handlerBody) {
            console.warn(
                `Skipping incomplete route: path="${path}", method="${method}", hasHandler=${!!handlerBody}`
            );
            return null;
        }

        return { path, method, middlewares, validators, handlerBody };
    }

    private extractArrayElements(arrayExpr: any): string[] {
        const elements: string[] = [];
        try {
            const arrayElements = arrayExpr.getElements?.() || [];
            arrayElements.forEach((element: any) => {
                elements.push(element.getText());
            });
        } catch (error) {
            console.warn("Failed to parse middleware array:", error);
        }
        return elements;
    }

    private parseValidators(validatorObj: any, imports: Set<string>): any {
        if (!validatorObj) return {};

        const validators: any = {};
        const properties = validatorObj.getProperties?.() || [];

        properties.forEach((prop: any) => {
            const propName =
                prop.getName?.() || prop.getNameNode?.()?.getText();
            const value = prop.getInitializer()?.getText();

            if (value) {
                validators[propName] = value;

                // Add zod import if needed
                if (value.includes("z.")) {
                    imports.add('import { z } from "zod";');
                }
            }
        });

        return validators;
    }

    private extractHandlerBody(handlerFunc: any): string {
        if (!handlerFunc) return "";

        const fullText = handlerFunc.getText();
        // Extract the function body (everything between the first { and last })
        const match = fullText.match(/async\s*\([^)]*\)\s*=>\s*{([\s\S]*)}$/);
        if (match) {
            return match[1].trim();
        }

        // Fallback: try to extract arrow function body
        const arrowMatch = fullText.match(/=>\s*{([\s\S]*)}$/);
        if (arrowMatch) {
            return arrowMatch[1].trim();
        }

        return fullText;
    }

    generateHonoCode(
        routes: ParsedRoute[],
        imports: Set<string>,
        variables: string | null
    ): string {
        const importStatements = [
            'import { z } from "zod";',
            'import { Hono } from "hono";',
            'import { zValidator } from "@hono/zod-validator";',
            "",
            ...Array.from(imports).filter(
                (imp) =>
                    !imp.includes('"zod"') &&
                    !imp.includes('"hono"') &&
                    !imp.includes('"@hono/zod-validator"')
            ),
        ].join("\n");

        let honoChain = variables
            ? `const app = new Hono<{ Variables: ${variables} }>()`
            : `const app = new Hono()`;

        routes.forEach((route) => {
            honoChain += this.generateRouteMethod(route);
        });

        honoChain += ";";

        return `${importStatements}\n\n${honoChain}\n\nexport default app;\n`;
    }

    private generateRouteMethod(route: ParsedRoute): string {
        let methodCall = `\n    .${route.method}(`;
        const args: string[] = [`"${route.path}"`];

        // Add middlewares
        route.middlewares.forEach((middleware) => {
            args.push(middleware);
        });

        // Add validators
        if (route.validators.params) {
            args.push(`zValidator("param", ${route.validators.params})`);
        }
        if (route.validators.json) {
            args.push(`zValidator("json", ${route.validators.json})`);
        }
        if (route.validators.query) {
            args.push(`zValidator("query", ${route.validators.query})`);
        }

        // Add handler
        args.push(
            `async (c) => {\n        ${route.handlerBody.replace(/\n/g, "\n        ")}\n    }`
        );

        methodCall += args.join(",\n        ");
        methodCall += "\n    )";

        return methodCall;
    }

    async generateForFile(configPath: string): Promise<void> {
        try {
            console.log(`Processing: ${configPath}`);

            const { routes, imports, variables } =
                this.parseConfigFile(configPath);
            const honoCode = this.generateHonoCode(routes, imports, variables);

            // Determine output path
            const configDir = path.dirname(configPath);
            const routesDir = path.join(configDir, "routes");
            const outputPath = path.join(routesDir, "index.ts");

            // Ensure routes directory exists
            if (!fs.existsSync(routesDir)) {
                fs.mkdirSync(routesDir, { recursive: true });
            }

            // Write the generated code
            fs.writeFileSync(outputPath, honoCode);
            console.log(`✓ Generated: ${outputPath}`);
        } catch (error) {
            console.error(`Error processing ${configPath}:`, error);
        }
    }

    async run(): Promise<void> {
        try {
            const configFiles = await this.findConfigFiles();

            if (configFiles.length === 0) {
                console.log(
                    'No config files found with "hono-codegen" marker.'
                );
                return;
            }

            console.log(
                `Found ${configFiles.length} config file(s) to process:`
            );
            configFiles.forEach((file) => console.log(`  - ${file}`));
            console.log("");

            for (const configFile of configFiles) {
                await this.generateForFile(configFile);
            }

            console.log("\n✅ Hono route generation completed!");
        } catch (error) {
            console.error("Error running Hono generator:", error);
            process.exit(1);
        }
    }
}

// Run the generator
const generator = new HonoGenerator();
generator.run().catch(console.error);
