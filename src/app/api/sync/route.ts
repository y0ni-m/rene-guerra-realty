import { NextRequest, NextResponse } from "next/server";
import { syncMlsToSupabase, getLastSyncStatus } from "@/lib/supabase/sync";

const SYNC_API_SECRET = process.env.SYNC_API_SECRET;

export async function POST(request: NextRequest) {
  // Verify secret
  const authHeader = request.headers.get("authorization");
  const providedSecret = authHeader?.replace("Bearer ", "");

  if (!SYNC_API_SECRET || providedSecret !== SYNC_API_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await syncMlsToSupabase();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Sync completed successfully",
        listingsSynced: result.listingsSynced,
        photosSynced: result.photosSynced,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          listingsSynced: result.listingsSynced,
          photosSynced: result.photosSynced,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[API] Sync error:", error);
    return NextResponse.json(
      { error: "Sync failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const lastSync = await getLastSyncStatus();

    return NextResponse.json({
      lastSync: lastSync || null,
    });
  } catch (error) {
    console.error("[API] Failed to get sync status:", error);
    return NextResponse.json(
      { error: "Failed to get sync status" },
      { status: 500 }
    );
  }
}
