import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Supabase Keep-Alive Cron Endpoint
 * Schedule: Every 4 days (or external cron trigger)
 * Purpose: Performs a lightweight read operation to reset Supabase's 7-day inactivity pause timer.
 */
export async function GET(req: Request) {
  return handleKeepAlive(req);
}

export async function POST(req: Request) {
  return handleKeepAlive(req);
}

async function handleKeepAlive(req: Request) {
  const startTime = Date.now();
  const url = new URL(req.url);

  // Optional: check CRON_SECRET if configured in .env / Vercel
  const authHeader = req.headers.get("authorization");
  const querySecret = url.searchParams.get("key");
  const configuredSecret = process.env.CRON_SECRET;

  if (configuredSecret) {
    const isAuthorized =
      authHeader === `Bearer ${configuredSecret}` ||
      querySecret === configuredSecret;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or missing cron secret.",
        },
        { status: 401 }
      );
    }
  }

  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      {
        success: false,
        error: "Supabase credentials are not configured on this server.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }

  try {
    // 1. Perform a lightweight read against an existing table to trigger database activity
    const { data: newsData, error: newsError } = await supabaseAdmin
      .from("news")
      .select("id")
      .limit(1);

    // Fallback attempt in case news table is empty or different
    let recordsFound = newsData ? newsData.length : 0;
    let queryTarget = "news";

    if (newsError) {
      console.warn("Keep-alive probe on 'news' returned note:", newsError.message);
      // Try admin_users or quote_inquiries
      const { data: fallbackData, error: fallbackError } = await supabaseAdmin
        .from("admin_users")
        .select("id")
        .limit(1);

      if (fallbackError) {
        throw new Error(
          `Supabase ping failed on tables: ${newsError.message} | ${fallbackError.message}`
        );
      }
      recordsFound = fallbackData ? fallbackData.length : 0;
      queryTarget = "admin_users";
    }

    const latencyMs = Date.now() - startTime;
    const nowIso = new Date().toISOString();

    return NextResponse.json({
      success: true,
      status: "active",
      message: "Supabase database pinged successfully. Inactivity timer reset.",
      tableQueried: queryTarget,
      recordsFound,
      latencyMs,
      timestamp: nowIso,
      nextScheduledInDays: 4,
    });
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Supabase keep-alive cron error:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        status: "error",
        error: errorMessage,
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
