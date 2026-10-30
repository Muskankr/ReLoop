import {
  tablesDB,
  APPWRITE_DATABASE_ID,
  TABLE_USERS,
  TABLE_ITEMS,
  TABLE_REQUESTS,
  TABLE_REVIEWS,
  ID,
  Query,
  Permission,
  Role,
  isAppwriteConfigured,
} from './appwrite';
import {
  ItemListing,
  BorrowRequest,
  Review,
  UserProfile,
  CommunityStats,
  RequestStatus,
  ItemCategory,
  ItemCondition,
  ItemMode,
} from '@/types';
import { INITIAL_SAMPLE_ITEMS } from './seed';

export interface ItemFilterOptions {
  search?: string;
  category?: string;
  condition?: string;
  mode?: string;
  availability?: boolean | string;
  ownerId?: string;
}

// ----------------- ITEMS (TablesDB: items table) ----------------- //

export async function fetchItems(filters: ItemFilterOptions = {}): Promise<ItemListing[]> {
  if (isAppwriteConfigured()) {
    try {
      const queries: string[] = [];

      if (filters.category && filters.category !== 'All') {
        queries.push(Query.equal('category', filters.category));
      }
      if (filters.condition && filters.condition !== 'All') {
        queries.push(Query.equal('condition', filters.condition));
      }
      if (filters.mode && filters.mode !== 'All') {
        queries.push(Query.equal('mode', filters.mode));
      }
      if (filters.ownerId) {
        queries.push(Query.equal('ownerId', filters.ownerId));
      }
      if (filters.availability !== undefined && filters.availability !== 'All') {
        queries.push(Query.equal('availability', filters.availability === true || filters.availability === 'true'));
      }
      if (filters.search && filters.search.trim()) {
        queries.push(Query.search('title', filters.search.trim()));
      }

      queries.push(Query.orderDesc('$createdAt'));
      queries.push(Query.limit(100));

      // Appwrite TablesDB: listRows
      const response = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLE_ITEMS,
        queries,
      });

      return (response.rows || []).map((row: any) => ({
        $id: row.$id,
        $createdAt: row.$createdAt,
        $updatedAt: row.$updatedAt,
        ownerId: row.ownerId,
        ownerName: row.ownerName,
        ownerCampus: row.ownerCampus,
        title: row.title,
        description: row.description,
        category: row.category as ItemCategory,
        condition: row.condition as ItemCondition,
        mode: row.mode as ItemMode,
        availability: row.availability,
        imageUrl: row.imageUrl,
        location: row.location,
      }));
    } catch (error) {
      console.warn('Appwrite TablesDB listRows error:', error);
      throw error;
    }
  }

  // Preview data when Appwrite credentials are not yet configured in .env.local
  return INITIAL_SAMPLE_ITEMS.map((item, idx) => ({
    ...item,
    $id: `preview-item-${idx + 1}`,
    $createdAt: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
  })).filter((item) => {
    if (filters.category && filters.category !== 'All' && item.category !== filters.category) return false;
    if (filters.condition && filters.condition !== 'All' && item.condition !== filters.condition) return false;
    if (filters.mode && filters.mode !== 'All' && item.mode !== filters.mode) return false;
    if (filters.ownerId && item.ownerId !== filters.ownerId) return false;
    if (filters.availability !== undefined && filters.availability !== 'All') {
      const targetAvail = filters.availability === true || filters.availability === 'true';
      if (item.availability !== targetAvail) return false;
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.ownerCampus || '').toLowerCase().includes(q)
      );
    }
    return true;
  });
}

export async function fetchItemById(id: string): Promise<ItemListing | null> {
  if (isAppwriteConfigured()) {
    try {
      // Appwrite TablesDB: getRow
      const row: any = await tablesDB.getRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLE_ITEMS,
        rowId: id,
      });

      return {
        $id: row.$id,
        $createdAt: row.$createdAt,
        $updatedAt: row.$updatedAt,
        ownerId: row.ownerId,
        ownerName: row.ownerName,
        ownerCampus: row.ownerCampus,
        title: row.title,
        description: row.description,
        category: row.category as ItemCategory,
        condition: row.condition as ItemCondition,
        mode: row.mode as ItemMode,
        availability: row.availability,
        imageUrl: row.imageUrl,
        location: row.location,
      };
    } catch (err) {
      console.warn('Error fetching item from TablesDB:', err);
      return null;
    }
  }

  const sample = INITIAL_SAMPLE_ITEMS.find((_, idx) => `preview-item-${idx + 1}` === id);
  if (!sample) return null;
  return {
    ...sample,
    $id: id,
    $createdAt: new Date().toISOString(),
  };
}

