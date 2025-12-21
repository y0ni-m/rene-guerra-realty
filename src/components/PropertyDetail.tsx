"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/data/listings";
import reneHeadshot from "@/media/rene-headshot.jpg";

interface Props {
  property: Property;
}

export default function PropertyDetail({ property }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in ${property.title} at ${property.address}, ${property.city}.`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your inquiry. Rene will be in touch shortly.");
    setShowContactForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="pt-20 bg-[var(--background)]">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-3 text-[11px] tracking-wider">
            <Link href="/" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              Home
            </Link>
            <span className="text-[var(--muted)]">/</span>
            <Link href="/#listings" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              Properties
            </Link>
            <span className="text-[var(--muted)]">/</span>
            <span className="text-[var(--foreground)]">{property.city}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src={property.images[activeImage]}
          alt={property.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="image-overlay" />

        {/* Image Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4">
          <button
            onClick={() => setActiveImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
            className="w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-white/80 text-sm tracking-wider">
            {activeImage + 1} / {property.images.length}
          </span>
          <button
            onClick={() => setActiveImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
            className="w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-8 left-8">
          <span className="text-white/80 text-[10px] tracking-[0.2em] uppercase">
            {property.status}
          </span>
        </div>
      </section>

      {/* Thumbnail Strip */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-1">
        {property.images.slice(0, 6).map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(index)}
            className={`relative h-20 md:h-24 overflow-hidden ${
              activeImage === index ? "ring-2 ring-[var(--foreground)]" : ""
            }`}
          >
            <Image
              src={img}
              alt={`View ${index + 1}`}
              fill
              className="object-cover hover:opacity-80 transition-opacity"
              sizes="16vw"
            />
          </button>
        ))}
      </div>

      {/* Property Info */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-12">
                <p className="text-[var(--muted)] text-[11px] tracking-[0.2em] uppercase mb-3">
                  {property.city}, {property.state}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)] mb-4">
                  {property.title}
                </h1>
                <p className="text-[var(--muted)] text-lg mb-6">
                  {property.address}, {property.city}, {property.state} {property.zip}
                </p>
                <p className="text-[var(--foreground)] text-3xl font-light">
                  {property.price}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 py-8 border-y border-[var(--border)] mb-12">
                <div>
                  <p className="font-serif text-2xl text-[var(--foreground)]">{property.beds}</p>
                  <p className="text-[var(--muted)] text-sm">Bedrooms</p>
                </div>
                <div>
                  <p className="font-serif text-2xl text-[var(--foreground)]">{property.baths}</p>
                  <p className="text-[var(--muted)] text-sm">Bathrooms</p>
                </div>
                <div>
                  <p className="font-serif text-2xl text-[var(--foreground)]">{property.sqft}</p>
                  <p className="text-[var(--muted)] text-sm">Sq Ft</p>
                </div>
                <div>
                  <p className="font-serif text-2xl text-[var(--foreground)]">{property.yearBuilt}</p>
                  <p className="text-[var(--muted)] text-sm">Year Built</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-12">
                <h2 className="font-serif text-2xl text-[var(--foreground)] mb-6">
                  Overview
                </h2>
                <div className="space-y-4">
                  {property.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-[var(--muted)] leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-12">
                <h2 className="font-serif text-2xl text-[var(--foreground)] mb-6">
                  Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="w-1 h-1 bg-[var(--foreground)]" />
                      <span className="text-[var(--muted)] text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div>
                <h2 className="font-serif text-2xl text-[var(--foreground)] mb-6">
                  Details
                </h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: "Property Type", value: property.type },
                    { label: "Status", value: property.status },
                    { label: "Year Built", value: property.yearBuilt },
                    { label: "Lot Size", value: property.lotSize },
                    { label: "Parking", value: property.parking },
                    { label: "MLS #", value: property.mlsNumber },
                    { label: "Listed", value: formatDate(property.listedDate) },
                    { label: "Living Area", value: `${property.sqft} sq ft` },
                  ].map((detail) => (
                    <div key={detail.label} className="flex justify-between py-3 border-b border-[var(--border)]">
                      <span className="text-[var(--muted)] text-sm">{detail.label}</span>
                      <span className="text-[var(--foreground)] text-sm">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Agent Card */}
                <div className="border border-[var(--border)] p-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image
                        src={reneHeadshot}
                        alt="Rene Guerra"
                        width={80}
                        height={80}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <h3 className="font-serif text-xl text-[var(--foreground)]">
                      Rene Guerra
                    </h3>
                    <p className="text-[var(--muted)] text-sm">Your Local Realtor</p>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="tel:+15615550123"
                      className="block w-full py-3 border border-[var(--foreground)] text-[var(--foreground)] text-center text-[11px] tracking-[0.15em] uppercase hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
                    >
                      +1 (561) 555-0123
                    </a>
                    <button
                      onClick={() => setShowContactForm(!showContactForm)}
                      className="block w-full py-3 bg-[var(--foreground)] text-[var(--background)] text-center text-[11px] tracking-[0.15em] uppercase hover:opacity-80 transition-opacity"
                    >
                      Inquire
                    </button>
                  </div>

                  {/* Contact Form */}
                  {showContactForm && (
                    <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-[var(--border)] space-y-4">
                      <input
                        type="text"
                        placeholder="Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-[var(--border)] bg-transparent text-[var(--foreground)] text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-[var(--border)] bg-transparent text-[var(--foreground)] text-sm"
                      />
                      <textarea
                        placeholder="Message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-[var(--border)] bg-transparent text-[var(--foreground)] text-sm resize-none"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 bg-[var(--foreground)] text-[var(--background)] text-[11px] tracking-[0.15em] uppercase"
                      >
                        Send
                      </button>
                    </form>
                  )}
                </div>

                {/* Tour CTA */}
                <div className="bg-[#1A1A1A] p-8 text-white">
                  <h3 className="font-serif text-xl mb-3">
                    Private Showing
                  </h3>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    Experience this property in person with a private tour.
                  </p>
                  <button className="w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase hover:bg-white/90 transition-colors">
                    Schedule Tour
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button className="flex-1 py-3 border border-[var(--border)] text-[var(--muted)] text-[11px] tracking-wider uppercase hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-colors">
                    Save
                  </button>
                  <button className="flex-1 py-3 border border-[var(--border)] text-[var(--muted)] text-[11px] tracking-wider uppercase hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <Link
            href="/#listings"
            className="inline-flex items-center space-x-3 text-[var(--muted)] text-[11px] tracking-wider uppercase hover:text-[var(--foreground)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>All Properties</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
