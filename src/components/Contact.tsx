"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ScrollAnimation from "./ScrollAnimation";

export default function Contact() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    interest: "buying",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert(t("form.success"));
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      interest: "buying",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Content */}
          <ScrollAnimation direction="left">
            <div>
              <p className="text-[var(--muted)] text-[11px] tracking-[0.3em] uppercase mb-4">
                {t("overline")}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--foreground)] mb-6">
                {t("title")}
              </h2>
              <div className="w-16 h-[1px] bg-[var(--border)] mb-8" />

              <p className="text-[var(--muted)] leading-relaxed mb-12 max-w-md">
                {t("description")}
              </p>

              {/* Contact Details */}
              <div className="space-y-8">
                <div>
                  <p className="text-[var(--muted)] text-[10px] tracking-[0.2em] uppercase mb-2">
                    {t("telephone")}
                  </p>
                  <a href="tel:+15618021137" className="text-[var(--foreground)] text-lg hover:opacity-70 transition-opacity">
                    (561) 802-1137
                  </a>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-[10px] tracking-[0.2em] uppercase mb-2">
                    {t("email")}
                  </p>
                  <a href="mailto:contact@reneguerrarealtor.com" className="text-[var(--foreground)] text-lg hover:opacity-70 transition-opacity">
                    contact@reneguerrarealtor.com
                  </a>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-[10px] tracking-[0.2em] uppercase mb-2">
                    {t("location")}
                  </p>
                  <p className="text-[var(--foreground)] text-lg">
                    {t("locationValue")}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-[10px] tracking-[0.2em] uppercase mb-2">
                    {t("hours")}
                  </p>
                  <p className="text-[var(--muted)] text-sm">
                    {t("hoursWeekday")}<br />
                    {t("hoursSaturday")}<br />
                    {t("hoursSunday")}
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Form */}
          <ScrollAnimation direction="right" delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder={t("form.name")}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-4 bg-transparent border-b border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] text-sm tracking-wide focus:outline-none focus:border-[var(--foreground)] transition-colors"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={t("form.email")}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-4 bg-transparent border-b border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] text-sm tracking-wide focus:outline-none focus:border-[var(--foreground)] transition-colors"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t("form.phone")}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-0 py-4 bg-transparent border-b border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] text-sm tracking-wide focus:outline-none focus:border-[var(--foreground)] transition-colors"
                />
              </div>

              <div>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full px-0 py-4 bg-transparent border-b border-[var(--border)] text-[var(--foreground)] text-sm tracking-wide focus:outline-none focus:border-[var(--foreground)] transition-colors appearance-none cursor-pointer"
                >
                  <option value="buying" className="bg-[var(--background)] text-[var(--foreground)]">{t("form.buying")}</option>
                  <option value="selling" className="bg-[var(--background)] text-[var(--foreground)]">{t("form.selling")}</option>
                  <option value="renting" className="bg-[var(--background)] text-[var(--foreground)]">{t("form.renting")}</option>
                  <option value="investment" className="bg-[var(--background)] text-[var(--foreground)]">{t("form.investment")}</option>
                  <option value="other" className="bg-[var(--background)] text-[var(--foreground)]">{t("form.other")}</option>
                </select>
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder={t("form.message")}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-0 py-4 bg-transparent border-b border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] text-sm tracking-wide focus:outline-none focus:border-[var(--foreground)] transition-colors resize-none"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto px-12 py-4"
                >
                  {t("form.submit")}
                </button>
              </div>
            </form>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