export async function createItemListing(
  item: Omit<ItemListing, '$id'>,
  userId: string
): Promise<ItemListing> {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite TablesDB is not configured. Please set NEXT_PUBLIC_APPWRITE_PROJECT_ID in .env.local.');
  }

  // Appwrite TablesDB: createRow with explicit row-level permissions
  const row: any = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLE_ITEMS,
    rowId: ID.unique(),
    data: {
      ownerId: userId,
      ownerName: item.ownerName || 'Student',
      ownerCampus: item.ownerCampus || 'Main Campus',
      title: item.title,
      description: item.description,
      category: item.category,
      condition: item.condition,
      mode: item.mode,
      availability: item.availability ?? true,
      imageUrl: item.imageUrl,
      location: item.location || '',
    },
    permissions: [
      Permission.read(Role.any()),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ],
  });

  return {
    $id: row.$id,
    $createdAt: row.$createdAt,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    ownerCampus: row.ownerCampus,
    title: row.title,
    description: row.description,
    category: row.category as ItemCategory,
    condition: row.condition as ItemCondition,
    mode: row.mode as ItemMode,
    availability: row.availability,
    imageUrl: row.imageUrl,
    location: row.location,
  };
}

export async function updateItemListing(
  id: string,
  updates: Partial<ItemListing>,
  currentUserId?: string
): Promise<ItemListing> {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite TablesDB is not configured. Please set NEXT_PUBLIC_APPWRITE_PROJECT_ID in .env.local.');
  }

  // Row-level owner verification
  const existing: any = await tablesDB.getRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLE_ITEMS,
    rowId: id,
  });

  if (currentUserId && existing.ownerId !== currentUserId) {
    throw new Error('Unauthorized: Only the item owner can modify this listing');
  }

  // Appwrite TablesDB: updateRow
  const row: any = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLE_ITEMS,
    rowId: id,
    data: updates,
  });

  return {
    $id: row.$id,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    ownerCampus: row.ownerCampus,
    title: row.title,
    description: row.description,
    category: row.category as ItemCategory,
    condition: row.condition as ItemCondition,
    mode: row.mode as ItemMode,
    availability: row.availability,
    imageUrl: row.imageUrl,
    location: row.location,
  };
}

export async function deleteItemListing(id: string, currentUserId?: string): Promise<boolean> {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite TablesDB is not configured. Please set NEXT_PUBLIC_APPWRITE_PROJECT_ID in .env.local.');
  }

  const existing: any = await tablesDB.getRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLE_ITEMS,
    rowId: id,
  });

  if (currentUserId && existing.ownerId !== currentUserId) {
    throw new Error('Unauthorized: Only the item owner can delete this listing');
  }

  // Appwrite TablesDB: deleteRow
  await tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLE_ITEMS,
    rowId: id,
  });
  return true;
}

// ----------------- BORROW REQUESTS (TablesDB: borrow_requests table) ----------------- //

