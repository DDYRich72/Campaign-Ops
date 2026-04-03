// Database row types (snake_case matching Supabase column names)

export type CampaignStatusDB = 'draft' | 'active' | 'paused' | 'completed';

export interface CampaignRow {
  id: string;
  clerk_user_id: string;
  name: string;
  business_name: string | null;
  industry: string | null;
  target_audience: string | null;
  geographic_market: string | null;
  offer: string | null;
  goal: string | null;
  channels: string[];
  brand_voice: string | null;
  primary_cta: string | null;
  audience_pain_points: string | null;
  unique_selling_points: string | null;
  status: CampaignStatusDB;
  asset_count: number;
  days_remaining: number | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessProfileRow {
  id: string;
  clerk_user_id: string;
  business_name: string | null;
  industry: string | null;
  default_brand_voice: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

type CampaignInsert = Omit<CampaignRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

type BusinessProfileInsert = Omit<BusinessProfileRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: CampaignRow;
        Insert: CampaignInsert;
        Update: Partial<Omit<CampaignRow, 'id' | 'clerk_user_id'>>;
        Relationships: [];
      };
      business_profiles: {
        Row: BusinessProfileRow;
        Insert: BusinessProfileInsert;
        Update: Partial<Omit<BusinessProfileRow, 'id' | 'clerk_user_id'>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
