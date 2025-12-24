import { supabase } from "./supabase/client";
import { Listing } from "./supabase/types";
import { sparkClient } from "./mls/client";
import { transformResoListings, transformResoListing } from "./mls/transformer";
import { ListingSearchParams } from "./mls/types";
import {
  Property,
  listings as mockListings,
  featuredProperty as mockFeatured,
  allProperties as mockAllProperties,
} from "@/data/listings";

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Use Supabase if configured, otherwise fall back to MLS API or mock data
const USE_SUPABASE = !!SUPABASE_URL;

/**
 * Transform Supabase listing to Property format
 */
function dbListingToProperty(listing: Listing): Property {
  return {
    id: listing.listing_key,
    slug: listing.slug,
    title: listing.title,
    address: listing.address,
    city: listing.city,
    state: listing.state,
    zip: listing.zip,
    price: listing.price,
    priceNumber: listing.price_number,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sqft || "N/A",
    sqftNumber: listing.sqft_number,
    type: listing.property_type,
    status: listing.status as "For Sale" | "Pending" | "Sold",
    yearBuilt: listing.year_built,
    lotSize: listing.lot_size || "N/A",
    parking: listing.parking || "Parking available",
    description: listing.description,
    features: listing.features,
    images: listing.images.length > 0 ? listing.images : getPlaceholderImages(),
    mlsNumber: listing.mls_number,
    listedDate: listing.listed_date,
  };
}

/**
 * Generic "No Image Available" placeholder
 */
const NO_IMAGE_PLACEHOLDER = "/images/no-image-placeholder.svg";

function getPlaceholderImages(): string[] {
  return [NO_IMAGE_PLACEHOLDER];
}

/**
 * Fetches all active listings from Supabase (or MLS API fallback)
 */
export async function getListings(params: ListingSearchParams = {}): Promise<Property[]> {
  if (USE_MOCK_DATA) {
    console.log("[Listings] Using mock data");
    return applyFiltersToMock(mockListings, params);
  }

  // Try Supabase first (fast, cached data)
  if (USE_SUPABASE) {
    try {
      let query = supabase
        .from("listings")
        .select("*")
        .eq("status", "For Sale")
        .order("listed_date", { ascending: false });

      if (params.city) {
        query = query.ilike("city", params.city);
      }
      if (params.minPrice !== undefined) {
        query = query.gte("price_number", params.minPrice);
      }
      if (params.maxPrice !== undefined) {
        query = query.lte("price_number", params.maxPrice);
      }
      if (params.beds !== undefined) {
        query = query.gte("beds", params.beds);
      }
      if (params.baths !== undefined) {
        query = query.gte("baths", params.baths);
      }
      if (params.propertyType) {
        query = query.eq("property_type", params.propertyType);
      }
      if (params.limit) {
        query = query.limit(params.limit);
      }
      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 20) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error("[Listings] Supabase error:", error);
      } else if (data && data.length > 0) {
        console.log(`[Listings] Loaded ${data.length} listings from Supabase`);
        return data.map(dbListingToProperty);
      }
    } catch (error) {
      console.error("[Listings] Supabase fetch failed:", error);
    }
  }

  // Fallback to MLS API
  if (sparkClient.isConfigured()) {
    try {
      const response = await sparkClient.getListings(params);

      if (response.value && response.value.length > 0) {
        const listingKeys = response.value.map(l => l.ListingKey);
        const photoMap = await sparkClient.getPhotosForListings(listingKeys);

        return response.value.map((listing, index) => {
          const photos = photoMap.get(listing.ListingKey) || [];
          return transformResoListing(listing, index, photos);
        });
      }
    } catch (error) {
      console.error("[Listings] MLS API failed:", error);
    }
  }

  // Final fallback to mock data
  console.log("[Listings] Using mock data as fallback");
  return applyFiltersToMock(mockListings, params);
}

/**
 * Extracts MLS ID from a slug (e.g., "residential-ocean-manalapan-11053004" -> "R11053004")
 */
function extractMlsIdFromSlug(slug: string): string | null {
  // The MLS ID is typically at the end of the slug
  const match = slug.match(/(\d+)$/);
  if (match) {
    // MLS IDs often have a letter prefix like "R" or "F"
    const numericId = match[1];
    // Try with common prefixes
    return `R${numericId}`;
  }
  return null;
}

/**
 * Fetches a single listing by MLS ID or slug
 */
