import Hero from "@/components/Hero";
import FeaturedProperty from "@/components/FeaturedProperty";
import Listings from "@/components/Listings";
import About from "@/components/About";
import Contact from "@/components/Contact";
import { getPrioritizedListings, getFeaturedProperty } from "@/lib/listings";

const INITIAL_LISTINGS_COUNT = 12;

export default async function Home() {
  // Fetch MLS data server-side with prioritization (small initial batch for fast load)
  const [prioritizedListings, featuredProperty] = await Promise.all([
    getPrioritizedListings(INITIAL_LISTINGS_COUNT),
    getFeaturedProperty(),
  ]);

  // Combine all listings with agent/brokerage first
  const allListings = [
    ...prioritizedListings.agentListings,
    ...prioritizedListings.brokerageListings,
    ...prioritizedListings.mlsListings,
  ];

  // There are more listings available for pagination
  const totalShown = allListings.length;
  const hasMore = totalShown >= INITIAL_LISTINGS_COUNT;

  return (
    <>
      <Hero />
      <FeaturedProperty property={featuredProperty} />
      <Listings
        initialListings={allListings}
        agentListingIds={prioritizedListings.agentListings.map(l => l.mlsNumber)}
        brokerageListingIds={prioritizedListings.brokerageListings.map(l => l.mlsNumber)}
        initialHasMore={hasMore}
      />
      <About />
      <Contact />
    </>
  );
}
