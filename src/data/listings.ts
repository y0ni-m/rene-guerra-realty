export interface Property {
  id: string | number;
  slug: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: string;
  priceNumber: number;
  beds: number;
  baths: number;
  sqft: string;
  sqftNumber: number;
  type: string;
  status: "For Sale" | "Pending" | "Sold";
  yearBuilt: number;
  lotSize: string;
  parking: string;
  description: string;
  features: string[];
  images: string[];
  virtualTour?: string;
  mlsNumber: string;
  listedDate: string;
}

export const featuredProperty: Property = {
  id: 0,
  slug: "oceanfront-paradise-estate",
  title: "Oceanfront Paradise Estate",
  address: "1200 S Ocean Blvd",
  city: "Palm Beach",
  state: "FL",
  zip: "33480",
  price: "$12,500,000",
  priceNumber: 12500000,
  beds: 6,
  baths: 8,
  sqft: "12,500",
  sqftNumber: 12500,
  type: "Luxury Estate",
  status: "For Sale",
  yearBuilt: 2019,
  lotSize: "1.2 acres",
  parking: "4-car garage",
  description: `An extraordinary oceanfront estate offering unparalleled luxury living on prestigious South Ocean Boulevard. This magnificent property features direct beach access, expansive ocean views from every room, and world-class amenities.

The grand foyer welcomes you with soaring ceilings and imported marble floors. The chef's kitchen boasts top-of-the-line Gaggenau appliances, custom cabinetry, and a butler's pantry. The primary suite occupies the entire east wing with panoramic ocean views, dual walk-in closets, and a spa-like bathroom.

Entertainment spaces include a home theater with stadium seating, a temperature-controlled wine cellar, a game room, and a fitness center. The outdoor living areas feature an infinity-edge pool overlooking the ocean, a summer kitchen, multiple terraces, and private beach access.

Smart home technology throughout, hurricane-impact windows and doors, whole-house generator, and an elevator complete this exceptional offering.`,
  features: [
    "Direct Ocean Access",
    "Infinity Pool",
    "Private Beach",
    "Wine Cellar",
    "Home Theater",
    "Smart Home System",
    "Elevator",
    "Chef's Kitchen",
    "Fitness Center",
    "Hurricane Impact Windows",
    "Whole-House Generator",
    "Summer Kitchen",
  ],
  images: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  ],
  mlsNumber: "RX-10892345",
  listedDate: "2024-10-15",
};

