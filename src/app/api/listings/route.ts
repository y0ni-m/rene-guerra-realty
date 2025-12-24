import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { Listing } from "@/lib/supabase/types";
import { sparkClient } from "@/lib/mls/client";
import { transformResoListing } from "@/lib/mls/transformer";
import { isApiConfigured } from "@/lib/listings";

const NO_IMAGE_PLACEHOLDER = "/images/no-image-placeholder.svg";

function dbListingToProperty(listing: Listing) {
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
    status: listing.status,
    yearBuilt: listing.year_built,
    lotSize: listing.lot_size || "N/A",
    parking: listing.parking || "Parking available",
    description: listing.description,
    features: listing.features,
    images: listing.images.length > 0 ? listing.images : [NO_IMAGE_PLACEHOLDER],
    mlsNumber: listing.mls_number,
    listedDate: listing.listed_date,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const limit = parseInt(searchParams.get("limit") || "8", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const excludeIds = searchParams.get("excludeIds")?.split(",").filter(Boolean) || [];

  // Try Supabase first (instant, no rate limits!)
  if (supabase) {
    try {
      let query = supabase
        .from("listings")
        .select("*")
        .eq("status", "For Sale")
        .order("is_agent_listing", { ascending: false })  // Rene's listings first
        .order("listed_date", { ascending: false });

      // Apply filters
      const city = searchParams.get("city");
      if (city) query = query.ilike("city", city);

      const minPrice = searchParams.get("minPrice");
      if (minPrice) query = query.gte("price_number", parseInt(minPrice));

      const maxPrice = searchParams.get("maxPrice");
      if (maxPrice) query = query.lte("price_number", parseInt(maxPrice));

      const beds = searchParams.get("beds");
      if (beds) query = query.gte("beds", parseInt(beds));

      const baths = searchParams.get("baths");
      if (baths) query = query.gte("baths", parseFloat(baths));

      const propertyType = searchParams.get("propertyType");
      if (propertyType) query = query.eq("property_type", propertyType);

      // Exclude already shown listings
      if (excludeIds.length > 0) {
        query = query.not("mls_number", "in", `(${excludeIds.join(",")})`);
      }

      // Pagination - fetch one extra to check hasMore
      query = query.range(offset, offset + limit);

      const { data, error } = await query;

      if (!error && data) {
        const hasMore = data.length > limit;
        const listings = data.slice(0, limit).map(dbListingToProperty);

        return NextResponse.json({
          success: true,
          data: listings,
          hasMore,
          meta: { count: listings.length, offset, limit, source: "supabase" },
        });
      }
    } catch (error) {
      console.error("[API] Supabase error:", error);
    }
  }

  // Fallback to MLS API
  try {
    const params = {
      city: searchParams.get("city") || undefined,
      minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined,
      beds: searchParams.get("beds") ? parseInt(searchParams.get("beds")!) : undefined,
      baths: searchParams.get("baths") ? parseInt(searchParams.get("baths")!) : undefined,
      propertyType: searchParams.get("propertyType") || undefined,
      limit: limit + excludeIds.length + 5,
      offset,
    };

    const response = await sparkClient.getListings(params);

    if (!response.value || response.value.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        hasMore: false,
        meta: { count: 0, offset, limit, apiConfigured: isApiConfigured() },
      });
    }

    const excludeSet = new Set(excludeIds);
    const filteredListings = response.value.filter((l) => !excludeSet.has(l.ListingId));
    const hasMore = filteredListings.length > limit;
    const pageListings = filteredListings.slice(0, limit);

    const listingKeys = pageListings.map((l) => l.ListingKey);
    const photoMap = await sparkClient.getPhotosForListings(listingKeys);

    const listings = pageListings.map((listing, index) => {
      const photos = photoMap.get(listing.ListingKey) || [];
      return transformResoListing(listing, index, photos);
    });

    return NextResponse.json({
      success: true,
      data: listings,
      hasMore,
      meta: { count: listings.length, offset, limit, source: "mls_api" },
    });
  } catch (error) {
    console.error("[API] Error fetching listings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch listings", data: [], hasMore: false },
      { status: 500 }
    );
  }
}
