import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    // Point to your running GraphQL Yoga endpoint
    schema: "http://localhost:3000/api/graphql",

    // Globs to find files with GraphQL operations (queries, mutations)
    documents: ["src/**/*.ts", "src/**/*.tsx"],

    // Configuration for the generated output
    generates: {
        "./src/gql/": {
            // This is the output directory
            preset: "client-preset",
            plugins: [], // No additional plugins needed for client-preset
        },
    },

    // Optional: Prevents errors when you have no documents yet
    ignoreNoDocuments: true,
};

export default config;
