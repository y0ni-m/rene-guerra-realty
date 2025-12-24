import { supabaseAdmin } from "./client";
import { sparkClient, ResoProperty } from "../mls/client";
import { ListingInsert } from "./types";

const RENE_AGENT_KEY = process.env.RENE_AGENT_KEY;
const BROKERAGE_NAME = "Partnership";

interface SyncResult {
  success: boolean;
  listingsSynced: number;
  photosSynced: number;
  error?: string;
}

/**
 * Generates a URL-friendly slug from listing data
 */
function generateSlug(listing: ResoProperty): string {
  const parts: string[] = [];

  if (listing.PropertyType) {
    parts.push(listing.PropertyType.toLowerCase().replace(/\s+/g, "-"));
  }

  if (listing.StreetName) {
    parts.push(listing.StreetName.toLowerCase().replace(/\s+/g, "-"));
  }

  if (listing.City) {
    parts.push(listing.City.toLowerCase().replace(/\s+/g, "-"));
  }

  parts.push(listing.ListingId || listing.ListingKey);

  return parts.join("-").replace(/[^a-z0-9-]/g, "");
}

/**
 * Formats price as currency string
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats square footage
 */
function formatSqft(sqft: number | undefined): string {
  if (!sqft) return "N/A";
  return new Intl.NumberFormat("en-US").format(sqft);
}

/**
 * Formats lot size
 */
function formatLotSize(acres?: number, sqft?: number): string {
  if (acres && acres > 0) {
    return `${acres.toFixed(2)} acres`;
  }
  if (sqft && sqft > 0) {
    if (sqft > 43560) {
      return `${(sqft / 43560).toFixed(2)} acres`;
    }
    return `${new Intl.NumberFormat("en-US").format(sqft)} sq ft`;
  }
  return "N/A";
}

/**
 * Maps MLS status
 */
function mapStatus(mlsStatus: string): string {
  const status = mlsStatus.toLowerCase();
  if (status.includes("pending") || status.includes("under contract")) {
    return "Pending";
  }
  if (status.includes("sold") || status.includes("closed")) {
    return "Sold";
  }
  return "For Sale";
}

/**
 * Maps property type
 */
function mapPropertyType(propertyType: string, subType?: string): string {
  const type = propertyType.toLowerCase();
  const sub = subType?.toLowerCase() || "";

  if (type.includes("condo") || sub.includes("condo")) return "Condo";
  if (type.includes("townhouse") || sub.includes("townhouse") || sub.includes("townhome")) return "Townhouse";
  if (sub.includes("villa")) return "Villa";
  if (type.includes("residential") || type.includes("single")) return "Single Family";

  return "Single Family";
}

/**
 * Builds address from components
 */
function buildAddress(listing: ResoProperty): string {
  if (listing.UnparsedAddress) {
    return listing.UnparsedAddress;
  }

  const parts: string[] = [];
  if (listing.StreetNumber) parts.push(listing.StreetNumber);
  if (listing.StreetDirPrefix) parts.push(listing.StreetDirPrefix);
  if (listing.StreetName) parts.push(listing.StreetName);
  if (listing.StreetSuffix) parts.push(listing.StreetSuffix);
  if (listing.StreetDirSuffix) parts.push(listing.StreetDirSuffix);

  return parts.join(" ") || "Address on Request";
}

/**
 * Creates title from address
 */
function createTitle(listing: ResoProperty): string {
  const address = buildAddress(listing);
  return address.split(",")[0] || "Beautiful Home";
}

/**
 * Collects features from listing
 */
function collectFeatures(listing: ResoProperty): string[] {
  const features: string[] = [];

  if (listing.WaterfrontYN) features.push("Waterfront");
  if (listing.PoolPrivateYN) features.push("Pool");
  if (listing.InteriorFeatures) features.push(...listing.InteriorFeatures.slice(0, 4));
  if (listing.ExteriorFeatures) features.push(...listing.ExteriorFeatures.slice(0, 3));
  if (listing.PoolFeatures?.length) features.push(...listing.PoolFeatures.slice(0, 2));
  if (listing.View) features.push(...listing.View.slice(0, 2));

  return [...new Set(features)].slice(0, 12);
}

