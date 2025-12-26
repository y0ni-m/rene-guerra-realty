"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

type Locale = "en" | "es";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Import messages statically for client-side use
import enMessages from "../../messages/en.json";
import esMessages from "../../messages/es.json";

const messages = {
  en: enMessages,
  es: esMessages,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved language preference or browser language
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    const browserLang = navigator.language.startsWith("es") ? "es" : "en";

    if (savedLocale && (savedLocale === "en" || savedLocale === "es")) {
      setLocaleState(savedLocale);
    } else {
      setLocaleState(browserLang);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "es" : "en";
    setLocale(newLocale);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <NextIntlClientProvider locale="en" messages={messages.en}>
        <LanguageContext.Provider value={{ locale: "en", setLocale, toggleLocale }}>
          {children}
        </LanguageContext.Provider>
      </NextIntlClientProvider>
    );
  }

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages[locale]}>
      <LanguageContext.Provider value={{ locale, setLocale, toggleLocale }}>
        {children}
      </LanguageContext.Provider>
    </NextIntlClientProvider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
