import { buildSchema } from 'drizzle-graphql';
import { createYoga } from 'graphql-yoga';

import { db } from '@/db';

const { schema } = buildSchema(db);

const yoga = createYoga({
    schema,
    graphqlEndpoint: '/api/graphql',
    fetchAPI: { Request, Response },
});

export { yoga as GET, yoga as POST, yoga as OPTIONS };