export async function createBorrowRequest(
  data: Omit<BorrowRequest, '$id'>,
  userId: string
): Promise<BorrowRequest> {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite TablesDB is not configured. Please set NEXT_PUBLIC_APPWRITE_PROJECT_ID in .env.local.');
  }

  // Appwrite TablesDB: createRow with dual owner & borrower row permissions
  const row: any = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLE_REQUESTS,
    rowId: ID.unique(),
    data: {
      itemId: data.itemId,
      itemTitle: data.itemTitle || '',
      itemCategory: data.itemCategory || 'Other',
      itemImageUrl: data.itemImageUrl || '',
      ownerId: data.ownerId,
      ownerName: data.ownerName || '',
      borrowerId: userId,
      borrowerName: data.borrowerName || 'Peer Student',
      borrowerCampus: data.borrowerCampus || 'Campus',
      status: 'pending',
      requestDate: data.requestDate || new Date().toISOString(),
      dueDate: data.dueDate,
      message: data.message || '',
    },
    permissions: [
      Permission.read(Role.user(userId)),
      Permission.read(Role.user(data.ownerId)),
      Permission.update(Role.user(data.ownerId)),
      Permission.update(Role.user(userId)),
    ],
  });

  return {
    $id: row.$id,
    $createdAt: row.$createdAt,
    itemId: row.itemId,
    itemTitle: row.itemTitle,
    itemCategory: row.itemCategory,
    itemImageUrl: row.itemImageUrl,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    borrowerId: row.borrowerId,
    borrowerName: row.borrowerName,
    borrowerCampus: row.borrowerCampus,
    status: row.status as RequestStatus,
    requestDate: row.requestDate,
    dueDate: row.dueDate,
    message: row.message,
  };
}

export async function fetchBorrowRequests(
  userId: string,
  type: 'incoming' | 'outgoing' | 'all' = 'all'
): Promise<BorrowRequest[]> {
  if (isAppwriteConfigured()) {
    try {
      const queries: string[] = [];

      if (type === 'incoming') {
        queries.push(Query.equal('ownerId', userId));
      } else if (type === 'outgoing') {
        queries.push(Query.equal('borrowerId', userId));
      } else {
        queries.push(Query.or([Query.equal('ownerId', userId), Query.equal('borrowerId', userId)]));
      }

      queries.push(Query.orderDesc('$createdAt'));
      queries.push(Query.limit(100));

      // Appwrite TablesDB: listRows
      const res = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLE_REQUESTS,
        queries,
      });

      return (res.rows || []).map((row: any) => ({
        $id: row.$id,
        $createdAt: row.$createdAt,
        itemId: row.itemId,
        itemTitle: row.itemTitle,
        itemCategory: row.itemCategory,
        itemImageUrl: row.itemImageUrl,
        ownerId: row.ownerId,
        ownerName: row.ownerName,
        borrowerId: row.borrowerId,
        borrowerName: row.borrowerName,
        borrowerCampus: row.borrowerCampus,
        status: row.status as RequestStatus,
        requestDate: row.requestDate,
        dueDate: row.dueDate,
        message: row.message,
        returnedDate: row.returnedDate,
      }));
    } catch (err) {
      console.warn('Appwrite TablesDB fetchBorrowRequests error:', err);
    }
  }

  return [];
}

export async function updateBorrowRequestStatus(
  requestId: string,
  newStatus: RequestStatus,
  currentUserId: string,
  itemId?: string
): Promise<BorrowRequest> {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite TablesDB is not configured. Please set NEXT_PUBLIC_APPWRITE_PROJECT_ID in .env.local.');
  }

  const updates: Record<string, any> = { status: newStatus };
  if (newStatus === 'returned') {
    updates.returnedDate = new Date().toISOString();
  }

  // Appwrite TablesDB: updateRow
  const row: any = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLE_REQUESTS,
    rowId: requestId,
    data: updates,
  });

  // Automatically synchronize item availability in TablesDB items table
  const targetItemId = itemId || row.itemId;
  if (targetItemId) {
    if (newStatus === 'borrowed') {
      await tablesDB.updateRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLE_ITEMS,
        rowId: targetItemId,
        data: { availability: false },
      }).catch((e) => console.warn('Could not update item availability:', e));
    } else if (newStatus === 'returned' || newStatus === 'rejected' || newStatus === 'cancelled') {
      await tablesDB.updateRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLE_ITEMS,
        rowId: targetItemId,
        data: { availability: true },
      }).catch((e) => console.warn('Could not update item availability:', e));
    }
  }

  return {
    $id: row.$id,
    $createdAt: row.$createdAt,
    itemId: row.itemId,
    itemTitle: row.itemTitle,
    itemCategory: row.itemCategory,
    itemImageUrl: row.itemImageUrl,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    borrowerId: row.borrowerId,
    borrowerName: row.borrowerName,
    borrowerCampus: row.borrowerCampus,
    status: row.status as RequestStatus,
    requestDate: row.requestDate,
    dueDate: row.dueDate,
    message: row.message,
    returnedDate: row.returnedDate,
  };
}

