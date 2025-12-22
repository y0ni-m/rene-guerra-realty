"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { listings } from "@/data/listings";
import { useSearch } from "@/context/SearchContext";
import ScrollAnimation from "./ScrollAnimation";

const filters = ["All", "Waterfront", "Condo", "Single Family", "Luxury Estate"];

export default function Listings() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { filters: searchFilters, hasActiveFilters, clearFilters } = useSearch();

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
  }, [searchFilters, activeFilter, hasActiveFilters]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (hasActiveFilters) {
      clearFilters();
    }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section id="listings" className="py-16 md:py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollAnimation className="text-center mb-16">
          <p className="text-[var(--muted)] text-[11px] tracking-[0.3em] uppercase mb-4">
            Explore
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)]">
            {hasActiveFilters ? "Search Results" : "Properties"}
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
                Clear All
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
          <motion.div
            key={activeFilter + searchFilters.query}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredListings.map((listing) => (
              <motion.div key={listing.id} variants={cardVariants}>
                <Link
                  href={`/property/${listing.slug}`}
                  className="group block"
                >
                  {/* Image */}
                  <div className="relative h-80 mb-6 overflow-hidden">
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="image-overlay" />
                    <div className="absolute top-6 left-6">
                      <span className="text-white/80 text-[10px] tracking-[0.2em] uppercase">
                        {listing.type}
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
                      <span>{listing.beds} Beds</span>
                      <span className="w-1 h-1 bg-[var(--muted)] rounded-full" />
                      <span>{listing.baths} Baths</span>
                      <span className="w-1 h-1 bg-[var(--muted)] rounded-full" />
                      <span>{listing.sqft} Sq Ft</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-[var(--muted)] text-lg mb-6">
              No properties match your criteria
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary px-8 py-4"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* View All */}
        {!hasActiveFilters && filteredListings.length > 0 && (
          <ScrollAnimation delay={0.3} className="text-center mt-16">
            <button className="btn-outline px-10 py-4">
              View All Properties
            </button>
          </ScrollAnimation>
        )}
      </div>
    </section>
  );
}
