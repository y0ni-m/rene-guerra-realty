"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Check if we're on a page without a hero image (like property detail pages)
  const isDetailPage = pathname.startsWith("/property/");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#listings", label: "Properties" },
    { href: "#featured", label: "Featured" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  // On detail pages, always show solid background
  // On home page, show transparent until scrolled or mobile menu is open
  const showSolidBg = isDetailPage || isScrolled || isMobileMenuOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showSolidBg
          ? "bg-[var(--background)] border-b border-[var(--border)] py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex flex-col">
              <span
                className={`font-serif text-xl tracking-[0.2em] transition-colors ${
                  showSolidBg ? "text-[var(--foreground)]" : "text-white"
                }`}
              >
                RENE GUERRA
              </span>
              <span
                className={`text-[10px] tracking-[0.3em] uppercase transition-colors ${
                  showSolidBg ? "text-[var(--muted)]" : "text-white/70"
                }`}
              >
                Partnership Realty
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={isDetailPage ? `/${link.href}` : link.href}
                className={`text-[11px] tracking-[0.2em] uppercase transition-colors underline-animate ${
                  showSolidBg
                    ? "text-[var(--foreground)]"
                    : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 transition-colors ${
                showSolidBg ? "text-[var(--foreground)]" : "text-white"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            <Link
              href={isDetailPage ? "/#contact" : "#contact"}
              className={`btn-primary px-6 py-3 ${
                showSolidBg ? "" : "!bg-white !text-black"
              }`}
            >
              Inquire
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 transition-colors ${
                showSolidBg ? "text-[var(--foreground)]" : "text-white"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-4 relative flex flex-col justify-between">
                <span
                  className={`w-full h-[1px] transition-all ${
                    showSolidBg ? "bg-[var(--foreground)]" : "bg-white"
                  } ${isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
                />
                <span
                  className={`w-full h-[1px] transition-all ${
                    showSolidBg ? "bg-[var(--foreground)]" : "bg-white"
                  } ${isMobileMenuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`w-full h-[1px] transition-all ${
                    showSolidBg ? "bg-[var(--foreground)]" : "bg-white"
                  } ${isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-8 pb-4 flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={isDetailPage ? `/${link.href}` : link.href}
                className={`text-[11px] tracking-[0.2em] uppercase ${
                  showSolidBg ? "text-[var(--foreground)]" : "text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={isDetailPage ? "/#contact" : "#contact"}
              className="btn-primary px-6 py-3 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inquire
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
