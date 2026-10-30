export type ItemCategory =
  | 'Textbooks & Notes'
  | 'Electronics & Calculators'
  | 'Lab & Science Gear'
  | 'Tools & Hardware'
  | 'Dorm & Daily Living'
  | 'Other';

export type ItemCondition = 'New' | 'Like New' | 'Good' | 'Fair';

export type ItemMode = 'Borrow' | 'Exchange' | 'Free Giveaway';

export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'borrowed'
  | 'returned'
  | 'rejected'
  | 'cancelled';

export interface UserProfile {
  $id?: string;
  userId: string;
  name: string;
  email: string;
  campus: string;
  reputation: number; // e.g. 98% or average 1-5 rating * 20
  totalBorrows?: number;
  totalLends?: number;
  avatarUrl?: string;
  createdAt?: string;
}

export interface ItemListing {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  ownerId: string;
  ownerName?: string;
  ownerCampus?: string;
  title: string;
  description: string;
  category: ItemCategory;
  condition: ItemCondition;
  mode: ItemMode;
  availability: boolean;
  imageUrl: string;
  location?: string;
}

export interface BorrowRequest {
  $id: string;
  $createdAt?: string;
  itemId: string;
  itemTitle?: string;
  itemCategory?: ItemCategory;
  itemImageUrl?: string;
  ownerId: string;
  ownerName?: string;
  borrowerId: string;
  borrowerName?: string;
  borrowerCampus?: string;
  status: RequestStatus;
  requestDate: string;
  dueDate: string;
  message?: string;
  returnedDate?: string;
}

export interface Review {
  $id: string;
  $createdAt?: string;
  requestId: string;
  itemId?: string;
  itemTitle?: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  rating: number; // 1-5
  comment: string;
}

export interface CommunityStats {
  totalItems: number;
  activeBorrows: number;
  completedExchanges: number;
  totalMembers: number;
  wasteDivertedKg: number;
  moneySavedUsd: number;
}

