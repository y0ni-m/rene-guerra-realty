"use client";

import { useState } from "react";
import { useSearch } from "@/context/SearchContext";

export default function SearchBar() {
  const { setFilters } = useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      query: searchQuery,
      propertyType,
      priceRange,
      minPrice: 0,
      maxPrice: Infinity,
    });
    const listingsSection = document.getElementById("listings");
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleQuickSearch = (location: string) => {
    setSearchQuery(location);
    setFilters({
      query: location,
      propertyType,
      priceRange,
      minPrice: 0,
      maxPrice: Infinity,
    });
    const listingsSection = document.getElementById("listings");
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
      {/* Search Fields - always light background with dark text */}
      <div className="bg-white/95 backdrop-blur-sm p-2 flex flex-col md:flex-row">
        {/* Location */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200">
          <input
            type="text"
            placeholder="Location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-transparent text-gray-900 placeholder-gray-400 text-sm tracking-wide focus:outline-none"
          />
        </div>

        {/* Property Type */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full px-6 py-4 bg-transparent text-gray-900 text-sm tracking-wide focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">Property Type</option>
            <option value="Single Family">Single Family</option>
            <option value="Condo">Condo</option>
            <option value="Waterfront">Waterfront</option>
            <option value="Luxury Estate">Luxury Estate</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200">
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full px-6 py-4 bg-transparent text-gray-900 text-sm tracking-wide focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">Price Range</option>
            <option value="0-500000">Under $500K</option>
            <option value="500000-1000000">$500K - $1M</option>
            <option value="1000000-2000000">$1M - $2M</option>
            <option value="2000000-5000000">$2M - $5M</option>
            <option value="5000000+">$5M+</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-8 py-4 bg-[#1A1A1A] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-black transition-colors"
        >
          Search
        </button>
      </div>

      {/* Quick Links */}
      <div className="mt-6 flex flex-wrap justify-center gap-6">
        {["Palm Beach", "Boca Raton", "Delray Beach", "Jupiter", "West Palm Beach"].map(
          (location) => (
            <button
              key={location}
              type="button"
              onClick={() => handleQuickSearch(location)}
              className="text-white/60 text-[11px] tracking-[0.15em] uppercase hover:text-white transition-colors underline-animate"
            >
              {location}
            </button>
          )
        )}
      </div>
    </form>
  );
}
