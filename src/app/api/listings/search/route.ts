import { NextRequest, NextResponse } from "next/server";
import { searchListings } from "@/lib/listings";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Search query is required",
        },
        { status: 400 }
      );
    }

    const results = await searchListings(query);

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        query,
        count: results.length,
      },
    });
  } catch (error) {
    console.error("[API] Search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Search failed",
      },
      { status: 500 }
    );
  }
}
