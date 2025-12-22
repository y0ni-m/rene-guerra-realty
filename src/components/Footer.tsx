import Link from "next/link";

export default function Footer() {
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
              Helping families find their perfect home throughout
              Palm Beach County and South Florida.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[var(--foreground)] text-[11px] tracking-[0.2em] uppercase mb-6">
              Navigation
            </p>
            <ul className="space-y-4">
              {[
                { href: "#listings", label: "Properties" },
                { href: "#featured", label: "Featured" },
                { href: "#about", label: "About" },
                { href: "#contact", label: "Contact" },
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
              Services
            </p>
            <ul className="space-y-4 text-[var(--muted)] text-sm">
              <li>Buyer Representation</li>
              <li>Seller Representation</li>
              <li>Market Analysis</li>
              <li>Investment Advisory</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[var(--foreground)] text-[11px] tracking-[0.2em] uppercase mb-6">
              Contact
            </p>
            <ul className="space-y-4 text-[var(--muted)] text-sm">
              <li>Palm Beach County, Florida</li>
              <li>
                <a href="tel:+15615550123" className="hover:text-[var(--foreground)] transition-colors">
                  +1 (561) 555-0123
                </a>
              </li>
              <li>
                <a href="mailto:rene@reneguerra.com" className="hover:text-[var(--foreground)] transition-colors">
                  rene@reneguerra.com
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
            &copy; {currentYear} Rene Guerra Real Estate
          </p>
          <div className="flex space-x-8 text-[var(--muted)] text-[11px] tracking-wider">
            <Link href="#" className="hover:text-[var(--foreground)] transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-[var(--foreground)] transition-colors">
              Terms
            </Link>
            <span>MLS Licensed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
