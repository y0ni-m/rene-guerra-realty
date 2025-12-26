import { supabaseAdmin } from "../supabase/client";
import { translateWithDeepL, translateBatchWithDeepL } from "./deepl";

interface CachedTranslation {
  source_text: string;
  translated_text: string;
}

/**
 * Get cached translation from Supabase
 */
async function getCachedTranslation(
  text: string,
  targetLang: string
): Promise<string | null> {
  if (!supabaseAdmin) return null;

  try {
    const { data } = await supabaseAdmin
      .from("translations")
      .select("translated_text")
      .eq("source_text", text)
      .eq("target_lang", targetLang)
      .single<{ translated_text: string }>();

    return data?.translated_text || null;
  } catch {
    return null;
  }
}

/**
 * Get multiple cached translations
 */
async function getCachedTranslations(
  texts: string[],
  targetLang: string
): Promise<Map<string, string>> {
  if (!supabaseAdmin || texts.length === 0) return new Map();

  try {
    const { data } = await supabaseAdmin
      .from("translations")
      .select("source_text, translated_text")
      .eq("target_lang", targetLang)
      .in("source_text", texts);

    const cache = new Map<string, string>();
    (data as CachedTranslation[] || []).forEach((row) => {
      cache.set(row.source_text, row.translated_text);
    });
    return cache;
  } catch {
    return new Map();
  }
}

/**
 * Cache a translation in Supabase
 */
async function cacheTranslation(
  sourceText: string,
  translatedText: string,
  targetLang: string
): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any)
      .from("translations")
      .upsert({
        source_text: sourceText,
        target_lang: targetLang,
        translated_text: translatedText,
        source_lang: "en",
      }, { onConflict: "source_text,source_lang,target_lang" });
  } catch (error) {
    console.error("[Translation] Cache error:", error);
  }
}

/**
 * Translate a single text with caching
 */
export async function translate(
  text: string,
  targetLang: "es" | "en" = "es"
): Promise<string> {
  if (!text || targetLang === "en") return text;

  // Check cache first
  const cached = await getCachedTranslation(text, targetLang);
  if (cached) return cached;

  // Translate with DeepL
  const translated = await translateWithDeepL(text, "ES");
  if (translated) {
    // Cache for future use
    await cacheTranslation(text, translated, targetLang);
    return translated;
  }

  return text;
}

/**
 * Translate multiple texts with caching (batch)
 */
export async function translateBatch(
  texts: string[],
  targetLang: "es" | "en" = "es"
): Promise<string[]> {
  if (targetLang === "en" || texts.length === 0) return texts;

  // Get cached translations
  const cache = await getCachedTranslations(texts, targetLang);

  // Find texts that need translation
  const toTranslate: { index: number; text: string }[] = [];
  texts.forEach((text, index) => {
    if (text && !cache.has(text)) {
      toTranslate.push({ index, text });
    }
  });

  // If all cached, return immediately
  if (toTranslate.length === 0) {
    return texts.map(text => cache.get(text) || text);
  }

  // Translate missing texts
  const translated = await translateBatchWithDeepL(
    toTranslate.map(t => t.text),
    "ES"
  );

  // Cache new translations
  for (let i = 0; i < toTranslate.length; i++) {
    const original = toTranslate[i].text;
    const result = translated[i];
    if (result) {
      cache.set(original, result);
      await cacheTranslation(original, result, targetLang);
    }
  }

  // Return all translations
  return texts.map(text => cache.get(text) || text);
}

/**
 * Translate a property listing object
 */
export async function translateProperty(
  property: {
    description?: string;
    features?: string[];
    type?: string;
    status?: string;
    parking?: string;
    lotSize?: string;
  },
  targetLang: "es" | "en" = "es"
): Promise<typeof property> {
  if (targetLang === "en") return property;

  const textsToTranslate: string[] = [];
  const keys: string[] = [];

  // Collect texts to translate
  if (property.description) {
    textsToTranslate.push(property.description);
    keys.push("description");
  }
  if (property.type) {
    textsToTranslate.push(property.type);
    keys.push("type");
  }
  if (property.status) {
    textsToTranslate.push(property.status);
    keys.push("status");
  }
  if (property.parking) {
    textsToTranslate.push(property.parking);
    keys.push("parking");
  }
  if (property.lotSize) {
    textsToTranslate.push(property.lotSize);
    keys.push("lotSize");
  }
  if (property.features) {
    property.features.forEach((f, i) => {
      textsToTranslate.push(f);
      keys.push(`feature_${i}`);
    });
  }

  // Batch translate
  const translated = await translateBatch(textsToTranslate, targetLang);

  // Reconstruct property object
  const result = { ...property };
  const translatedFeatures: string[] = [];

  keys.forEach((key, i) => {
    if (key === "description") result.description = translated[i];
    else if (key === "type") result.type = translated[i];
    else if (key === "status") result.status = translated[i];
    else if (key === "parking") result.parking = translated[i];
    else if (key === "lotSize") result.lotSize = translated[i];
    else if (key.startsWith("feature_")) translatedFeatures.push(translated[i]);
  });

  if (translatedFeatures.length > 0) {
    result.features = translatedFeatures;
  }

  return result;
}