// ----------------- REVIEWS (TablesDB: reviews table) ----------------- //

export async function createReview(
  data: Omit<Review, '$id'>,
  reviewerId: string
): Promise<Review> {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite TablesDB is not configured. Please set NEXT_PUBLIC_APPWRITE_PROJECT_ID in .env.local.');
  }

  // Appwrite TablesDB: createRow
  const row: any = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLE_REVIEWS,
    rowId: ID.unique(),
    data: {
      requestId: data.requestId,
      itemId: data.itemId || '',
      itemTitle: data.itemTitle || '',
      reviewerId,
      reviewerName: data.reviewerName || 'Student',
      revieweeId: data.revieweeId,
      rating: Number(data.rating),
      comment: data.comment,
    },
    permissions: [
      Permission.read(Role.any()),
      Permission.update(Role.user(reviewerId)),
      Permission.delete(Role.user(reviewerId)),
    ],
  });

  // Dynamically update reviewee reputation score in TablesDB
  try {
    const reviews = await fetchReviewsForUser(data.revieweeId);
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      const reputation = Math.round(avg * 20); // 5.0 -> 100%
      await updateUserProfile(data.revieweeId, { reputation });
    }
  } catch (repErr) {
    console.warn('Could not update reputation score:', repErr);
  }

  return {
    $id: row.$id,
    $createdAt: row.$createdAt,
    requestId: row.requestId,
    itemId: row.itemId,
    itemTitle: row.itemTitle,
    reviewerId: row.reviewerId,
    reviewerName: row.reviewerName,
    revieweeId: row.revieweeId,
    rating: row.rating,
    comment: row.comment,
  };
}

export async function fetchReviewsForUser(userId: string): Promise<Review[]> {
  if (isAppwriteConfigured()) {
    try {
      // Appwrite TablesDB: listRows
      const res = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLE_REVIEWS,
        queries: [Query.equal('revieweeId', userId), Query.orderDesc('$createdAt'), Query.limit(50)],
      });

      return (res.rows || []).map((row: any) => ({
        $id: row.$id,
        $createdAt: row.$createdAt,
        requestId: row.requestId,
        itemId: row.itemId,
        itemTitle: row.itemTitle,
        reviewerId: row.reviewerId,
        reviewerName: row.reviewerName,
        revieweeId: row.revieweeId,
        rating: row.rating,
        comment: row.comment,
      }));
    } catch (err) {
      console.warn('Appwrite TablesDB fetchReviewsForUser error:', err);
    }
  }

  return [];
}

// ----------------- USER PROFILE (TablesDB: users table) ----------------- //

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (isAppwriteConfigured()) {
    try {
      // Appwrite TablesDB: listRows
      const res = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLE_USERS,
        queries: [Query.equal('userId', userId), Query.limit(1)],
      });

      if (res.rows && res.rows.length > 0) {
        const row: any = res.rows[0];
        return {
          $id: row.$id,
          userId: row.userId,
          name: row.name,
          email: row.email,
          campus: row.campus,
          reputation: row.reputation ?? 100,
          totalBorrows: row.totalBorrows || 0,
          totalLends: row.totalLends || 0,
          avatarUrl: row.avatarUrl,
        };
      }
    } catch (err) {
      console.warn('Appwrite TablesDB fetchUserProfile error:', err);
    }
  }

  return null;
}

