import { ListingSearchParams } from "./types";

const SPARK_API_URL = process.env.SPARK_API_URL || "https://replication.sparkapi.com";
const SPARK_ACCESS_TOKEN = process.env.SPARK_ACCESS_TOKEN;

// In-memory photo cache (persists within server process)
const photoCache = new Map<string, { urls: string[]; timestamp: number }>();
const PHOTO_CACHE_TTL = 30 * 60 * 1000; // 30 minutes (longer cache to reduce API calls)

function getCachedPhotos(listingKey: string): string[] | null {
  const cached = photoCache.get(listingKey);
  if (cached && Date.now() - cached.timestamp < PHOTO_CACHE_TTL) {
    return cached.urls;
  }
  return null;
}

function setCachedPhotos(listingKey: string, urls: string[]): void {
  photoCache.set(listingKey, { urls, timestamp: Date.now() });
}

// RESO OData response format
export interface ResoODataResponse {
  "@odata.context": string;
  "@odata.nextLink"?: string;
  value: ResoProperty[];
}

export interface ResoProperty {
  ListingKey: string;
  ListingId: string;
  StandardStatus: string;
  MlsStatus: string;
  PropertyType: string;
  PropertySubType?: string;
  UnparsedAddress?: string;
  StreetNumber?: string;
  StreetName?: string;
  StreetSuffix?: string;
  StreetDirPrefix?: string;
  StreetDirSuffix?: string;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  CountyOrParish?: string;
  Latitude?: number;
  Longitude?: number;
  ListPrice: number;
  OriginalListPrice?: number;
  ClosePrice?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  BathroomsTotalDecimal?: number;
  BathroomsFull?: number;
  BathroomsHalf?: number;
  LivingArea?: number;
  BuildingAreaTotal?: number;
  LotSizeAcres?: number;
  LotSizeSquareFeet?: number;
  LotSizeDimensions?: string;
  YearBuilt?: number;
  GarageSpaces?: number;
  ParkingTotal?: number;
  PublicRemarks?: string;
  ListAgentFullName?: string;
  ListAgentMlsId?: string;
  ListAgentEmail?: string;
  ListAgentDirectPhone?: string;
  ListOfficeName?: string;
  ListOfficeMlsId?: string;
  ListingContractDate?: string;
  OnMarketDate?: string;
  CloseDate?: string;
  ModificationTimestamp?: string;
  DaysOnMarket?: number;
  InteriorFeatures?: string[];
  ExteriorFeatures?: string[];
  Appliances?: string[];
  PoolFeatures?: string[];
  WaterfrontFeatures?: string[];
  WaterfrontYN?: boolean;
  PoolPrivateYN?: boolean;
  View?: string[];
  PhotosCount?: number;
  VirtualTours?: string;
}

class SparkApiClient {
  private baseUrl: string;
  private accessToken: string | undefined;
  private lastRequestTime: number = 0;
  private minRequestInterval: number = 400; // Minimum 400ms between requests

  constructor() {
    this.baseUrl = `${SPARK_API_URL}/Reso/OData`;
    this.accessToken = SPARK_ACCESS_TOKEN;
  }

