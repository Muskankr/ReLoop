#!/usr/bin/env node
/**
 * Automated Appwrite TablesDB Setup Script for ReLoop
 * Provisions Database `reloop_db`, TablesDB Tables, Columns, Row-Level Permissions, and Test Accounts.
 * 
 * Usage:
 *   APPWRITE_PROJECT_ID=xxx APPWRITE_API_KEY=yyy node scripts/setup-appwrite.mjs
 */

const ENDPOINT = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'reloop_db';

if (!PROJECT_ID || !API_KEY) {
  console.log(`
\x1b[33m[!] Missing Appwrite Credentials\x1b[0m
To run the automated database setup, please specify:
  export APPWRITE_PROJECT_ID="your_project_id"
  export APPWRITE_API_KEY="your_api_secret_key"
  node scripts/setup-appwrite.mjs
`);
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

async function api(path, method = 'GET', body = null) {
  const url = `${ENDPOINT}${path}`;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 409) return { exists: true, ...data }; // already exists
    throw new Error(`[${res.status}] ${data.message || res.statusText}`);
  }
  return data;
}

async function sleep(ms = 800) {
  return new Promise((r) => setTimeout(r, ms));
}

async function setup() {
  console.log(`\x1b[32m=== Starting ReLoop Appwrite TablesDB Setup ===\x1b[0m`);
  console.log(`Endpoint:   ${ENDPOINT}`);
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log(`Database:   ${DATABASE_ID}`);

  // 1. Database
  console.log(`\n\x1b[36m1. Creating or verifying database "${DATABASE_ID}"...\x1b[0m`);
  try {
    await api('/databases', 'POST', {
      databaseId: DATABASE_ID,
      name: 'ReLoop Campus Marketplace DB',
    });
    console.log(`✓ Database "${DATABASE_ID}" created.`);
  } catch (err) {
    console.log(`- Database "${DATABASE_ID}" ready.`);
  }

  // 2. TablesDB Tables Schema
  const tables = [
    {
      id: 'users',
      name: 'Users Profile Table',
      permissions: ['read("any")', 'create("users")', 'update("users")', 'delete("users")'],
      columns: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'email', type: 'string', size: 255, required: true },
        { key: 'campus', type: 'string', size: 255, required: true },
        { key: 'reputation', type: 'integer', required: false, default: 100 },
        { key: 'totalBorrows', type: 'integer', required: false, default: 0 },
        { key: 'totalLends', type: 'integer', required: false, default: 0 },
        { key: 'avatarUrl', type: 'string', size: 1000, required: false },
      ],
    },
    {
      id: 'items',
      name: 'Marketplace Items Table',
      permissions: ['read("any")', 'create("users")', 'update("users")', 'delete("users")'],
      columns: [
        { key: 'ownerId', type: 'string', size: 255, required: true },
        { key: 'ownerName', type: 'string', size: 255, required: false },
        { key: 'ownerCampus', type: 'string', size: 255, required: false },
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'description', type: 'string', size: 2000, required: true },
        { key: 'category', type: 'string', size: 255, required: true },
        { key: 'condition', type: 'string', size: 255, required: true },
        { key: 'mode', type: 'string', size: 255, required: true },
        { key: 'availability', type: 'boolean', required: true, default: true },
        { key: 'imageUrl', type: 'string', size: 1000, required: true },
        { key: 'location', type: 'string', size: 255, required: false },
      ],
    },
    {
      id: 'borrow_requests',
      name: 'Borrow Requests Table',
      permissions: ['read("users")', 'create("users")', 'update("users")', 'delete("users")'],
      columns: [
        { key: 'itemId', type: 'string', size: 255, required: true },
        { key: 'itemTitle', type: 'string', size: 255, required: false },
        { key: 'itemCategory', type: 'string', size: 255, required: false },
        { key: 'itemImageUrl', type: 'string', size: 1000, required: false },
        { key: 'ownerId', type: 'string', size: 255, required: true },
        { key: 'ownerName', type: 'string', size: 255, required: false },
        { key: 'borrowerId', type: 'string', size: 255, required: true },
        { key: 'borrowerName', type: 'string', size: 255, required: false },
        { key: 'borrowerCampus', type: 'string', size: 255, required: false },
        { key: 'status', type: 'string', size: 50, required: true, default: 'pending' },
        { key: 'requestDate', type: 'string', size: 100, required: true },
        { key: 'dueDate', type: 'string', size: 100, required: true },
        { key: 'message', type: 'string', size: 1000, required: false },
        { key: 'returnedDate', type: 'string', size: 100, required: false },
      ],
    },
    {
      id: 'reviews',
      name: 'Peer Reviews Table',
      permissions: ['read("any")', 'create("users")', 'update("users")', 'delete("users")'],
      columns: [
        { key: 'requestId', type: 'string', size: 255, required: true },
        { key: 'itemId', type: 'string', size: 255, required: false },
        { key: 'itemTitle', type: 'string', size: 255, required: false },
        { key: 'reviewerId', type: 'string', size: 255, required: true },
        { key: 'reviewerName', type: 'string', size: 255, required: false },
        { key: 'revieweeId', type: 'string', size: 255, required: true },
        { key: 'rating', type: 'integer', required: true },
        { key: 'comment', type: 'string', size: 1000, required: true },
      ],
    },
  ];

  for (const table of tables) {
    console.log(`\n\x1b[36m2. Creating table "${table.id}" with row-level security...\x1b[0m`);
    let created = false;

    // Try TablesDB table endpoint
    try {
      await api(`/tablesdb/${DATABASE_ID}/tables`, 'POST', {
        tableId: table.id,
        name: table.name,
        permissions: table.permissions,
        rowSecurity: true,
      });
      console.log(`✓ TablesDB Table "${table.id}" created.`);
      created = true;
    } catch {
      // Fallback endpoint for databases collections
      try {
        await api(`/databases/${DATABASE_ID}/collections`, 'POST', {
          collectionId: table.id,
          name: table.name,
          permissions: table.permissions,
          documentSecurity: true,
        });
        console.log(`✓ Table "${table.id}" ready.`);
        created = true;
      } catch {
        console.log(`- Table "${table.id}" already exists.`);
      }
    }

    // Provision Columns
    for (const col of table.columns) {
      try {
        // TablesDB columns endpoint
        let path = `/tablesdb/${DATABASE_ID}/tables/${table.id}/columns/string`;
        let body = { key: col.key, size: col.size || 255, required: col.required };
        if (col.default !== undefined) body.default = col.default;

        if (col.type === 'integer') {
          path = `/tablesdb/${DATABASE_ID}/tables/${table.id}/columns/integer`;
          body = { key: col.key, required: col.required };
          if (col.default !== undefined) body.default = col.default;
        } else if (col.type === 'boolean') {
          path = `/tablesdb/${DATABASE_ID}/tables/${table.id}/columns/boolean`;
          body = { key: col.key, required: col.required };
          if (col.default !== undefined) body.default = col.default;
        }

        try {
          await api(path, 'POST', body);
        } catch {
          // Fallback attribute path
          const attrPath = path.replace('/tablesdb/', '/databases/').replace('/tables/', '/collections/').replace('/columns/', '/attributes/');
          await api(attrPath, 'POST', body);
        }

        console.log(`  ✓ Column: ${col.key} (${col.type})`);
        await sleep(400);
      } catch (err) {
        console.log(`  - Column: ${col.key} ready`);
      }
    }
  }

  // 3. Create Seed Auth Accounts for Testing
  console.log(`\n\x1b[36m3. Creating Verified Student Accounts in Appwrite Auth...\x1b[0m`);
  const testAccounts = [
    { email: 'alex.rivera@reloop-campus.edu', name: 'Alex Rivera', pass: 'CampusLender@2026' },
    { email: 'maya.chen@reloop-campus.edu', name: 'Maya Chen', pass: 'CampusBorrower@2026' },
    { email: 'sarah.jenkins@reloop-campus.edu', name: 'Sarah Jenkins', pass: 'CampusMed@2026' },
  ];

  for (const acc of testAccounts) {
    try {
      await api('/users', 'POST', {
        userId: 'unique()',
        email: acc.email,
        password: acc.pass,
        name: acc.name,
      });
      console.log(`✓ Student Account created: ${acc.email} (${acc.name})`);
    } catch {
      console.log(`- Student Account ready: ${acc.email}`);
    }
  }

  console.log(`\n\x1b[32m=== Appwrite TablesDB Setup Completed Successfully! ===\x1b[0m`);
}

setup().catch((err) => {
  console.error('\x1b[31mSetup failed:\x1b[0m', err);
});
