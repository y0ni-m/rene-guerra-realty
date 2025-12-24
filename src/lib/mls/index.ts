// MLS Integration Module
// Provides integration with Beaches MLS via Spark Platform RESO OData API

export { sparkClient, SparkApiClient, type ResoODataResponse, type ResoProperty } from "./client";
export { transformResoListing, transformResoListings } from "./transformer";
export type { ListingSearchParams, CacheEntry } from "./types";
