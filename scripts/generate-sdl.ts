import * as fs from 'fs';
import * as path from 'path';

interface Column {
    name: string;
    type: string;
    nullable: boolean;
    primaryKey: boolean;
    defaultValue?: string;
}

interface Table {
    name: string;
    columns: Column[];
    foreignKeys: Array<{
        column: string;
        referencedTable: string;
        referencedColumn: string;
    }>;
}

class SQLToGraphQLConverter {
    private tables: Map<string, Table> = new Map();

    private mapSQLTypeToGraphQL(sqlType: string, nullable: boolean): string {
        const baseType = this.getGraphQLBaseType(sqlType);
        return nullable ? baseType : `${baseType}!`;
    }

    private getGraphQLBaseType(sqlType: string): string {
        const lowerType = sqlType.toLowerCase();

        if (lowerType.includes('text') || lowerType.includes('varchar') || lowerType.includes('char')) {
            return 'String';
        }
        if (lowerType.includes('int') || lowerType.includes('serial')) {
            return 'Int';
        }
        if (
            lowerType.includes('real') ||
            lowerType.includes('float') ||
            lowerType.includes('double') ||
            lowerType.includes('decimal')
        ) {
            return 'Float';
        }
        if (lowerType.includes('boolean') || lowerType.includes('bool')) {
            return 'Boolean';
        }
        if (lowerType.includes('timestamp') || lowerType.includes('datetime') || lowerType.includes('date')) {
            return 'String'; // You might want to use a custom DateTime scalar
        }

        return 'String'; // Default fallback
    }