export const listings: Property[] = [
  {
    id: 1,
    slug: "modern-waterfront-villa",
    title: "Modern Waterfront Villa",
    address: "456 Intracoastal Way",
    city: "Boca Raton",
    state: "FL",
    zip: "33432",
    price: "$4,250,000",
    priceNumber: 4250000,
    beds: 5,
    baths: 6,
    sqft: "6,200",
    sqftNumber: 6200,
    type: "Waterfront",
    status: "For Sale",
    yearBuilt: 2021,
    lotSize: "0.45 acres",
    parking: "3-car garage",
    description: `Stunning contemporary waterfront villa with breathtaking Intracoastal views. This architectural masterpiece features floor-to-ceiling windows, clean lines, and seamless indoor-outdoor living.

The open floor plan showcases a gourmet kitchen with Miele appliances, waterfall quartz countertops, and a massive island perfect for entertaining. The living areas flow onto an expansive covered terrace with a resort-style pool and private dock.

The primary suite offers water views, a spa bathroom with soaking tub, and custom closets. Four additional bedroom suites provide ample space for family and guests. A dedicated office, media room, and rooftop terrace complete this exceptional home.`,
    features: [
      "Intracoastal Views",
      "Private Dock",
      "Resort Pool",
      "Smart Home",
      "Rooftop Terrace",
      "Impact Windows",
      "Gourmet Kitchen",
      "Media Room",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    mlsNumber: "RX-10891234",
    listedDate: "2024-11-01",
  },
  {
    id: 2,
    slug: "palm-beach-penthouse",
    title: "Palm Beach Penthouse",
    address: "200 Worth Ave",
    city: "Palm Beach",
    state: "FL",
    zip: "33480",
    price: "$3,800,000",
    priceNumber: 3800000,
    beds: 3,
    baths: 4,
    sqft: "4,500",
    sqftNumber: 4500,
    type: "Condo",
    status: "For Sale",
    yearBuilt: 2018,
    lotSize: "N/A",
    parking: "2 assigned spaces",
    description: `Exceptional penthouse in the heart of Palm Beach's iconic Worth Avenue. This sophisticated residence offers panoramic views of the ocean and Intracoastal from every room.

The great room features 12-foot ceilings, a marble fireplace, and walls of glass leading to wrap-around terraces. The designer kitchen includes custom Italian cabinetry and premium appliances. The primary suite is a private retreat with ocean views, a luxurious bathroom, and expansive closet space.

Building amenities include 24-hour concierge, oceanfront pool, fitness center, and private beach access. Walk to world-class shopping, dining, and cultural attractions.`,
    features: [
      "Ocean Views",
      "Wrap-Around Terrace",
      "Concierge Service",
      "Beach Access",
      "Fitness Center",
      "Pool",
      "Prime Location",
      "Marble Floors",
    ],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752229-250ed79470f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    mlsNumber: "RX-10890567",
    listedDate: "2024-10-20",
  },
  {
    id: 3,
    slug: "golf-course-estate",
    title: "Golf Course Estate",
    address: "789 Country Club Dr",
    city: "Jupiter",
    state: "FL",
    zip: "33458",
    price: "$2,950,000",
    priceNumber: 2950000,
    beds: 5,
    baths: 5,
    sqft: "5,800",
    sqftNumber: 5800,
    type: "Single Family",
    status: "For Sale",
    yearBuilt: 2016,
    lotSize: "0.65 acres",
    parking: "3-car garage",
    description: `Magnificent estate home overlooking the 15th fairway of a prestigious championship golf course. This beautifully designed residence offers luxury living in one of Jupiter's most sought-after communities.

The impressive entry opens to a formal living room with golf course views. The chef's kitchen features a large island, butler's pantry, and opens to the family room. The primary suite includes a sitting area, dual closets, and a spa-inspired bathroom.

Outdoor living is exceptional with a covered lanai, summer kitchen, pool and spa, and unobstructed golf course views. The community offers world-class amenities including golf, tennis, and a clubhouse.`,
    features: [
      "Golf Course Views",
      "Pool & Spa",
      "Summer Kitchen",
      "Gated Community",
      "Tennis Courts",
      "Club Membership",
      "Wine Room",
      "Home Office",
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    mlsNumber: "RX-10889876",
    listedDate: "2024-09-15",
  },
  {
    id: 4,
    slug: "delray-beach-retreat",
    title: "Delray Beach Retreat",
    address: "321 Atlantic Ave",
    city: "Delray Beach",
    state: "FL",
    zip: "33444",
    price: "$1,850,000",
    priceNumber: 1850000,
    beds: 4,
    baths: 3,
    sqft: "3,200",
    sqftNumber: 3200,
    type: "Single Family",
    status: "For Sale",
    yearBuilt: 2020,
    lotSize: "0.25 acres",
    parking: "2-car garage",
    description: `Charming coastal retreat just steps from Atlantic Avenue's vibrant shops, restaurants, and beach. This newly constructed home blends classic Florida architecture with modern luxury.

The bright, open interior features high ceilings, hardwood floors, and designer finishes throughout. The kitchen includes custom cabinetry, quartz countertops, and high-end appliances. Multiple living areas provide flexibility for everyday living and entertaining.

The private backyard oasis features a heated pool, covered patio, and lush landscaping. The primary suite offers a peaceful retreat with spa bathroom and custom closets. Three additional bedrooms provide comfortable guest accommodations.`,
    features: [
      "Walk to Beach",
      "Heated Pool",
      "New Construction",
      "Hardwood Floors",
      "Impact Windows",
      "Outdoor Kitchen",
      "Fenced Yard",
      "Smart Home",
    ],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    mlsNumber: "RX-10888765",
    listedDate: "2024-11-10",
  },
  {
    id: 5,
    slug: "luxury-marina-condo",
    title: "Luxury Marina Condo",
    address: "555 Marina Blvd",
    city: "West Palm Beach",
    state: "FL",
    zip: "33401",
    price: "$1,450,000",
    priceNumber: 1450000,
    beds: 2,
    baths: 2,
    sqft: "2,100",
    sqftNumber: 2100,
    type: "Condo",
    status: "For Sale",
    yearBuilt: 2022,
    lotSize: "N/A",
    parking: "2 assigned spaces",
    description: `Sophisticated waterfront condo in West Palm Beach's premier marina community. This stunning residence offers spectacular views of the marina, Intracoastal, and city skyline.

The contemporary open floor plan features floor-to-ceiling windows, porcelain tile floors, and custom lighting. The kitchen boasts Italian cabinetry, quartz countertops, and Bosch appliances. The spacious primary suite includes a walk-in closet and luxurious bathroom with dual vanities.

Resort-style amenities include a rooftop pool and lounge, state-of-the-art fitness center, private marina with boat slips, and 24-hour security. Walking distance to Clematis Street dining and entertainment.`,
    features: [
      "Marina Views",
      "Boat Slip Available",
      "Rooftop Pool",
      "Fitness Center",
      "24-Hour Security",
      "Pet Friendly",
      "Storage Unit",
      "EV Charging",
    ],
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    mlsNumber: "RX-10887654",
    listedDate: "2024-10-05",
  },
  {
    id: 6,
    slug: "spanish-colonial-estate",
    title: "Spanish Colonial Estate",
    address: "888 El Vedado Rd",
    city: "Palm Beach",
    state: "FL",
    zip: "33480",
    price: "$8,500,000",
    priceNumber: 8500000,
    beds: 7,
    baths: 9,
    sqft: "10,500",
    sqftNumber: 10500,
    type: "Luxury Estate",
    status: "For Sale",
    yearBuilt: 2015,
    lotSize: "0.85 acres",
    parking: "4-car garage",
    description: `Exquisite Spanish Colonial estate on one of Palm Beach's most prestigious streets. This architectural gem combines old-world elegance with modern luxury and craftsmanship.

Enter through an impressive courtyard to discover soaring ceilings, handcrafted millwork, and imported stone floors. The formal living and dining rooms are perfect for elegant entertaining. The gourmet kitchen features custom cabinetry, premium appliances, and a breakfast room overlooking the gardens.

The primary suite occupies a private wing with sitting room, dual bathrooms, and walk-in closets. Six additional bedroom suites offer comfortable accommodations. Outdoor amenities include a courtyard with fountain, resort pool, cabana, and manicured gardens.`,
    features: [
      "Courtyard Entry",
      "Resort Pool",
      "Cabana",
      "Wine Cellar",
      "Library",
      "Staff Quarters",
      "Generator",
      "Hurricane Shutters",
    ],
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    mlsNumber: "RX-10886543",
    listedDate: "2024-08-20",
  },
];

export const allProperties = [featuredProperty, ...listings];

export function getPropertyBySlug(slug: string): Property | undefined {
  return allProperties.find((p) => p.slug === slug);
}

export function getPropertyById(id: number): Property | undefined {
  return allProperties.find((p) => p.id === id);
}
