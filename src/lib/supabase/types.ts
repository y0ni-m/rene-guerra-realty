export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string;
          listing_key: string;
          listing_id: string;
          slug: string;
          title: string;
          address: string;
          city: string;
          state: string;
          zip: string;
          price: string;
          price_number: number;
          beds: number;
          baths: number;
          sqft: string;
          sqft_number: number;
          property_type: string;
          status: string;
          year_built: number;
          lot_size: string;
          parking: string;
          description: string;
          features: string[];
          images: string[];
          mls_number: string;
          listed_date: string;
          agent_id: string | null;
          office_name: string | null;
          is_agent_listing: boolean;
          is_brokerage_listing: boolean;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
          synced_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["listings"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["listings"]["Insert"]>;
      };
      sync_log: {
        Row: {
          id: number;
          started_at: string;
          completed_at: string | null;
          status: "running" | "completed" | "failed";
          listings_synced: number;
          photos_synced: number;
          error_message: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["sync_log"]["Row"], "id" | "started_at" | "completed_at" | "error_message">;
        Update: Partial<Database["public"]["Tables"]["sync_log"]["Row"]>;
      };
      translations: {
        Row: {
          id: number;
          source_text: string;
          source_lang: string;
          target_lang: string;
          translated_text: string;
          created_at: string;
        };
        Insert: {
          source_text: string;
          source_lang: string;
          target_lang: string;
          translated_text: string;
        };
        Update: {
          source_text?: string;
          source_lang?: string;
          target_lang?: string;
          translated_text?: string;
        };
      };
    };
  };
}

export type Listing = Database["public"]["Tables"]["listings"]["Row"];
export type ListingInsert = Database["public"]["Tables"]["listings"]["Insert"];
export type SyncLog = Database["public"]["Tables"]["sync_log"]["Row"];