/**
 * Formats parking info
 */
function formatParking(garageSpaces?: number, totalSpaces?: number): string {
  if (garageSpaces && garageSpaces > 0) return `${garageSpaces}-car garage`;
  if (totalSpaces && totalSpaces > 0) return `${totalSpaces} parking spaces`;
  return "Parking available";
}

/**
 * Transform MLS listing to database format
 */
function transformToDbListing(
  listing: ResoProperty,
  photos: string[],
  isAgentListing: boolean,
  isBrokerageListing: boolean
): ListingInsert {
  const bathrooms = listing.BathroomsTotalInteger ||
    (listing.BathroomsFull || 0) + (listing.BathroomsHalf || 0) * 0.5;

  return {
    listing_key: listing.ListingKey,
    listing_id: listing.ListingId,
    slug: generateSlug(listing),
    title: createTitle(listing),
    address: buildAddress(listing),
    city: listing.City || "Palm Beach County",
    state: listing.StateOrProvince || "FL",
    zip: listing.PostalCode || "",
    price: formatPrice(listing.ListPrice),
    price_number: listing.ListPrice,
    beds: Math.floor(listing.BedroomsTotal || 0),
    baths: bathrooms,
    sqft: formatSqft(listing.LivingArea || listing.BuildingAreaTotal),
    sqft_number: Math.floor(listing.LivingArea || listing.BuildingAreaTotal || 0),
    property_type: mapPropertyType(listing.PropertyType, listing.PropertySubType),
    status: mapStatus(listing.StandardStatus),
    year_built: Math.floor(listing.YearBuilt || new Date().getFullYear()),
    lot_size: formatLotSize(listing.LotSizeAcres, listing.LotSizeSquareFeet),
    parking: formatParking(listing.GarageSpaces, listing.ParkingTotal),
    description: listing.PublicRemarks || "Contact agent for more details.",
    features: collectFeatures(listing),
    images: photos,
    mls_number: listing.ListingId || listing.ListingKey,
    listed_date: listing.OnMarketDate || listing.ListingContractDate || new Date().toISOString().split("T")[0],
    agent_id: listing.ListAgentMlsId || null,
    office_name: listing.ListOfficeName || null,
    is_agent_listing: isAgentListing,
    is_brokerage_listing: isBrokerageListing,
    latitude: listing.Latitude || null,
    longitude: listing.Longitude || null,
    synced_at: new Date().toISOString(),
  };
}

/**
 * Fetch photos for a listing with retries
 */
async function fetchPhotosWithRetry(listingKey: string, maxRetries = 3): Promise<string[]> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const photos = await sparkClient.getPhotos(listingKey);
      const urls = photos
        .filter(p => p.MediaURL && !p.rateLimited)
        .map(p => p.MediaURL)
        .slice(0, 6);

      if (urls.length > 0 || !photos.some(p => p.rateLimited)) {
        return urls;
      }

      // Rate limited, wait before retry
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    } catch (error) {
      console.error(`[Sync] Photo fetch error for ${listingKey}:`, error);
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  return [];
}

/**
 * Main sync function - fetches all listings from MLS and syncs to Supabase
 */
