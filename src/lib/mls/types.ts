// Spark API Response Types (RESO Web API format)

export interface SparkApiResponse<T> {
  D: {
    Success: boolean;
    Results: T[];
    Pagination?: {
      TotalRows: number;
      PageSize: number;
      CurrentPage: number;
      TotalPages: number;
    };
  };
}

export interface SparkListing {
  Id: string;
  ResourceUri: string;
  StandardFields: SparkStandardFields;
  CustomFields?: Record<string, unknown>;
}

export interface SparkStandardFields {
  // Identification
  ListingId: string;
  ListingKey: string;
  MlsId: string;
  MlsStatus: string;
  StandardStatus: "Active" | "Pending" | "Sold" | "Expired" | "Withdrawn" | "Cancelled";

  // Property Details
  PropertyType: string;
  PropertySubType?: string;
  BedsTotal: number;
  BathsTotal: number;
  BuildingAreaTotal?: number;
  LotSizeArea?: number;
  LotSizeAreaUnits?: string;
  YearBuilt?: number;

  // Address
  UnparsedAddress?: string;
  StreetNumber?: string;
  StreetName?: string;
  StreetSuffix?: string;
  StreetDirPrefix?: string;
  StreetDirSuffix?: string;
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  Country?: string;
  Latitude?: number;
  Longitude?: number;

  // Pricing
  ListPrice: number;
  OriginalListPrice?: number;
  ClosePrice?: number;

  // Dates
  ListingContractDate?: string;
  OnMarketDate?: string;
  CloseDate?: string;
  ModificationTimestamp?: string;

  // Description
  PublicRemarks?: string;
  PrivateRemarks?: string;

  // Agent/Office
  ListAgentFullName?: string;
  ListAgentMlsId?: string;
  ListAgentEmail?: string;
  ListAgentDirectPhone?: string;
  ListOfficeName?: string;
  ListOfficeMlsId?: string;

  // Features
  InteriorFeatures?: string[];
  ExteriorFeatures?: string[];
  Appliances?: string[];
  Heating?: string[];
  Cooling?: string[];
  ParkingFeatures?: string[];
  PoolFeatures?: string[];
  WaterfrontFeatures?: string[];
  View?: string[];

  // Parking
  GarageSpaces?: number;
  ParkingTotal?: number;

  // Media
  Photos?: SparkPhoto[];
  VirtualTours?: SparkVirtualTour[];
}

export interface SparkPhoto {
  Id: string;
  Uri300?: string;
  Uri640?: string;
  Uri800?: string;
  Uri1024?: string;
  Uri1280?: string;
  UriLarge?: string;
  Primary?: boolean;
  Caption?: string;
  Order?: number;
}

export interface SparkVirtualTour {
  Uri: string;
  BrandedUri?: string;
  UnbrandedUri?: string;
}

// Search/Filter parameters
export interface ListingSearchParams {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
  status?: string;
  agentKey?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  query?: string;
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
