# ReLoop – Borrow More. Waste Less. Build Trust. 🔄🌱

> **Campus Community Circular Marketplace** built for the **Appwrite Databases Hackathon**.  
> Students lend, borrow, exchange, and give away everyday academic items like graphing calculators, textbooks, lab equipment, and tools.

---

## 🌟 The Problem & The Solution

Every semester, students spend thousands of dollars buying expensive gear:
- **TI-84 Graphing Calculators** ($120+) used for a single calculus or stats class.
- **Organic Chemistry Molecular Model Sets** ($40+) needed for two lab modules.
- **Heavy Physics & Engineering Textbooks** ($250+) that gather dust on dorm shelves.
- **Electronic Multimeters, Breadboards & Soldering Stations** used for one senior design project.

At the end of term, countless functional items end up in campus dumpsters during move-out week.

**ReLoop** is a hyper-local campus circular economy marketplace that connects students within campus quads. By leveraging **Appwrite Cloud TablesDB** for real-time document CRUD, row-level permissions, and authenticated campus sessions, ReLoop turns idle campus possessions into a shared pool of resources — saving student money and diverting waste from landfills.

---

## 🚀 Key Features

1. **Campus Marketplace with Real-time Filters:** Search by title/keywords and filter by Category (*Textbooks, Calculators, Lab Gear, Tools, Dorm*), Condition (*New, Like New, Good, Fair*), Mode (*Borrow, Exchange, Free Giveaway*), and Availability.
2. **Item Lifecycle Tracking:** Complete borrow state progression:
   $$\text{Pending} \longrightarrow \text{Approved} \longrightarrow \text{Borrowed (Handed Over)} \longrightarrow \text{Returned}$$
   - Automatically toggles item availability in the database.
3. **Appwrite Authentication & Session Management:**
   - Account creation, email/password login, and session persistence via Appwrite Account API.
   - Built-in multi-persona switcher for rapid testing of lender vs. borrower workflows.
4. **Row-Level Security & Document Permissions:**
   - Strict owner-only controls: Only the verified owner can edit, delete, or manage incoming requests for their items.
   - Authorized access: Only the borrower and lender can track active requests.
5. **Campus Trust Engine & Reviews:**
   - After an exchange is marked `returned`, users submit 1–5 star reviews with feedback.
   - Mutual ratings dynamically update the student's campus reputation score.
6. **Community Eco Impact Dashboard:**
   - Real-time statistics: Total items in circulation, active loans, landfill waste diverted (kg), student savings ($), and campus quad leaderboards.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Forest Green `#1b4332` & Cream `#fdfbf7` palette)
- **Backend & Database:** **Appwrite Cloud TablesDB (Databases)**
- **Authentication:** **Appwrite Authentication**
- **Client SDK:** Appwrite Web SDK (`appwrite`)
- **Icons:** Lucide React

---

## 🗄️ Appwrite Database Architecture (TablesDB)

ReLoop uses a dedicated database (`reloop_db`) containing four relational TablesDB tables:

### 1. `users` Table
Stores student campus profiles, contact information, and trust scores.
| Column / Attribute | Type | Size / Format | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | String | 255 | Yes | Appwrite Account ID |
| `name` | String | 255 | Yes | Student's full name |
| `email` | String | 255 | Yes | Campus email address |
| `campus` | String | 255 | Yes | Campus quad or hall |
| `reputation` | Integer | Min 0, Max 100 | No (Default: 100) | Calculated peer trust percentage |
| `totalBorrows` | Integer | - | No (Default: 0) | Count of borrowed items |
| `totalLends` | Integer | - | No (Default: 0) | Count of lent items |
| `avatarUrl` | String | 1000 | No | Student avatar photo |

### 2. `items` Table
Catalog of academic and dorm gear listed for circulation.
| Column / Attribute | Type | Size / Format | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `ownerId` | String | 255 | Yes | ID of listing owner |
| `ownerName` | String | 255 | No | Display name of owner |
| `ownerCampus` | String | 255 | No | Campus location of owner |
| `title` | String | 255 | Yes | Item title |
| `description` | String | 2000 | Yes | Detailed description and terms |
| `category` | String | 255 | Yes | Textbook, Tech, Lab, Tools, etc. |
| `condition` | String | 255 | Yes | New, Like New, Good, Fair |
| `mode` | String | 255 | Yes | Borrow, Exchange, Free Giveaway |
| `availability` | Boolean | - | Yes (Default: true) | Availability status |
| `imageUrl` | String | 1000 | Yes | Item photograph URL |
| `location` | String | 255 | No | Suggested handover spot |

