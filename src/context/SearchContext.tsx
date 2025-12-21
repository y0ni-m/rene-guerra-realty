"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface SearchFilters {
  query: string;
  propertyType: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
}

interface SearchContextType {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const defaultFilters: SearchFilters = {
  query: "",
  propertyType: "",
  priceRange: "",
  minPrice: 0,
  maxPrice: Infinity,
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<SearchFilters>(defaultFilters);

  const setFilters = (newFilters: SearchFilters) => {
    // Parse price range to min/max values
    let minPrice = 0;
    let maxPrice = Infinity;

    switch (newFilters.priceRange) {
      case "0-500000":
        minPrice = 0;
        maxPrice = 500000;
        break;
      case "500000-1000000":
        minPrice = 500000;
        maxPrice = 1000000;
        break;
      case "1000000-2000000":
        minPrice = 1000000;
        maxPrice = 2000000;
        break;
      case "2000000-5000000":
        minPrice = 2000000;
        maxPrice = 5000000;
        break;
      case "5000000+":
        minPrice = 5000000;
        maxPrice = Infinity;
        break;
      default:
        minPrice = 0;
        maxPrice = Infinity;
    }

    setFiltersState({
      ...newFilters,
      minPrice,
      maxPrice,
    });
  };

  const clearFilters = () => {
    setFiltersState(defaultFilters);
  };

  const hasActiveFilters =
    filters.query !== "" ||
    filters.propertyType !== "" ||
    filters.priceRange !== "";

  return (
    <SearchContext.Provider
      value={{ filters, setFilters, clearFilters, hasActiveFilters }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
