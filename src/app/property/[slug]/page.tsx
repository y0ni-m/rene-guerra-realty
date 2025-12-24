import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListingByIdOrSlug, getAllPropertySlugs } from "@/lib/listings";
import PropertyDetail from "@/components/PropertyDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getListingByIdOrSlug(slug);

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  return {
    title: `${property.title} | ${property.city}, ${property.state}`,
    description: `${property.beds} bed, ${property.baths} bath, ${property.sqft} sqft ${property.type.toLowerCase()} in ${property.city}, ${property.state}. ${property.price}. ${property.description.substring(0, 150)}...`,
    openGraph: {
      title: `${property.title} - ${property.price}`,
      description: `${property.beds} bed, ${property.baths} bath, ${property.sqft} sqft in ${property.city}, ${property.state}`,
      images: [
        {
          url: property.images[0],
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await getListingByIdOrSlug(slug);

  if (!property) {
    notFound();
  }

  return <PropertyDetail property={property} />;
}