### 3. `borrow_requests` Table
Tracks the entire borrowing lifecycle between student peers.
| Column / Attribute | Type | Size / Format | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `itemId` | String | 255 | Yes | Referenced item ID |
| `itemTitle` | String | 255 | No | Cached title for fast queries |
| `itemCategory` | String | 255 | No | Category |
| `itemImageUrl` | String | 1000 | No | Image thumbnail URL |
| `ownerId` | String | 255 | Yes | Item owner user ID |
| `ownerName` | String | 255 | No | Owner name |
| `borrowerId` | String | 255 | Yes | Borrower user ID |
| `borrowerName` | String | 255 | No | Borrower name |
| `borrowerCampus` | String | 255 | No | Borrower campus hall |
| `status` | String | 50 | Yes | `pending` \| `approved` \| `borrowed` \| `returned` \| `rejected` |
| `requestDate` | String | 100 | Yes | ISO timestamp of request |
| `dueDate` | String | 100 | Yes | Target return date |
| `message` | String | 1000 | No | Proposed meetup note |
| `returnedDate` | String | 100 | No | ISO timestamp when returned |

### 4. `reviews` Table
Stores ratings and feedback after an item is returned.
| Column / Attribute | Type | Size / Format | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `requestId` | String | 255 | Yes | Reference to completed exchange |
| `itemId` | String | 255 | No | Item ID |
| `itemTitle` | String | 255 | No | Item Title |
| `reviewerId` | String | 255 | Yes | User submitting the review |
| `reviewerName` | String | 255 | No | Reviewer display name |
| `revieweeId` | String | 255 | Yes | User receiving the review |
| `rating` | Integer | Min 1, Max 5 | Yes | Star rating |
| `comment` | String | 1000 | Yes | Peer feedback |

---

## 🔒 Security & Row-Level Permissions

ReLoop enforces strict document-level security so that sensitive actions cannot be forged:

1. **Items Permissions:**
   - Read: `Role.any()` (All students can discover listings)
   - Create: `Role.users()` (Authenticated students only)
   - Update / Delete: `Role.user(userId)` (Strictly restricted to the item's owner)
2. **Borrow Requests Permissions:**
   - Read: `Role.user(borrowerId)` and `Role.user(ownerId)` (Only the two participating students can access details)
   - Update: `Role.user(ownerId)` (Owner approves/rejects) and `Role.user(borrowerId)` (Borrower cancels)
3. **No Secrets in Frontend:**
   - Only public variables prefixed with `NEXT_PUBLIC_` (`ENDPOINT`, `PROJECT_ID`, `DATABASE_ID`, `COLLECTION_*`) are exposed.
   - Server keys (`APPWRITE_API_KEY`) are exclusively used in backend setup scripts and never bundled with client code.

---

## ⚡ Quickstart Guide

### 1. Clone & Install Dependencies
```bash
git clone <your-repo>
cd Appwrite
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Appwrite Cloud project credentials:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=reloop_db
NEXT_PUBLIC_APPWRITE_COLLECTION_USERS=users
NEXT_PUBLIC_APPWRITE_COLLECTION_ITEMS=items
NEXT_PUBLIC_APPWRITE_COLLECTION_REQUESTS=borrow_requests
NEXT_PUBLIC_APPWRITE_COLLECTION_REVIEWS=reviews
```

### 3. Automated Database Setup (Recommended)
You can automatically create the database, all four tables, and their attributes in under 30 seconds using the included script:

1. Go to **Appwrite Console** → Project Settings → **API Keys** → **Create API Key**.
2. Grant permissions: `databases.read`, `databases.write`, `collections.read`, `collections.write`, `attributes.read`, `attributes.write`.
3. Run:
```bash
APPWRITE_PROJECT_ID="your_project_id" APPWRITE_API_KEY="your_secret_key" node scripts/setup-appwrite.mjs
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Seed Realistic Campus Items
When running the application with a fresh database:
- Click the **"Seed Sample Items"** button on the top banner, or
- Browse the marketplace and click **"List an Item"** to publish custom listings.

---

## 🧪 Testing the Complete Workflow

To test the peer-to-peer lifecycle as both Lender and Borrower:
1. **Lender View:** Use the top-bar persona switcher to switch to **Alex Rivera (Lender)**.
   - Alex owns the TI-84 Plus CE Graphing Calculator.
2. **Borrower View:** Switch to **Maya Chen (Borrower)**.
   - Navigate to `/marketplace`, click on the TI-84 Calculator, and click **"Request to Borrow"**.
   - Pick a proposed return date and enter a note. Submit request.
3. **Approval:** Switch back to **Alex Rivera** and open `/dashboard`.
   - Under **Incoming Requests**, click **"Approve Request"**.
   - Click **"Confirm Handover (Mark Borrowed)"** when the item is exchanged.
   - Notice that the calculator automatically changes to **"In Use"** on the Marketplace!
4. **Return & Review:**
   - Once returned, Alex clicks **"Confirm Item Returned"**.
   - Both Alex and Maya can now click **"Review Peer"** to leave a 5-star rating and comment.
   - The recipient's Campus Trust Score updates in real time!

---

## 📦 Production Build Verification

Verify that the production build compiles with zero errors:
```bash
npm run build
```
Output:
```
▲ Next.js (webpack)
✓ Compiled successfully
✓ Finished TypeScript
✓ Generating static pages (3/3)
✓ Finalizing page optimization
```

---

## 📄 License
MIT © ReLoop Campus Network. Built for the Appwrite Databases Hackathon.
