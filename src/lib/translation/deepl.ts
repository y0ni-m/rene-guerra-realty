const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

/**
 * Translate text using DeepL API
 */
export async function translateWithDeepL(
  text: string,
  targetLang: "ES" | "EN" = "ES"
): Promise<string | null> {
  if (!DEEPL_API_KEY) {
    console.warn("[DeepL] API key not configured");
    return null;
  }

  if (!text || text.trim().length === 0) {
    return text;
  }

  try {
    const response = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[DeepL] API error:", response.status, error);
      return null;
    }

    const data: DeepLResponse = await response.json();
    return data.translations[0]?.text || null;
  } catch (error) {
    console.error("[DeepL] Translation error:", error);
    return null;
  }
}

/**
 * Translate multiple texts in batch (more efficient)
 */
export async function translateBatchWithDeepL(
  texts: string[],
  targetLang: "ES" | "EN" = "ES"
): Promise<(string | null)[]> {
  if (!DEEPL_API_KEY) {
    console.warn("[DeepL] API key not configured");
    return texts.map(() => null);
  }

  const validTexts = texts.filter(t => t && t.trim().length > 0);
  if (validTexts.length === 0) {
    return texts;
  }

  try {
    const params = new URLSearchParams();
    validTexts.forEach(text => params.append("text", text));
    params.append("target_lang", targetLang);

    const response = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      console.error("[DeepL] Batch API error:", response.status);
      return texts.map(() => null);
    }

    const data: DeepLResponse = await response.json();

    // Map back to original array positions
    let translationIndex = 0;
    return texts.map(text => {
      if (!text || text.trim().length === 0) {
        return text;
      }
      return data.translations[translationIndex++]?.text || null;
    });
  } catch (error) {
    console.error("[DeepL] Batch translation error:", error);
    return texts.map(() => null);
  }
}
