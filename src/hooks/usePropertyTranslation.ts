"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface TranslatableProperty {
  description?: string;
  features?: string[];
  type?: string;
  status?: string;
  parking?: string;
  lotSize?: string;
}

export function usePropertyTranslation<T extends TranslatableProperty>(
  property: T | null
): { translatedProperty: T | null; isTranslating: boolean } {
  const { locale } = useLanguage();
  const [translatedProperty, setTranslatedProperty] = useState<T | null>(property);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Reset to original when property changes
    setTranslatedProperty(property);

    // Skip translation for English or if no property
    if (locale === "en" || !property) {
      return;
    }

    // Translate for Spanish
    const translateProperty = async () => {
      setIsTranslating(true);
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            property: {
              description: property.description,
              features: property.features,
              type: property.type,
              status: property.status,
              parking: property.parking,
              lotSize: property.lotSize,
            },
            targetLang: locale,
          }),
        });

        if (response.ok) {
          const { property: translated } = await response.json();
          setTranslatedProperty({
            ...property,
            ...translated,
          });
        }
      } catch (error) {
        console.error("[Translation] Failed:", error);
        // Keep original on error
      } finally {
        setIsTranslating(false);
      }
    };

    translateProperty();
  }, [property, locale]);

  return { translatedProperty, isTranslating };
}

export function useTextTranslation(
  texts: string[]
): { translatedTexts: string[]; isTranslating: boolean } {
  const { locale } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(texts);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Reset when texts change
    setTranslatedTexts(texts);

    // Skip translation for English or empty array
    if (locale === "en" || texts.length === 0) {
      return;
    }

    const translateTexts = async () => {
      setIsTranslating(true);
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts, targetLang: locale }),
        });

        if (response.ok) {
          const { translations } = await response.json();
          setTranslatedTexts(translations);
        }
      } catch (error) {
        console.error("[Translation] Failed:", error);
      } finally {
        setIsTranslating(false);
      }
    };

    translateTexts();
  }, [texts, locale]);

  return { translatedTexts, isTranslating };
}
