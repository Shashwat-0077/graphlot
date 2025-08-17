import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useNotionDatabases = () => {
    return useQuery({
        queryKey: ["notion", "databases"],
        queryFn: async () => {
    const response = await client.api.v1["notion"]["databases"].$get();

    if (!response.ok) {
        const error = await response.json();
        if (error) {
            throw new Error(`${error}`);
        } else {
            throw new Error("Failed to fetch notion");
        }
    }

    return await response.json();
},
        staleTime: 0,
    });
};

type NotionTableDataParams = {
  notionTableId: string;
};

export const useNotionTableData = ({params}: {params: NotionTableDataParams}) => {
    return useQuery({
        queryKey: ["notion", ":notionTableId/table-data", JSON.stringify({ params })],
        queryFn: async () => {
    const response = await client.api.v1["notion"][":notionTableId"]["table-data"].$get({
                param: params,
            });

    if (!response.ok) {
        const error = await response.json();
        if (error) {
            throw new Error(`${error}`);
        } else {
            throw new Error("Failed to fetch notion");
        }
    }

    return await response.json();
},
        
    });
};

type NotionTableSchemaParams = {
  notionTableId: string;
};

export const useNotionTableSchema = ({params}: {params: NotionTableSchemaParams}) => {
    return useQuery({
        queryKey: ["notion", ":notionTableId/table-schema", JSON.stringify({ params })],
        queryFn: async () => {
    const response = await client.api.v1["notion"][":notionTableId"]["table-schema"].$get({
                param: params,
            });

    if (!response.ok) {
        const error = await response.json();
        if (error) {
            throw new Error(`${error}`);
        } else {
            throw new Error("Failed to fetch notion");
        }
    }

    return await response.json();
},
        
    });
};

type NotionTableMetadataParams = {
  notionTableId: string;
};

export const useNotionTableMetadata = ({params}: {params: NotionTableMetadataParams}) => {
    return useQuery({
        queryKey: ["notion", ":notionTableId/table-metadata", JSON.stringify({ params })],
        queryFn: async () => {
    const response = await client.api.v1["notion"][":notionTableId"]["table-metadata"].$get({
                param: params,
            });

    if (!response.ok) {
        const error = await response.json();
        if (error) {
            throw new Error(`${error}`);
        } else {
            throw new Error("Failed to fetch notion");
        }
    }

    return await response.json();
},
        
    });
};

