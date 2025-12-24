import { NextRequest, NextResponse } from "next/server";
import { getListingByIdOrSlug } from "@/lib/listings";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await getListingByIdOrSlug(id);

    if (!listing) {
      return NextResponse.json(
        {
          success: false,
          error: "Listing not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("[API] Error fetching listing:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch listing",
      },
      { status: 500 }
    );
  }
}
