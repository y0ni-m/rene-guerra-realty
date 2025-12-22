"use client";

import Image from "next/image";
import Link from "next/link";
import { featuredProperty } from "@/data/listings";
import ScrollAnimation, { StaggerContainer, StaggerItem } from "./ScrollAnimation";

export default function FeaturedProperty() {
  return (
    <section id="featured" className="py-16 md:py-24 bg-[var(--warm-gray)] dark:bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollAnimation className="text-center mb-16">
          <p className="text-[var(--muted)] text-[11px] tracking-[0.3em] uppercase mb-4">
            Featured Listing
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)]">
            Featured Home
          </h2>
          <div className="section-divider mx-auto mt-6" />
        </ScrollAnimation>

        {/* Featured Property */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <ScrollAnimation direction="left" delay={0.1}>
            <Link href={`/property/${featuredProperty.slug}`} className="relative h-[500px] lg:h-[600px] group overflow-hidden block">
              <Image
                src={featuredProperty.images[0]}
                alt={featuredProperty.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="image-overlay" />
              <div className="absolute bottom-8 left-8">
                <span className="text-white/70 text-[10px] tracking-[0.2em] uppercase">
                  Featured
                </span>
              </div>
            </Link>
          </ScrollAnimation>

          {/* Content */}
          <ScrollAnimation direction="right" delay={0.2}>
            <div className="bg-[var(--background)] dark:bg-[var(--charcoal)] p-8 lg:p-16 flex flex-col justify-center h-full">
              <p className="text-[var(--muted)] text-[11px] tracking-[0.2em] uppercase mb-4">
                {featuredProperty.city}, {featuredProperty.state}
              </p>

              <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[var(--foreground)] mb-4">
                {featuredProperty.title}
              </h3>

              <p className="text-[var(--foreground)] text-2xl font-light mb-6">
                {featuredProperty.price}
              </p>

              {/* Stats */}
              <div className="flex space-x-8 mb-8 pb-8 border-b border-[var(--border)]">
                <div>
                  <span className="text-[var(--foreground)] text-xl">{featuredProperty.beds}</span>
                  <span className="text-[var(--muted)] text-sm ml-2">Beds</span>
                </div>
                <div>
                  <span className="text-[var(--foreground)] text-xl">{featuredProperty.baths}</span>
                  <span className="text-[var(--muted)] text-sm ml-2">Baths</span>
                </div>
                <div>
                  <span className="text-[var(--foreground)] text-xl">{featuredProperty.sqft}</span>
                  <span className="text-[var(--muted)] text-sm ml-2">Sq Ft</span>
                </div>
              </div>

              <p className="text-[var(--muted)] leading-relaxed mb-8 line-clamp-3">
                {featuredProperty.description.split("\n\n")[0]}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-3 mb-10">
                {featuredProperty.features.slice(0, 4).map((feature) => (
                  <span
                    key={feature}
                    className="px-4 py-2 border border-[var(--border)] text-[var(--muted)] text-[11px] tracking-wider uppercase"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/property/${featuredProperty.slug}`}
                  className="btn-primary px-8 py-4 text-center"
                >
                  View Property
                </Link>
                <button className="btn-outline px-8 py-4">
                  Schedule Tour
                </button>
              </div>
            </div>
          </ScrollAnimation>
        </div>

        {/* Gallery Strip */}
        <StaggerContainer className="grid grid-cols-3 gap-1 mt-1" staggerDelay={0.1}>
          {featuredProperty.images.slice(1, 4).map((img, index) => (
            <StaggerItem key={index}>
              <Link
                href={`/property/${featuredProperty.slug}`}
                className="relative h-32 md:h-48 group overflow-hidden block"
              >
                <Image
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