export async function getListingByIdOrSlug(identifier: string): Promise<Property | null> {
  // First check mock data for slug matches (for static pages)
  const mockProperty = mockAllProperties.find(
    (p) => p.slug === identifier || p.mlsNumber === identifier
  );

  if (USE_MOCK_DATA) {
    return mockProperty || null;
  }

  // Try Supabase first (instant!)
  if (USE_SUPABASE) {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .or(`slug.eq.${identifier},mls_number.eq.${identifier}`)
        .single();

      if (!error && data) {
        console.log(`[Listings] Loaded listing ${identifier} from Supabase`);
        return dbListingToProperty(data);
      }
    } catch (error) {
      console.error("[Listings] Supabase single fetch failed:", error);
    }
  }

  // Fallback to MLS API
  try {
    let mlsId = identifier;
    if (identifier.includes("-")) {
      const extracted = extractMlsIdFromSlug(identifier);
      if (extracted) {
        mlsId = extracted;
      }
    }

    let listing = await sparkClient.getListingById(mlsId);

    if (!listing && mlsId.startsWith("R")) {
      listing = await sparkClient.getListingById(mlsId.replace("R", "F"));
    }

    if (!listing) {
      const numericMatch = identifier.match(/(\d+)$/);
      if (numericMatch) {
        listing = await sparkClient.getListingById(numericMatch[1]);
      }
    }

    if (!listing) {
      return mockProperty || null;
    }

    const photos = await sparkClient.getPhotos(listing.ListingKey);
    const photoUrls = photos.map(p => p.MediaURL).filter(Boolean);

    return transformResoListing(listing, 0, photoUrls);
  } catch (error) {
    console.error(`[Listings] Failed to fetch listing ${identifier}:`, error);
    return mockProperty || null;
  }
}

/**
 * Fetches Rene's listings only (raw, without photos)
 */
async function getAgentListingsRaw() {
  const agentId = process.env.RENE_AGENT_ID;

  if (USE_MOCK_DATA || !agentId) {
    return [];
  }

  try {
    const response = await sparkClient.getAgentListings(agentId);
    return response.value || [];
  } catch (error) {
    console.error("[MLS] Failed to fetch agent listings:", error);
    return [];
  }
}

/**
 * Fetches Rene's listings with photos
 */
export async function getAgentListings(): Promise<Property[]> {
  const listings = await getAgentListingsRaw();
  if (listings.length === 0) return [];

  // Fetch photos
  const listingKeys = listings.map(l => l.ListingKey);
  const photoMap = await sparkClient.getPhotosForListings(listingKeys);

  return listings.map((listing, index) => {
    const photos = photoMap.get(listing.ListingKey) || [];
    return transformResoListing(listing, index, photos);
  });
}

/**
 * Fetches Partnership Realty brokerage listings (raw, without photos)
 */
async function getBrokerageListingsRaw() {
  if (USE_MOCK_DATA) {
    return [];
  }

  try {
    const response = await sparkClient.getOfficeListings("Partnership");
    return response.value || [];
  } catch (error) {
    console.error("[MLS] Failed to fetch brokerage listings:", error);
    return [];
  }
}

/**
 * Fetches Partnership Realty brokerage listings with photos
 */
export async function getBrokerageListings(): Promise<Property[]> {
  const listings = await getBrokerageListingsRaw();
  if (listings.length === 0) return [];

  // Fetch photos
  const listingKeys = listings.map(l => l.ListingKey);
  const photoMap = await sparkClient.getPhotosForListings(listingKeys);

  return listings.map((listing, index) => {
    const photos = photoMap.get(listing.ListingKey) || [];
    return transformResoListing(listing, index, photos);
  });
}

/**
 * Gets prioritized listings: Agent first, then brokerage, then general MLS
 */
export async function getPrioritizedListings(limit: number = 24): Promise<{
  agentListings: Property[];
  brokerageListings: Property[];
  mlsListings: Property[];
}> {
  if (USE_MOCK_DATA) {
    return {
      agentListings: mockListings.slice(0, 2),
      brokerageListings: mockListings.slice(2, 4),
      mlsListings: mockListings.slice(4),
    };
  }

  // Try Supabase first (instant, no rate limits!)
  if (USE_SUPABASE) {
    try {
      // Fetch listings ordered with agent first, then brokerage
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "For Sale")
        .order("is_agent_listing", { ascending: false })
        .order("is_brokerage_listing", { ascending: false })
        .order("listed_date", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("[Listings] Supabase error:", error);
      } else if (data && data.length > 0) {
        const listings = data as Listing[];
        const agentListings = listings
          .filter(l => l.is_agent_listing)
          .map(dbListingToProperty);

        // Fill remaining slots with brokerage listings
        const remainingSlots = limit - agentListings.length;
        const brokerageListings = listings
          .filter(l => l.is_brokerage_listing && !l.is_agent_listing)
          .slice(0, remainingSlots)
          .map(dbListingToProperty);

        // No more general MLS listings (we only have agent + brokerage now)
        const mlsListings: Property[] = [];

        console.log(`[Listings] Loaded from Supabase: ${agentListings.length} agent, ${brokerageListings.length} brokerage, ${mlsListings.length} MLS`);

        return { agentListings, brokerageListings, mlsListings };
      }
    } catch (error) {
      console.error("[Listings] Supabase fetch failed:", error);
    }
  }

  // Fallback to MLS API (slow, rate limited)
  try {
    const [agentRaw, brokerageRaw, mlsResponse] = await Promise.all([
      getAgentListingsRaw(),
      getBrokerageListingsRaw(),
      sparkClient.getListings({ limit: limit + 10 }),
    ]);

    const excludeIds = new Set([
      ...agentRaw.map(l => l.ListingId),
      ...brokerageRaw.map(l => l.ListingId),
    ]);

    const filteredMlsRaw = (mlsResponse.value || []).filter(
      l => !excludeIds.has(l.ListingId)
    ).slice(0, limit);

    const allListingKeys = [
      ...agentRaw.map(l => l.ListingKey),
      ...brokerageRaw.map(l => l.ListingKey),
      ...filteredMlsRaw.map(l => l.ListingKey),
    ];

    const photoMap = await sparkClient.getPhotosForListings(allListingKeys);

    const agentListings = agentRaw.map((listing, index) => {
      const photos = photoMap.get(listing.ListingKey) || [];
      return transformResoListing(listing, index, photos);
    });

    const brokerageListings = brokerageRaw.map((listing, index) => {
      const photos = photoMap.get(listing.ListingKey) || [];
      return transformResoListing(listing, index, photos);
    });

    const mlsListings = filteredMlsRaw.map((listing, index) => {
      const photos = photoMap.get(listing.ListingKey) || [];
      return transformResoListing(listing, index, photos);
    });

    return { agentListings, brokerageListings, mlsListings };
  } catch (error) {
    console.error("[Listings] MLS API failed:", error);
    return {
      agentListings: [],
      brokerageListings: [],
      mlsListings: applyFiltersToMock(mockListings, {}),
    };
  }
}

