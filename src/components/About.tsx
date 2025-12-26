"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import reneHeadshot from "@/media/rene-headshot.jpg";
import ScrollAnimation, { StaggerContainer, StaggerItem } from "./ScrollAnimation";

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-16 md:py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <ScrollAnimation direction="left">
            <div className="relative overflow-hidden">
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                <Image
                  src={reneHeadshot}
                  alt="Rene Guerra"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                />
              </div>
              {/* Decorative line - hidden on mobile */}
              <div className="hidden md:block absolute -bottom-8 -right-8 w-32 h-32 border border-[var(--border)]" />
            </div>
          </ScrollAnimation>

          {/* Content */}
          <ScrollAnimation direction="right" delay={0.2}>
            <div>
              <p className="text-[var(--muted)] text-[11px] tracking-[0.3em] uppercase mb-4">
                {t("overline")}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)] mb-6">
                Rene Guerra
              </h2>
              <div className="section-divider mb-8" />

              <p className="text-[var(--muted)] leading-relaxed mb-6">
                {t("bio1")}
              </p>

              <p className="text-[var(--muted)] leading-relaxed mb-8">
                {t("bio2")}
              </p>

              {/* Stats */}
              <StaggerContainer className="grid grid-cols-3 gap-8 py-8 border-y border-[var(--border)] mb-8" staggerDelay={0.15}>
                <StaggerItem>
                  <div>
                    <p className="font-serif text-3xl text-[var(--foreground)]">$2M+</p>
                    <p className="text-[var(--muted)] text-sm mt-1">{t("salesVolume")}</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div>
                    <p className="font-serif text-3xl text-[var(--foreground)]">20+</p>
                    <p className="text-[var(--muted)] text-sm mt-1">{t("familiesHelped")}</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div>
                    <p className="font-serif text-3xl text-[var(--foreground)]">5</p>
                    <p className="text-[var(--muted)] text-sm mt-1">{t("yearsExperience")}</p>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              {/* Credentials */}
              <div className="space-y-3 text-[var(--muted)] text-sm">
                <p>{t("credential1")}</p>
                <p>{t("credential2")}</p>
                <p>{t("credential3")}</p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
