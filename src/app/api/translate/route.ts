import { NextRequest, NextResponse } from "next/server";
import { translateBatch, translateProperty } from "@/lib/translation/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { texts, property, targetLang = "es" } = body;

    // Validate target language
    if (targetLang !== "es" && targetLang !== "en") {
      return NextResponse.json(
        { error: "Invalid target language. Use 'es' or 'en'" },
        { status: 400 }
      );
    }

    // If English, return as-is (no translation needed)
    if (targetLang === "en") {
      if (property) {
        return NextResponse.json({ property });
      }
      return NextResponse.json({ translations: texts || [] });
    }

    // Translate property object
    if (property) {
      const translated = await translateProperty(property, targetLang);
      return NextResponse.json({ property: translated });
    }

    // Translate array of texts
    if (texts && Array.isArray(texts)) {
      const translations = await translateBatch(texts, targetLang);
      return NextResponse.json({ translations });
    }

    return NextResponse.json(
      { error: "Provide either 'texts' array or 'property' object" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Translate API] Error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
