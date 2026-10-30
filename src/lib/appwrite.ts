import { Client, Account, TablesDB, ID, Query, Permission, Role } from 'appwrite';

export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
export const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'reloop_db';

// TablesDB Table Identifiers (mapped to Appwrite TablesDB tables)
export const TABLE_USERS =
  process.env.NEXT_PUBLIC_APPWRITE_TABLE_USERS ||
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS ||
  'users';

export const TABLE_ITEMS =
  process.env.NEXT_PUBLIC_APPWRITE_TABLE_ITEMS ||
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ITEMS ||
  'items';

export const TABLE_REQUESTS =
  process.env.NEXT_PUBLIC_APPWRITE_TABLE_REQUESTS ||
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_REQUESTS ||
  'borrow_requests';

export const TABLE_REVIEWS =
  process.env.NEXT_PUBLIC_APPWRITE_TABLE_REVIEWS ||
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_REVIEWS ||
  'reviews';

// Determine if genuine Appwrite credentials are fully configured
export function isAppwriteConfigured(): boolean {
  return (
    typeof APPWRITE_PROJECT_ID === 'string' &&
    APPWRITE_PROJECT_ID.trim().length > 0 &&
    APPWRITE_PROJECT_ID !== 'your-project-id' &&
    APPWRITE_PROJECT_ID !== 'REPLACE_WITH_YOUR_PROJECT_ID'
  );
}

// Client initialization
export const client = new Client();

if (typeof window !== 'undefined' || isAppwriteConfigured()) {
  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID || 'unconfigured');
}

export const account = new Account(client);

// Genuine Appwrite TablesDB instance
export const tablesDB = new TablesDB(client);

export { ID, Query, Permission, Role };
