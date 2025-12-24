import { ResoProperty } from "./client";
import { Property } from "@/data/listings";

/**
 * Generates a URL-friendly slug from listing data
 */
function generateSlug(listing: ResoProperty): string {
  const parts: string[] = [];

  // Use property type and city for slug
  if (listing.PropertyType) {
    parts.push(listing.PropertyType.toLowerCase().replace(/\s+/g, "-"));
  }

  if (listing.StreetName) {
    parts.push(listing.StreetName.toLowerCase().replace(/\s+/g, "-"));
  }

  if (listing.City) {
    parts.push(listing.City.toLowerCase().replace(/\s+/g, "-"));
  }

  // Add Listing ID for uniqueness
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
 * Formats square footage with comma separator
 */
function formatSqft(sqft: number | undefined): string {
  if (!sqft) return "N/A";
  return new Intl.NumberFormat("en-US").format(sqft);
}

/**
 * Formats lot size from acres or square feet
 */
function formatLotSize(acres?: number, sqft?: number): string {
  if (acres && acres > 0) {
    return `${acres.toFixed(2)} acres`;
  }

  if (sqft && sqft > 0) {
    if (sqft > 43560) {
      // Convert to acres if large
      return `${(sqft / 43560).toFixed(2)} acres`;
    }
    return `${new Intl.NumberFormat("en-US").format(sqft)} sq ft`;
  }

  return "N/A";
}

/**
 * Maps MLS status to Property status
 */
function mapStatus(mlsStatus: string): "For Sale" | "Pending" | "Sold" {
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
 * Maps MLS property type to display type
 */
function mapPropertyType(propertyType: string, subType?: string): string {
  const type = propertyType.toLowerCase();
  const sub = subType?.toLowerCase() || "";

  if (type.includes("condo") || sub.includes("condo")) {
    return "Condo";
  }

  if (type.includes("townhouse") || sub.includes("townhouse") || sub.includes("townhome")) {
    return "Townhouse";
  }

  if (sub.includes("villa")) {
    return "Villa";
  }

  if (type.includes("residential") || type.includes("single")) {
    return "Single Family";
  }

  return "Single Family";
}

/**
 * Collects features from various MLS fields
 */
function collectFeatures(listing: ResoProperty): string[] {
  const features: string[] = [];

  // Add waterfront if applicable
  if (listing.WaterfrontYN) {
    features.push("Waterfront");
  }

  // Add pool if applicable
  if (listing.PoolPrivateYN) {
    features.push("Pool");
  }

  // Add interior features
  if (listing.InteriorFeatures) {
    features.push(...listing.InteriorFeatures.slice(0, 4));
  }

  // Add exterior features
  if (listing.ExteriorFeatures) {
    features.push(...listing.ExteriorFeatures.slice(0, 3));
  }

  // Add pool features
  if (listing.PoolFeatures && listing.PoolFeatures.length > 0) {
    features.push(...listing.PoolFeatures.slice(0, 2));
  }

  // Add view features
  if (listing.View) {
    features.push(...listing.View.slice(0, 2));
  }

  // Remove duplicates and limit
  return [...new Set(features)].slice(0, 12);
}

/**
 * Formats parking information
 */
function formatParking(garageSpaces?: number, totalSpaces?: number): string {
  if (garageSpaces && garageSpaces > 0) {
    return `${garageSpaces}-car garage`;
  }

  if (totalSpaces && totalSpaces > 0) {
    return `${totalSpaces} parking spaces`;
  }

  return "Parking available";
}

/**
 * Builds full address from components
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
 * Creates a title from address
 */
function createTitle(listing: ResoProperty): string {
  const address = buildAddress(listing);
  // Remove city/state from title if present
  const titlePart = address.split(",")[0];
  return titlePart || "Beautiful Home";
}

/**
 * Generic "No Image Available" placeholder
 */
const NO_IMAGE_PLACEHOLDER = "/images/no-image-placeholder.svg";

/**
 * Returns placeholder image when no MLS photos are available
 */
function getPlaceholderImages(): string[] {
  return [NO_IMAGE_PLACEHOLDER];
}

/**
 * Generates a unique string ID from listing key
 * Using the listing key directly ensures uniqueness
 */
function generateUniqueId(listingKey: string): string {
  return listingKey;
}

/**
 * Transforms a RESO OData listing to Property format
 */
export function transformResoListing(listing: ResoProperty, index: number, photos?: string[]): Property {
  const bathrooms = listing.BathroomsTotalInteger ||
    (listing.BathroomsFull || 0) + (listing.BathroomsHalf || 0) * 0.5;

  return {
    id: generateUniqueId(listing.ListingKey),
    slug: generateSlug(listing),
    title: createTitle(listing),
    address: buildAddress(listing),
    city: listing.City || "Palm Beach County",
    state: listing.StateOrProvince || "FL",
    zip: listing.PostalCode || "",
    price: formatPrice(listing.ListPrice),
    priceNumber: listing.ListPrice,
    beds: listing.BedroomsTotal || 0,
    baths: bathrooms,
    sqft: formatSqft(listing.LivingArea || listing.BuildingAreaTotal),
    sqftNumber: listing.LivingArea || listing.BuildingAreaTotal || 0,
    type: mapPropertyType(listing.PropertyType, listing.PropertySubType),
    status: mapStatus(listing.StandardStatus),
    yearBuilt: listing.YearBuilt || new Date().getFullYear(),
    lotSize: formatLotSize(listing.LotSizeAcres, listing.LotSizeSquareFeet),
    parking: formatParking(listing.GarageSpaces, listing.ParkingTotal),
    description: listing.PublicRemarks || "Contact agent for more details.",
    features: collectFeatures(listing),
    images: photos && photos.length > 0 ? photos : getPlaceholderImages(),
    mlsNumber: listing.ListingId || listing.ListingKey,
    listedDate: listing.OnMarketDate || listing.ListingContractDate || new Date().toISOString().split("T")[0],
  };
}

/**
 * Transforms an array of RESO listings to Property format
 */
export function transformResoListings(listings: ResoProperty[]): Property[] {
  return listings.map((listing, index) => transformResoListing(listing, index));
}
