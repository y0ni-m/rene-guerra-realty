"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Property } from "@/data/listings";
import { useSearch } from "@/context/SearchContext";
import { useLanguage } from "@/context/LanguageContext";
import { translatePropertyType } from "@/lib/translation/propertyTypes";
import ScrollAnimation from "./ScrollAnimation";

const filters = ["All", "Waterfront", "Condo", "Single Family", "Townhouse", "Villa"];
const PAGE_SIZE = 12;

interface Props {
  initialListings: Property[];
  agentListingIds?: string[];
  brokerageListingIds?: string[];
  initialHasMore?: boolean;
}

export default function Listings({
  initialListings,
  agentListingIds = [],
  brokerageListingIds = [],
  initialHasMore = true,
}: Props) {
  const t = useTranslations("listings");
  const tProp = useTranslations("property");
  const { locale } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("All");
  const [listings, setListings] = useState(initialListings);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const { filters: searchFilters, hasActiveFilters, clearFilters } = useSearch();

  // Create sets for quick lookup
  const agentListings = new Set(agentListingIds);
  const brokerageListings = new Set(brokerageListingIds);

  // All listing IDs to exclude when loading more (agent + brokerage + already loaded)
  const excludeIds = useMemo(() => {
    return [...agentListingIds, ...brokerageListingIds, ...listings.map(l => l.mlsNumber)];
  }, [agentListingIds, brokerageListingIds, listings]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newOffset = offset + PAGE_SIZE;
      const params = new URLSearchParams({
        offset: newOffset.toString(),
        limit: PAGE_SIZE.toString(),
        excludeIds: excludeIds.join(","),
      });

      const response = await fetch(`/api/listings?${params}`);
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        setListings(prev => [...prev, ...data.data]);
        setOffset(newOffset);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more listings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, offset, excludeIds]);

  const filteredListings = useMemo(() => {
    let result = listings;

    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      result = result.filter(
        (listing) =>
          listing.title.toLowerCase().includes(query) ||
          listing.address.toLowerCase().includes(query) ||
          listing.city.toLowerCase().includes(query) ||
          listing.zip.includes(query)
      );
    }

    if (searchFilters.propertyType) {
      result = result.filter(
        (listing) => listing.type === searchFilters.propertyType
      );
    }

    if (searchFilters.priceRange) {
      result = result.filter(
        (listing) =>
          listing.priceNumber >= searchFilters.minPrice &&
          listing.priceNumber <= searchFilters.maxPrice
      );
    }

    if (!hasActiveFilters && activeFilter !== "All") {
      result = result.filter((listing) => listing.type === activeFilter);
    }

    return result;
  }, [listings, searchFilters, activeFilter, hasActiveFilters]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (hasActiveFilters) {
      clearFilters();
    }
  };

  return (
    <section id="listings" className="py-16 md:py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollAnimation className="text-center mb-16">
          <p className="text-[var(--muted)] text-[11px] tracking-[0.3em] uppercase mb-4">
            {t("overline")}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)]">
            {t("title")}
          </h2>
          <div className="section-divider mx-auto mt-6" />

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {searchFilters.query && (
                <span className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-[11px] tracking-wider">
                  &quot;{searchFilters.query}&quot;
                </span>
              )}
              {searchFilters.propertyType && (
                <span className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-[11px] tracking-wider">
                  {searchFilters.propertyType}
                </span>
              )}
              {searchFilters.priceRange && (
                <span className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-[11px] tracking-wider">
                  {searchFilters.priceRange === "5000000+"
                    ? "$5M+"
                    : searchFilters.priceRange
                        .split("-")
                        .map((p) => `$${(parseInt(p) / 1000000).toFixed(1)}M`)
                        .join(" - ")}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-[var(--border)] text-[var(--muted)] text-[11px] tracking-wider hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                {t("filters.clearAll")}
              </button>
            </div>
          )}
        </ScrollAnimation>

        {/* Filter Tabs */}
        {!hasActiveFilters && (
          <ScrollAnimation delay={0.1} className="flex flex-wrap justify-center gap-2 mb-16">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-6 py-3 text-[11px] tracking-[0.15em] uppercase transition-all ${
                  activeFilter === filter
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "border border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {filter}
              </button>
            ))}
          </ScrollAnimation>
        )}

        {/* Results Count */}
        {hasActiveFilters && (
          <p className="text-center text-[var(--muted)] text-sm mb-12">
            {filteredListings.length} {filteredListings.length === 1 ? "property" : "properties"} found
          </p>
        )}

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: (index % PAGE_SIZE) * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  layout
                >
                  <Link
                    href={`/property/${listing.slug}`}
                    className="group block"
                  >
                  {/* Image */}
                  <div className="relative aspect-[4/3] mb-6 overflow-hidden bg-[var(--border)]">
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-contain md:object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="image-overlay hidden md:block" />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      {(agentListings.has(listing.mlsNumber) || listing.isAgentListing) && (
                        <span className="bg-amber-500 text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1">
                          Rene&apos;s Listing
                        </span>
                      )}
                      {(brokerageListings.has(listing.mlsNumber) || listing.isBrokerageListing) &&
                       !(agentListings.has(listing.mlsNumber) || listing.isAgentListing) && (
                        <span className="bg-blue-600 text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1">
                          Partnership Realty
                        </span>
                      )}
                      <span className="text-white/80 text-[10px] tracking-[0.2em] uppercase">
                        {translatePropertyType(listing.type, locale)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-[var(--muted)] text-[11px] tracking-[0.15em] uppercase mb-2">
                      {listing.city}, {listing.state}
                    </p>
                    <h3 className="font-serif text-xl text-[var(--foreground)] mb-2 group-hover:opacity-70 transition-opacity">
                      {listing.title}
                    </h3>
                    <p className="text-[var(--foreground)] text-lg font-light mb-4">
                      {listing.price}
                    </p>

                    {/* Details */}
                    <div className="flex items-center space-x-4 text-[var(--muted)] text-sm">
                      <span>{listing.beds} {tProp("beds")}</span>
                      <span className="w-1 h-1 bg-[var(--muted)] rounded-full" />
                      <span>{listing.baths} {tProp("baths")}</span>
                      <span className="w-1 h-1 bg-[var(--muted)] rounded-full" />
                      <span>{listing.sqft} {tProp("sqft")}</span>
                    </div>
                  </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-[var(--muted)] text-lg mb-6">
              {t("noResults")}
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary px-8 py-4"
            >
              {t("filters.clearAll")}
            </button>
          </motion.div>
        )}

        {/* Load More */}
        {!hasActiveFilters && filteredListings.length > 0 && hasMore && (
          <ScrollAnimation delay={0.3} className="text-center mt-16">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="btn-outline px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t("loading")}
                </span>
              ) : (
                t("loadMore")
              )}
            </button>
          </ScrollAnimation>
        )}
      </div>
    </section>
  );
}
