import { NextResponse } from "next/server";
import { getAgentListings, getFeaturedProperty } from "@/lib/listings";

export async function GET() {
  try {
    const [listings, featured] = await Promise.all([
      getAgentListings(),
      getFeaturedProperty(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        listings,
        featured,
      },
    });
  } catch (error) {
    console.error("[API] Error fetching agent listings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch agent listings",
      },
      { status: 500 }
    );
  }
}