    private parseCreateTable(sql: string): Table | null {
        const createTableRegex = /CREATE TABLE `([^`]+)` \(([\s\S]*?)\);/;
        const match = sql.match(createTableRegex);

        if (!match) return null;

        const tableName = match[1];
        const columnsSection = match[2];

        const columns: Column[] = [];
        const foreignKeys: Array<{ column: string; referencedTable: string; referencedColumn: string }> = [];

        // Split by lines and process each column definition
        const lines = columnsSection
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line);

        for (const line of lines) {
            if (line.startsWith('FOREIGN KEY')) {
                // Parse foreign key: FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
                const fkMatch = line.match(/FOREIGN KEY \(`([^`]+)`\) REFERENCES `([^`]+)`\(`([^`]+)`\)/);
                if (fkMatch) {
                    foreignKeys.push({
                        column: fkMatch[1],
                        referencedTable: fkMatch[2],
                        referencedColumn: fkMatch[3],
                    });
                }
                continue;
            }

            if (line.startsWith('`') && !line.startsWith('FOREIGN KEY')) {
                // Parse column definition
                const columnMatch = line.match(/`([^`]+)` ([^\s,]+)(.*)?,?$/);
                if (columnMatch) {
                    const columnName = columnMatch[1];
                    const columnType = columnMatch[2];
                    const constraints = columnMatch[3] || '';

                    const isPrimaryKey = constraints.includes('PRIMARY KEY');
                    const isNotNull = constraints.includes('NOT NULL') || isPrimaryKey;
                    const defaultMatch = constraints.match(/DEFAULT '?([^',\s]+)'?/);

                    columns.push({
                        name: columnName,
                        type: columnType,
                        nullable: !isNotNull,
                        primaryKey: isPrimaryKey,
                        defaultValue: defaultMatch ? defaultMatch[1] : undefined,
                    });
                }
            }
        }

        return {
            name: tableName,
            columns,
            foreignKeys,
        };
    }

    private generateGraphQLType(table: Table): string {
        let graphqlType = `type ${this.toPascalCase(table.name)} {\n`;

        for (const column of table.columns) {
            const graphqlFieldType = this.mapSQLTypeToGraphQL(column.type, column.nullable);
            graphqlType += `  ${this.toCamelCase(column.name)}: ${graphqlFieldType}\n`;
        }

        // Add relationships based on foreign keys
        for (const fk of table.foreignKeys) {
            const referencedType = this.toPascalCase(fk.referencedTable);
            graphqlType += `  ${this.toCamelCase(fk.referencedTable)}: ${referencedType}\n`;
        }

        // Add reverse relationships (one-to-many)
        for (const [_, otherTable] of this.tables) {
            for (const fk of otherTable.foreignKeys) {
                if (fk.referencedTable === table.name) {
                    const relationName = this.pluralize(this.toCamelCase(otherTable.name));
                    const relationType = this.toPascalCase(otherTable.name);
                    graphqlType += `  ${relationName}: [${relationType}!]!\n`;
                }
            }
        }

        graphqlType += '}\n';
        return graphqlType;
    }

    private generateInputTypes(table: Table): string {
        let inputTypes = '';

        // Create Input
        inputTypes += `input Create${this.toPascalCase(table.name)}Input {\n`;
        for (const column of table.columns) {
            if (column.primaryKey) continue; // Skip auto-generated IDs

            const graphqlFieldType = this.mapSQLTypeToGraphQL(column.type, true); // Make optional for input
            const fieldType = graphqlFieldType.endsWith('!') ? graphqlFieldType.slice(0, -1) : graphqlFieldType;
            inputTypes += `  ${this.toCamelCase(column.name)}: ${fieldType}\n`;
        }
        inputTypes += '}\n\n';

        // Update Input
        inputTypes += `input Update${this.toPascalCase(table.name)}Input {\n`;
        for (const column of table.columns) {
            const graphqlFieldType = this.mapSQLTypeToGraphQL(column.type, true);
            const fieldType = graphqlFieldType.endsWith('!') ? graphqlFieldType.slice(0, -1) : graphqlFieldType;
            inputTypes += `  ${this.toCamelCase(column.name)}: ${fieldType}\n`;
        }
        inputTypes += '}\n\n';

        return inputTypes;
    }

    private generateQueries(): string {
        let queries = 'type Query {\n';

        for (const [_, table] of this.tables) {
            const typeName = this.toPascalCase(table.name);
            const camelName = this.toCamelCase(table.name);
            const pluralName = this.pluralize(camelName);

            // Single item query
            queries += `  ${camelName}(id: ID!): ${typeName}\n`;
            // List query
            queries += `  ${pluralName}(limit: Int, offset: Int): [${typeName}!]!\n`;
        }

        queries += '}\n\n';
        return queries;
    }

    private generateMutations(): string {
        let mutations = 'type Mutation {\n';

        for (const [_, table] of this.tables) {
            const typeName = this.toPascalCase(table.name);
            const camelName = this.toCamelCase(table.name);

            // Create mutation
            mutations += `  create${typeName}(input: Create${typeName}Input!): ${typeName}!\n`;
            // Update mutation
            mutations += `  update${typeName}(id: ID!, input: Update${typeName}Input!): ${typeName}!\n`;
            // Delete mutation
            mutations += `  delete${typeName}(id: ID!): Boolean!\n`;
        }

        mutations += '}\n\n';
        return mutations;
    }

    private toPascalCase(str: string): string {
        return str
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }

    private toCamelCase(str: string): string {
        const pascalCase = this.toPascalCase(str);
        return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
    }

    private pluralize(str: string): string {
        // Simple pluralization - you might want to use a proper library like 'pluralize'
        if (str.endsWith('y')) {
            return str.slice(0, -1) + 'ies';
        }
        if (str.endsWith('s') || str.endsWith('sh') || str.endsWith('ch') || str.endsWith('x') || str.endsWith('z')) {
            return str + 'es';
        }
        return str + 's';
    }

    public getTableCount(): number {
        return this.tables.size;
    }

    public convertFile(inputPath: string, outputPath?: string): void {
        try {
            const sqlContent = fs.readFileSync(inputPath, 'utf-8');
            const graphqlSDL = this.convertSQL(sqlContent);

            const output = outputPath || inputPath.replace('.sql', '.graphql');
            fs.writeFileSync(output, graphqlSDL);

            console.log(`✅ Successfully converted ${inputPath} to ${output}`);
        } catch (error) {
            console.error(`❌ Error converting file: ${error}`);
        }
    }

    public convertSQL(sqlContent: string): string {
        this.tables.clear();

        // Split SQL content by statement breakpoints
        const statements = sqlContent.split('--> statement-breakpoint');

        // First pass: parse all tables
        for (const statement of statements) {
            const table = this.parseCreateTable(statement.trim());
            if (table) {
                this.tables.set(table.name, table);
            }
        }

        // Generate GraphQL SDL
        let graphqlSDL = '# Generated GraphQL Schema\n\n';

        // Generate scalar types if needed
        graphqlSDL += 'scalar DateTime\n\n';

        // Generate types
        for (const [_, table] of this.tables) {
            graphqlSDL += this.generateGraphQLType(table) + '\n';
        }

        // Generate input types
        for (const [_, table] of this.tables) {
            graphqlSDL += this.generateInputTypes(table);
        }

        // Generate root types
        graphqlSDL += this.generateQueries();
        graphqlSDL += this.generateMutations();

        return graphqlSDL;
    }
}

// Hardcoded paths
const INPUT_DIRECTORY = path.resolve(__dirname, '../drizzle/migrations');
const OUTPUT_FILE = path.resolve(__dirname, '../src/app/api/graphql/schema.graphql');

function findLatestSQLFile(directory: string): string | null {
    try {
        const files = fs.readdirSync(directory);
        const sqlFiles = files.filter((file) => file.endsWith('.sql'));

        if (sqlFiles.length === 0) {
            console.log('❌ No SQL files found in migrations/meta directory');
            return null;
        }

        // Sort by modification time, get the latest
        const filesWithStats = sqlFiles.map((file) => {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);
            return { file, path: filePath, mtime: stats.mtime };
        });

        filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
        const latestFile = filesWithStats[0];

        console.log(`📄 Found SQL file: ${latestFile.file}`);
        return latestFile.path;
    } catch (error) {
        console.error(`❌ Error reading directory ${directory}:`, error);
        return null;
    }
}

// Main execution
function main() {
    const converter = new SQLToGraphQLConverter();

    // Find the latest SQL file in the migrations directory
    const sqlFile = findLatestSQLFile(INPUT_DIRECTORY);

    if (!sqlFile) {
        console.log('❌ No SQL file found to convert');
        process.exit(1);
    }

    try {
        // Convert the SQL file to GraphQL
        const sqlContent = fs.readFileSync(sqlFile, 'utf-8');
        const graphqlSDL = converter.convertSQL(sqlContent);

        // Write to hardcoded output location
        fs.writeFileSync(OUTPUT_FILE, graphqlSDL);

        console.log(`✅ Successfully converted ${path.basename(sqlFile)} to ${OUTPUT_FILE}`);
        console.log(`📊 Generated schema with ${converter.getTableCount()} tables`);
    } catch (error) {
        console.error(`❌ Error during conversion: ${error}`);
        process.exit(1);
    }
}

// Export for use as module
export { SQLToGraphQLConverter };

// Run if called directly
if (require.main === module) {
    main();
}