  private async throttle(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Accept": "application/json",
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private buildFilterString(params: ListingSearchParams): string {
    const filters: string[] = [];

    // Status filter - default to Active
    if (!params.status) {
      filters.push(`StandardStatus eq 'Active'`);
    } else {
      filters.push(`StandardStatus eq '${params.status}'`);
    }

    if (params.city) {
      filters.push(`City eq '${params.city}'`);
    }

    if (params.minPrice !== undefined) {
      filters.push(`ListPrice ge ${params.minPrice}`);
    }

    if (params.maxPrice !== undefined) {
      filters.push(`ListPrice le ${params.maxPrice}`);
    }

    if (params.beds !== undefined) {
      filters.push(`BedroomsTotal ge ${params.beds}`);
    }

    if (params.baths !== undefined) {
      filters.push(`BathroomsTotalInteger ge ${params.baths}`);
    }

    if (params.propertyType) {
      filters.push(`PropertyType eq '${params.propertyType}'`);
    }

    if (params.agentKey) {
      filters.push(`ListAgentKey eq '${params.agentKey}'`);
    }

    return filters.join(" and ");
  }

  async getListings(params: ListingSearchParams = {}): Promise<ResoODataResponse> {
    const queryParams = new URLSearchParams();

    // Build filter string
    const filter = this.buildFilterString(params);
    if (filter) {
      queryParams.set("$filter", filter);
    }

    // Pagination
    if (params.limit) {
      queryParams.set("$top", params.limit.toString());
    } else {
      queryParams.set("$top", "20");
    }

    if (params.offset) {
      queryParams.set("$skip", params.offset.toString());
    }

    // Sorting - default to newest listings first
    if (params.sort) {
      queryParams.set("$orderby", params.sort);
    } else {
      queryParams.set("$orderby", "OnMarketDate desc");
    }

    // Select fields we need
    queryParams.set("$select", [
      "ListingKey", "ListingId", "StandardStatus", "MlsStatus",
      "PropertyType", "PropertySubType", "UnparsedAddress",
      "StreetNumber", "StreetName", "StreetSuffix", "StreetDirPrefix", "StreetDirSuffix",
      "City", "StateOrProvince", "PostalCode", "CountyOrParish",
      "Latitude", "Longitude", "ListPrice", "BedroomsTotal",
      "BathroomsTotalInteger", "BathroomsFull", "BathroomsHalf",
      "LivingArea", "BuildingAreaTotal", "LotSizeAcres", "LotSizeSquareFeet",
      "YearBuilt", "GarageSpaces", "ParkingTotal", "PublicRemarks",
      "ListAgentFullName", "ListAgentMlsId", "ListOfficeName",
      "ListingContractDate", "OnMarketDate", "DaysOnMarket",
      "InteriorFeatures", "ExteriorFeatures", "PoolFeatures",
      "WaterfrontFeatures", "WaterfrontYN", "PoolPrivateYN", "View", "PhotosCount"
    ].join(","));

    const url = `${this.baseUrl}/Property?${queryParams.toString()}`;

    try {
      await this.throttle();
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
        next: { revalidate: 900 }, // Cache for 15 minutes
      });

      if (response.status === 429) {
        console.warn("[MLS] Rate limited, will use cached/fallback data");
        return { "@odata.context": "", value: [] };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[MLS] Spark API error:", response.status, errorText);
        throw new Error(`Spark API error: ${response.status}`);
      }

      const data = await response.json();
      return data as ResoODataResponse;
    } catch (error) {
      console.error("[MLS] Failed to fetch listings from Spark API:", error);
      throw error;
    }
  }

  async getListingById(listingId: string): Promise<ResoProperty | null> {
    // Try to find by ListingId (MLS number) using filter
    const queryParams = new URLSearchParams();
    queryParams.set("$filter", `ListingId eq '${listingId}'`);
    queryParams.set("$top", "1");

    const url = `${this.baseUrl}/Property?${queryParams.toString()}`;

    try {
      await this.throttle();
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
        next: { revalidate: 900 },
      });

      if (response.status === 429) {
        console.warn(`[MLS] Rate limited fetching listing ${listingId}`);
        return null;
      }

      if (!response.ok) {
        console.error(`[MLS] API error fetching listing ${listingId}: ${response.status}`);
        return null;
      }

      const data = await response.json();
      if (data.value && data.value.length > 0) {
        return data.value[0] as ResoProperty;
      }
      return null;
    } catch (error) {
      console.error(`[MLS] Failed to fetch listing ${listingId}:`, error);
      return null;
    }
  }

  async getAgentListings(agentKey: string): Promise<ResoODataResponse> {
    // Use ListAgentKey filter - this works reliably (unlike ListAgentMlsId)
    console.log(`[MLS] Fetching listings for agent key: ${agentKey}`);
    const result = await this.getListings({ agentKey, limit: 50 });
    console.log(`[MLS] Found ${result.value?.length || 0} agent listings`);
    return result;
  }

  async getOfficeListings(officeName: string): Promise<ResoODataResponse> {
    // Scan through ALL listings and filter client-side (API filter is unreliable)
    console.log(`[MLS] Scanning all MLS listings for ${officeName}...`);
    const officeNameLower = officeName.toLowerCase();
    const allOfficeListings: ResoProperty[] = [];

    // Scan all ~42,000 active listings to find all office listings
    for (let offset = 0; offset < 50000; offset += 500) {
      const pageResult = await this.getListings({ limit: 500, offset });
      if (!pageResult.value || pageResult.value.length === 0) break;

      const officeListings = pageResult.value.filter(l =>
        l.ListOfficeName?.toLowerCase().includes(officeNameLower)
      );
      allOfficeListings.push(...officeListings);

      // Log progress every 5000 listings
      if (offset % 5000 === 0 && offset > 0) {
        console.log(`[MLS] Scanned ${offset} listings, found ${allOfficeListings.length} ${officeName} listings so far`);
      }

      // Small delay between pages to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`[MLS] Found ${allOfficeListings.length} total listings for office: ${officeName}`);
    return { "@odata.context": "", value: allOfficeListings };
  }

  async searchListings(query: string): Promise<ResoODataResponse> {
    // OData doesn't have full-text search, so search by city or address contains
    const queryParams = new URLSearchParams();
    queryParams.set("$filter", `StandardStatus eq 'Active' and (contains(City,'${query}') or contains(UnparsedAddress,'${query}'))`);
    queryParams.set("$top", "20");
    queryParams.set("$orderby", "ListPrice desc");

    const url = `${this.baseUrl}/Property?${queryParams.toString()}`;

    try {
      await this.throttle();
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
        next: { revalidate: 900 },
      });

      if (response.status === 429) {
        console.warn("[MLS] Rate limited on search");
        return { "@odata.context": "", value: [] };
      }

      if (!response.ok) {
        throw new Error(`Spark API error: ${response.status}`);
      }

      const data = await response.json();
      return data as ResoODataResponse;
    } catch (error) {
      console.error("[MLS] Search failed:", error);
      throw error;
    }
  }

  async getPhotos(listingKey: string, retryCount: number = 0, skipThrottle: boolean = false): Promise<{ MediaURL: string; Order: number; rateLimited?: boolean }[]> {
    // Use the subresource endpoint: /Property('<ListingKey>')/Media
    const url = `${this.baseUrl}/Property('${listingKey}')/Media?$filter=MediaCategory eq 'Photo'&$orderby=Order&$top=6`;

    try {
      if (!skipThrottle) {
        await this.throttle();
      }
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
        next: { revalidate: 900 },
      });

      if (response.status === 429) {
        // Retry with exponential backoff (up to 3 retries)
        if (retryCount < 3) {
          const waitTime = Math.pow(2, retryCount + 1) * 600; // 1.2s, 2.4s, 4.8s
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return this.getPhotos(listingKey, retryCount + 1, true);
        }
        console.warn(`[MLS] Rate limited on media for ${listingKey} after ${retryCount + 1} attempts`);
        // Return special marker to indicate rate limiting (don't cache this)
        return [{ MediaURL: "", Order: -1, rateLimited: true }];
      }
      if (!response.ok) {
        console.warn(`[MLS] Media request failed for ${listingKey}: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return this.filterPhotos(data.value || []);
    } catch (error) {
      console.error(`[MLS] Failed to fetch photos for ${listingKey}:`, error);
      return [];
    }
  }

  private filterPhotos(photos: { MediaURL?: string; MimeType?: string }[]): { MediaURL: string; Order: number }[] {
    return photos.filter((p) => {
      if (!p.MediaURL) return false;
      const url = p.MediaURL.toLowerCase();
      const mime = (p.MimeType || "").toLowerCase();
      // Exclude PDFs and documents
      if (url.endsWith(".pdf") || mime.includes("pdf")) return false;
      if (url.includes("/documents/")) return false;
      return true;
    }) as { MediaURL: string; Order: number }[];
  }

  async getPhotosForListings(listingKeys: string[]): Promise<Map<string, string[]>> {
    const photoMap = new Map<string, string[]>();

    if (listingKeys.length === 0) return photoMap;

    // First, check cache for all listings
    const uncachedKeys: string[] = [];
    let cacheHits = 0;
    for (const key of listingKeys) {
      const cached = getCachedPhotos(key);
      if (cached !== null) {
        cacheHits++;
        if (cached.length > 0) {
          photoMap.set(key, cached);
        }
      } else {
        uncachedKeys.push(key);
      }
    }
    if (cacheHits > 0) {
      console.log(`[MLS] Photo cache: ${cacheHits} hits, ${uncachedKeys.length} to fetch`);
    }

    // Fetch photos in batches of 2 with delay between batches (conservative to avoid rate limits)
    const BATCH_SIZE = 2;
    const BATCH_DELAY = 600; // 600ms between batches

    for (let i = 0; i < uncachedKeys.length; i += BATCH_SIZE) {
      const batch = uncachedKeys.slice(i, i + BATCH_SIZE);

      // Fetch batch in parallel (skip individual throttle, batch delay handles rate limiting)
      const results = await Promise.all(
        batch.map(async (key) => {
          try {
            const photos = await this.getPhotos(key, 0, true);
            // Check if rate limited (don't cache these)
            const wasRateLimited = photos.some(p => p.rateLimited);
            const urls = photos
              .filter(p => p.MediaURL && !p.rateLimited)
              .map(p => p.MediaURL)
              .slice(0, 4);
            return { key, urls, wasRateLimited };
          } catch {
            return { key, urls: [] as string[], wasRateLimited: false };
          }
        })
      );

      // Process results - only cache successful fetches, not rate-limited ones
      for (const { key, urls, wasRateLimited } of results) {
        if (!wasRateLimited) {
          // Only cache if we got a real response (even if empty)
          setCachedPhotos(key, urls);
        }
        if (urls.length > 0) {
          photoMap.set(key, urls);
        }
      }

      // Wait between batches (except for last batch)
      if (i + BATCH_SIZE < uncachedKeys.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
    }

    return photoMap;
  }

  isConfigured(): boolean {
    return !!this.accessToken;
  }
}

// Export singleton instance
export const sparkClient = new SparkApiClient();

// Export class for testing
export { SparkApiClient };
