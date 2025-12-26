"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <span className="font-serif text-xl tracking-[0.2em] text-[var(--foreground)]">
                RENE GUERRA
              </span>
              <p className="text-[var(--muted)] text-[10px] tracking-[0.3em] uppercase mt-1">
                Partnership Realty
              </p>
            </div>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[var(--foreground)] text-[11px] tracking-[0.2em] uppercase mb-6">
              {t("navigation")}
            </p>
            <ul className="space-y-4">
              {[
                { href: "#listings", label: tNav("properties") },
                { href: "#featured", label: tNav("featured") },
                { href: "#about", label: tNav("about") },
                { href: "#contact", label: tNav("contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--muted)] text-sm hover:text-[var(--foreground)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-[var(--foreground)] text-[11px] tracking-[0.2em] uppercase mb-6">
              {t("services")}
            </p>
            <ul className="space-y-4 text-[var(--muted)] text-sm">
              <li>{t("buyerRep")}</li>
              <li>{t("sellerRep")}</li>
              <li>{t("marketAnalysis")}</li>
              <li>{t("investmentAdvisory")}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[var(--foreground)] text-[11px] tracking-[0.2em] uppercase mb-6">
              {tNav("contact")}
            </p>
            <ul className="space-y-4 text-[var(--muted)] text-sm">
              <li>Palm Beach County, Florida</li>
              <li>
                <a href="tel:+15618021137" className="hover:text-[var(--foreground)] transition-colors">
                  (561) 802-1137
                </a>
              </li>
              <li>
                <a href="mailto:contact@reneguerrarealtor.com" className="hover:text-[var(--foreground)] transition-colors">
                  contact@reneguerrarealtor.com
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="flex space-x-4 mt-6">
              {["Instagram", "LinkedIn", "Facebook"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-[var(--muted)] text-[11px] tracking-wider uppercase hover:text-[var(--foreground)] transition-colors"
                >
                  {social.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--muted)] text-[11px] tracking-wider">
            &copy; {currentYear} {t("copyright")}
          </p>
          <div className="flex space-x-8 text-[var(--muted)] text-[11px] tracking-wider">
            <Link href="#" className="hover:text-[var(--foreground)] transition-colors">
              {t("privacy")}
            </Link>
            <Link href="#" className="hover:text-[var(--foreground)] transition-colors">
              {t("terms")}
            </Link>
            <span>{t("mlsLicensed")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