export async function syncMlsToSupabase(): Promise<SyncResult> {
  console.log("[Sync] Starting MLS sync...");

  if (!supabaseAdmin) {
    return {
      success: false,
      listingsSynced: 0,
      photosSynced: 0,
      error: "Supabase not configured",
    };
  }

  // Create sync log entry
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: syncLog, error: logError } = await (supabaseAdmin as any)
    .from("sync_log")
    .insert({ status: "running", listings_synced: 0, photos_synced: 0 })
    .select()
    .single();

  if (logError) {
    console.error("[Sync] Failed to create sync log:", logError);
  }

  const syncId = syncLog?.id;
  let listingsSynced = 0;
  let photosSynced = 0;

  try {
    // Fetch agent listings using ListAgentKey (reliable filter)
    console.log("[Sync] Fetching agent listings...");
    const agentListings: ResoProperty[] = [];
    if (RENE_AGENT_KEY) {
      const agentResponse = await sparkClient.getAgentListings(RENE_AGENT_KEY);
      if (agentResponse.value) {
        agentListings.push(...agentResponse.value);
      }
    }
    console.log(`[Sync] Found ${agentListings.length} agent listings`);

    // Fetch brokerage listings (Partnership Realty)
    console.log("[Sync] Fetching brokerage listings (this may take a minute)...");
    const brokerageResponse = await sparkClient.getOfficeListings(BROKERAGE_NAME);
    const brokerageListings = brokerageResponse.value || [];
    console.log(`[Sync] Found ${brokerageListings.length} brokerage listings`);

    // Combine Rene's listings and brokerage listings (no general MLS)
    const agentIds = new Set(agentListings.map(l => l.ListingKey));

    const allListings = [
      ...agentListings,
      ...brokerageListings.filter(l => !agentIds.has(l.ListingKey)),
    ];

    console.log(`[Sync] Processing ${allListings.length} unique listings...`);

    // Process listings in batches
    const BATCH_SIZE = 5;
    const dbListings: ListingInsert[] = [];

    for (let i = 0; i < allListings.length; i += BATCH_SIZE) {
      const batch = allListings.slice(i, i + BATCH_SIZE);

      // Fetch photos for batch
      const photoResults = await Promise.all(
        batch.map(async (listing) => {
          const photos = await fetchPhotosWithRetry(listing.ListingKey);
          return { listingKey: listing.ListingKey, photos };
        })
      );

      const photoMap = new Map(photoResults.map(r => [r.listingKey, r.photos]));

      // Transform listings
      for (const listing of batch) {
        const photos = photoMap.get(listing.ListingKey) || [];
        const isAgent = agentIds.has(listing.ListingKey);
        // If not agent listing, it's a brokerage listing (Partnership Realty)
        const isBrokerage = !isAgent;

        dbListings.push(transformToDbListing(listing, photos, isAgent, isBrokerage));

        if (photos.length > 0) {
          photosSynced += photos.length;
        }
      }

      console.log(`[Sync] Processed ${Math.min(i + BATCH_SIZE, allListings.length)}/${allListings.length} listings`);

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Deduplicate by listing_key (keep first occurrence, which prioritizes agent listings)
    const uniqueListings = Array.from(
      new Map(dbListings.map(l => [l.listing_key, l])).values()
    );

    // Upsert to Supabase
    console.log(`[Sync] Upserting ${uniqueListings.length} unique listings to Supabase...`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: upsertError } = await (supabaseAdmin as any)
      .from("listings")
      .upsert(uniqueListings, { onConflict: "listing_key" });

    if (upsertError) {
      throw new Error(`Upsert failed: ${upsertError.message}`);
    }

    listingsSynced = uniqueListings.length;

    // Update sync log
    if (syncId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseAdmin as any)
        .from("sync_log")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          listings_synced: listingsSynced,
          photos_synced: photosSynced,
        })
        .eq("id", syncId);
    }

    console.log(`[Sync] Completed! Synced ${listingsSynced} listings, ${photosSynced} photos`);

    return {
      success: true,
      listingsSynced,
      photosSynced,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Sync] Failed:", errorMessage);

    // Update sync log with error
    if (syncId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseAdmin as any)
        .from("sync_log")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
          error_message: errorMessage,
        })
        .eq("id", syncId);
    }

    return {
      success: false,
      listingsSynced,
      photosSynced,
      error: errorMessage,
    };
  }
}

/**
 * Get last sync status
 */
export async function getLastSyncStatus() {
  if (!supabaseAdmin) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabaseAdmin as any)
    .from("sync_log")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  return data;
}