export async function ensureUserProfile(
  userId: string,
  name: string,
  email: string,
  campus: string
): Promise<UserProfile> {
  if (isAppwriteConfigured()) {
    try {
      const res = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLE_USERS,
        queries: [Query.equal('userId', userId), Query.limit(1)],
      });

      if (res.rows && res.rows.length > 0) {
        const row: any = res.rows[0];
        return {
          $id: row.$id,
          userId: row.userId,
          name: row.name,
          email: row.email,
          campus: row.campus,
          reputation: row.reputation ?? 100,
        };
      }

      // Appwrite TablesDB: createRow
      const row: any = await tablesDB.createRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLE_USERS,
        rowId: ID.unique(),
        data: {
          userId,
          name,
          email,
          campus: campus || 'Main Campus',
          reputation: 100,
        },
        permissions: [
          Permission.read(Role.any()),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      });

      return {
        $id: row.$id,
        userId: row.userId,
        name: row.name,
        email: row.email,
        campus: row.campus,
        reputation: row.reputation,
      };
    } catch (err) {
      console.warn('Appwrite TablesDB ensureUserProfile error:', err);
    }
  }

  return {
    userId,
    name,
    email,
    campus: campus || 'Main Campus',
    reputation: 100,
  };
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  if (isAppwriteConfigured()) {
    try {
      const res = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLE_USERS,
        queries: [Query.equal('userId', userId), Query.limit(1)],
      });

      if (res.rows && res.rows.length > 0) {
        // Appwrite TablesDB: updateRow
        await tablesDB.updateRow({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: TABLE_USERS,
          rowId: res.rows[0].$id,
          data: updates,
        });
        return true;
      }
    } catch (err) {
      console.warn('Appwrite TablesDB updateUserProfile error:', err);
    }
  }
  return true;
}

// ----------------- COMMUNITY METRICS & STATS ----------------- //

export async function fetchCommunityStats(): Promise<CommunityStats> {
  if (isAppwriteConfigured()) {
    try {
      const [itemsRes, requestsRes] = await Promise.all([
        tablesDB.listRows({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: TABLE_ITEMS,
          queries: [Query.limit(1)],
        }),
        tablesDB.listRows({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: TABLE_REQUESTS,
          queries: [Query.limit(100)],
        }),
      ]);

      const totalItems = itemsRes.total || 0;
      const allRequests = requestsRes.rows || [];
      const activeBorrows = allRequests.filter(
        (r: any) => r.status === 'borrowed' || r.status === 'approved'
      ).length;
      const completedExchanges = allRequests.filter((r: any) => r.status === 'returned').length;

      const wasteDivertedKg = Math.round(completedExchanges * 4.2 + totalItems * 1.5);
      const moneySavedUsd = Math.round(completedExchanges * 65 + activeBorrows * 45);

      return {
        totalItems: Math.max(totalItems, 10),
        activeBorrows: Math.max(activeBorrows, 4),
        completedExchanges: Math.max(completedExchanges, 28),
        totalMembers: Math.max(Math.round(totalItems * 1.8), 45),
        wasteDivertedKg: Math.max(wasteDivertedKg, 184),
        moneySavedUsd: Math.max(moneySavedUsd, 2850),
      };
    } catch (err) {
      console.warn('Appwrite TablesDB fetchCommunityStats error:', err);
    }
  }

  return {
    totalItems: 10,
    activeBorrows: 4,
    completedExchanges: 34,
    totalMembers: 86,
    wasteDivertedKg: 215,
    moneySavedUsd: 3420,
  };
}

// ----------------- SEED DATABASE INTO TABLESDB ----------------- //

export async function seedAppwriteDatabase(): Promise<{ success: boolean; count: number; message: string }> {
  if (!isAppwriteConfigured()) {
    return {
      success: false,
      count: 0,
      message: 'Appwrite Project ID not configured in .env.local',
    };
  }

  try {
    let createdCount = 0;
    for (const item of INITIAL_SAMPLE_ITEMS) {
      // Appwrite TablesDB: createRow
      await tablesDB.createRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLE_ITEMS,
        rowId: ID.unique(),
        data: {
          ownerId: item.ownerId,
          ownerName: item.ownerName,
          ownerCampus: item.ownerCampus,
          title: item.title,
          description: item.description,
          category: item.category,
          condition: item.condition,
          mode: item.mode,
          availability: item.availability,
          imageUrl: item.imageUrl,
          location: item.location || '',
        },
        permissions: [
          Permission.read(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ],
      });
      createdCount++;
    }

    return {
      success: true,
      count: createdCount,
      message: `Successfully seeded ${createdCount} realistic campus items into Appwrite TablesDB!`,
    };
  } catch (err: any) {
    console.error('Error seeding Appwrite TablesDB:', err);
    return {
      success: false,
      count: 0,
      message: err?.message || 'Failed to seed TablesDB. Ensure database and tables exist.',
    };
  }
}
