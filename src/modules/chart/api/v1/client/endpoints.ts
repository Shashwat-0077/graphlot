export const chartEndpoints = {
    getAll: {
        method: "GET",
        path: "/charts/all",
        middleware: [],
        validation: {},
        handler: () => {},
    },
    getById: {
        method: "GET",
        path: (id: string) => `/charts/${id}`,
        middleware: [],
        validation: {},
        handler: () => {},
    },
    getFull: {
        method: "GET",
        path: (id: string) => `/charts/${id}/full`,
        middleware: [],
        validation: {},
        handler: () => {},
    },
    create: {
        method: "POST",
        path: "/charts/create-chart",
        middleware: [],
        validation: {},
        handler: () => {},
    },
    update: {
        method: "PUT",
        path: (id: string) => `/charts/${id}`,
        middleware: [],
        validation: {},
        handler: () => {},
    },
    delete: {
        method: "DELETE",
        path: (id: string) => `/charts/${id}`,
        middleware: [],
        validation: {},
        handler: () => {},
    },
} as const;
