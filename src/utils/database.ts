import { createClient } from '@/lib/supabase/client';
import { TABLES } from './constants';
import type { 
  AuctionItem, 
  MembershipItem, 
  SpentItem, 
  DonationItem, 
  DuesItem,
  ApiResponse 
} from '@/types';

const supabase = createClient();

// Generic CRUD operations
export class DatabaseService<T extends { id: string; user_id: string }> {
  constructor(private tableName: string) {}

  async getAll(userId: string): Promise<ApiResponse<T[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data as T[], error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  async create(item: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return { data: data as T, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  async update(id: string, updates: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as T, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }
}

// Specific service instances
export const auctionService = new DatabaseService<AuctionItem>(TABLES.AUCTION_ITEMS);
export const membershipService = new DatabaseService<MembershipItem>(TABLES.MEMBERSHIP_ITEMS);
export const expensesService = new DatabaseService<SpentItem>(TABLES.SPENT_ITEMS);
export const donationsService = new DatabaseService<DonationItem>(TABLES.DONATION_ITEMS);
export const duesService = new DatabaseService<DuesItem>(TABLES.DUES_ITEMS);

// Analytics helper functions
export const calculateTotals = (items: Array<{ amount: number; paid: number }>) => {
  return items.reduce(
    (acc, item) => ({
      totalAmount: acc.totalAmount + item.amount,
      totalPaid: acc.totalPaid + item.paid,
      totalDue: acc.totalDue + (item.amount - item.paid)
    }),
    { totalAmount: 0, totalPaid: 0, totalDue: 0 }
  );
};
