import { GetDatabaseResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export type NotionPropertySchema = GetDatabaseResponse['properties'];
export type NotionPropertyData = PageObjectResponse['properties'];