/**
 * Gets the featured property (first of agent's listings or specific property)
 */
export async function getFeaturedProperty(): Promise<Property> {
  if (USE_MOCK_DATA) {
    return mockFeatured;
  }

  // Try Supabase first
  if (USE_SUPABASE) {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("is_agent_listing", true)
        .eq("status", "For Sale")
        .order("price_number", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        console.log("[Listings] Loaded featured property from Supabase");
        return dbListingToProperty(data);
      }
    } catch (error) {
      console.error("[Listings] Supabase featured fetch failed:", error);
    }
  }

  // Fallback to MLS API
  try {
    const agentListings = await getAgentListings();

    if (agentListings.length > 0) {
      return agentListings.sort((a, b) => b.priceNumber - a.priceNumber)[0];
    }

    return mockFeatured;
  } catch (error) {
    console.error("[Listings] Failed to fetch featured property:", error);
    return mockFeatured;
  }
}

/**
 * Searches listings by query string
 */
export async function searchListings(query: string): Promise<Property[]> {
  if (USE_MOCK_DATA) {
    const queryLower = query.toLowerCase();
    return mockListings.filter(
      (p) =>
        p.title.toLowerCase().includes(queryLower) ||
        p.address.toLowerCase().includes(queryLower) ||
        p.city.toLowerCase().includes(queryLower) ||
        p.zip.includes(query)
    );
  }

  try {
    const response = await sparkClient.searchListings(query);

    if (!response.value || response.value.length === 0) {
      return [];
    }

    return transformResoListings(response.value);
  } catch (error) {
    console.error("[MLS] Search failed:", error);
    return [];
  }
}

/**
 * Gets all property slugs for static generation
 */
export async function getAllPropertySlugs(): Promise<string[]> {
  if (USE_MOCK_DATA) {
    return mockAllProperties.map((p) => p.slug);
  }

  try {
    const listings = await getListings({ limit: 100 });
    const slugs = listings.map((p) => p.slug);

    // Also include mock property slugs for fallback
    const mockSlugs = mockAllProperties.map((p) => p.slug);

    return [...new Set([...slugs, ...mockSlugs])];
  } catch (error) {
    console.error("[MLS] Failed to get property slugs:", error);
    return mockAllProperties.map((p) => p.slug);
  }
}

/**
 * Applies search filters to mock data
 */
function applyFiltersToMock(
  properties: Property[],
  params: ListingSearchParams
): Property[] {
  let result = [...properties];

  if (params.city) {
    result = result.filter(
      (p) => p.city.toLowerCase() === params.city!.toLowerCase()
    );
  }

  if (params.minPrice !== undefined) {
    result = result.filter((p) => p.priceNumber >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    result = result.filter((p) => p.priceNumber <= params.maxPrice!);
  }

  if (params.beds !== undefined) {
    result = result.filter((p) => p.beds >= params.beds!);
  }

  if (params.baths !== undefined) {
    result = result.filter((p) => p.baths >= params.baths!);
  }

  if (params.propertyType) {
    result = result.filter((p) => p.type === params.propertyType);
  }

  if (params.query) {
    const query = params.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  if (params.sort) {
    const isDesc = params.sort.includes("desc");
    const field = params.sort.replace(/ (asc|desc)/, "");

    result.sort((a, b) => {
      let comparison = 0;
      if (field === "ListPrice" || field === "price") {
        comparison = a.priceNumber - b.priceNumber;
      } else if (field === "OnMarketDate" || field === "date") {
        comparison = new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime();
      }
      return isDesc ? -comparison : comparison;
    });
  }

  // Apply pagination
  const offset = params.offset || 0;
  const limit = params.limit || result.length;

  return result.slice(offset, offset + limit);
}

/**
 * Check if API is properly configured
 */
export function isApiConfigured(): boolean {
  return sparkClient.isConfigured();
}
