"use client";

import Image from "next/image";
import reneHeadshot from "@/media/rene-headshot.jpg";
import ScrollAnimation, { StaggerContainer, StaggerItem } from "./ScrollAnimation";

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <ScrollAnimation direction="left">
            <div className="relative">
              <div className="relative h-[600px] overflow-hidden">
                <Image
                  src={reneHeadshot}
                  alt="Rene Guerra"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                />
              </div>
              {/* Decorative line */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-[var(--border)]" />
            </div>
          </ScrollAnimation>

          {/* Content */}
          <ScrollAnimation direction="right" delay={0.2}>
            <div>
              <p className="text-[var(--muted)] text-[11px] tracking-[0.3em] uppercase mb-4">
                About
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)] mb-6">
                Rene Guerra
              </h2>
              <div className="section-divider mb-8" />

              <p className="text-[var(--muted)] leading-relaxed mb-6">
                With five years of dedicated experience in South Florida&apos;s
                real estate market, Rene Guerra has developed a deep understanding
                of what families need when finding their perfect home.
              </p>

              <p className="text-[var(--muted)] leading-relaxed mb-8">
                Specializing in single family homes throughout Palm Beach County,
                Rene brings a personal approach to every transaction—combining
                local market expertise with a genuine commitment to helping
                clients find the right home for their lifestyle and budget.
              </p>

              {/* Stats */}
              <StaggerContainer className="grid grid-cols-3 gap-8 py-8 border-y border-[var(--border)] mb-8" staggerDelay={0.15}>
                <StaggerItem>
                  <div>
                    <p className="font-serif text-3xl text-[var(--foreground)]">$2M+</p>
                    <p className="text-[var(--muted)] text-sm mt-1">Sales Volume</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div>
                    <p className="font-serif text-3xl text-[var(--foreground)]">20+</p>
                    <p className="text-[var(--muted)] text-sm mt-1">Families Helped</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div>
                    <p className="font-serif text-3xl text-[var(--foreground)]">5</p>
                    <p className="text-[var(--muted)] text-sm mt-1">Years Experience</p>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              {/* Credentials */}
              <div className="space-y-3 text-[var(--muted)] text-sm">
                <p>Licensed Real Estate Agent — Partnership Realty</p>
                <p>Single Family Home Specialist</p>
                <p>Member, Palm Beach Board of Realtors</p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
