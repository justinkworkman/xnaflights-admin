// import { db } from "./db";
import { deals, type Deal, type InsertDeal } from "@shared/schema";
// import { eq } from "drizzle-orm";
import {createClient} from '@supabase/supabase-js';

export interface IStorage {
  getDeals(): Promise<Deal[]>;
  getDeal(id: number): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: number, deal: Partial<InsertDeal>): Promise<Deal>;
  deleteDeal(id: number): Promise<void>;
}

export class SupabaseStorage implements IStorage {
  private client;

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL and Anon Key must be set in environment variables.");
    }
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  async getDeals(search?: string): Promise<Deal[]> {
    let query = this.client.from('deals').select('*');
    if (search) {
      query = query.ilike('destination', `%${search}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as Deal[];
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    const { data, error } = await this.client.from('deals').select('*').eq('id', id).limit(1);
    if (error) throw error;
    return data[0] as Deal | undefined;
  }

  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const { data, error } = await this.client.from('deals').insert(insertDeal).select('*');
    if (error) throw error;
    return data[0] as Deal;
  }

  async updateDeal(id: number, updates: Partial<InsertDeal>): Promise<Deal> {
    console.log("Updating deal:", id, updates);
    const { data, error } = await this.client.from('deals').update(updates).eq('id', id).select('*');
    if (error) throw error;
    const updatedDeal = data[0] as Deal;
    return updatedDeal;
  }

  async deleteDeal(id: number): Promise<void> {
    await this.client.from('deals').delete().eq('id', id);
  }
}

export const storage = new SupabaseStorage();
