// Database Types
export interface BaseItem {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuctionItem extends BaseItem {
  name: string;
  item: string;
  amount: number;
  paid: number;
  due: number;
  comment: string;
}

export interface MembershipItem extends BaseItem {
  name: string;
  amount: number;
  due: number;
  comment: string;
  paid: number;
}

export interface SpentItem extends BaseItem {
  item: string;
  amount: number;
  paid: number;
  due: number;
  comment: string;
}

export interface DonationItem extends BaseItem {
  name: string;
  amount: number;
  paid: number;
  due: number;
  comment: string;
}

export interface DuesItem extends BaseItem {
  name: string;
  amount: number;
  paid: number;
  due: number;
  comment: string;
}

// Form Types
export interface ItemFormData {
  name?: string;
  item?: string;
  amount: number;
  paid: number;
  comment: string;
}

// Component Props Types
export interface TabContentProps {
  activeTab: string;
}

export interface DataTableProps<T> {
  items: T[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Utility Types
export type TabType = 'auction' | 'membership' | 'expenses' | 'donations' | 'dues' | 'analytics';
