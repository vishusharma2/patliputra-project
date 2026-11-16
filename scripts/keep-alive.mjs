#!/usr/bin/env node

/**
 * Standalone Supabase Keep-Alive Script
 *
 * Runs every 4 days to prevent Supabase Free Tier from sleeping / pausing.
 * Can be run via:
 *   1) node scripts/keep-alive.mjs
 *   2) npm run keep-alive
 *   3) GitHub Actions scheduled workflow
 *   4) Windows Task Scheduler / Linux Cron
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Simple .env reader fallback in case not already loaded in environment
function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env");
  if (existsSync(envPath)) {
    try {
      const content = readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          // Remove wrapping quotes if present
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (e) {
      console.warn("Could not read .env file:", e.message);
    }
  }
}

loadEnvFile();

const SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ""
).trim().replace(/\/+$/, "");

const SUPABASE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  ""
).trim();

const APP_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
  process.env.APP_URL ||
  ""
).trim().replace(/\/+$/, "");

const CRON_SECRET = (process.env.CRON_SECRET || "").trim();

async function runKeepAlive() {
  const startTime = Date.now();
  const dateStr = new Date().toISOString();
  console.log("==================================================");
  console.log(`[Supabase Keep-Alive] Started at: ${dateStr}`);
  console.log("==================================================");

  let pingSucceeded = false;

  // 1. Direct Ping to Supabase REST API
  if (SUPABASE_URL && SUPABASE_KEY) {
    console.log(`[1/2] Pinging Supabase REST API at: ${SUPABASE_URL}...`);
    try {
      // Query a lightweight existing table: /rest/v1/news or /rest/v1/admin_users
      const targetEndpoint = `${SUPABASE_URL}/rest/v1/news?select=id&limit=1`;
      const res = await fetch(targetEndpoint, {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "count=none",
        },
      });

      const elapsed = Date.now() - startTime;

      if (res.ok) {
        const body = await res.json().catch(() => null);
        console.log(`✓ Supabase database active! (Status: ${res.status}, Latency: ${elapsed}ms)`);
        console.log(`  Sample Response:`, JSON.stringify(body));
        pingSucceeded = true;
      } else {
        console.warn(`! Endpoint returned status ${res.status}. Attempting fallback probe...`);
        // Fallback to /rest/v1/ or root probe
        const fallbackRes = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: "GET",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
        if (fallbackRes.ok) {
          console.log(`✓ Supabase root REST API active! (Status: ${fallbackRes.status})`);
          pingSucceeded = true;
        } else {
          console.error(`✗ Supabase API ping failed with status ${fallbackRes.status}: ${await fallbackRes.text()}`);
        }
      }
    } catch (err) {
      console.error(`✗ Failed to reach Supabase API:`, err.message);
    }
  } else {
    console.warn("! Supabase URL or Key not set in environment. Skipping direct REST probe.");
  }

  // 2. Ping deployed App keep-alive endpoint if URL is provided
  if (APP_URL) {
    console.log(`[2/2] Pinging App cron endpoint at: ${APP_URL}/api/cron/keep-alive...`);
    try {
      const headers = {};
      if (CRON_SECRET) {
        headers["Authorization"] = `Bearer ${CRON_SECRET}`;
      }
      const appRes = await fetch(`${APP_URL}/api/cron/keep-alive`, {
        method: "GET",
        headers,
      });

      if (appRes.ok) {
        const json = await appRes.json().catch(() => ({}));
        console.log(`✓ Next.js keep-alive endpoint answered successfully:`, json);
        pingSucceeded = true;
      } else {
        console.warn(`! Next.js endpoint returned status: ${appRes.status}`);
      }
    } catch (err) {
      console.warn(`! Could not reach App endpoint:`, err.message);
    }
  }

  const totalTime = Date.now() - startTime;
  console.log("--------------------------------------------------");
  if (pingSucceeded) {
    console.log(`✓ SUCCESS: Supabase keep-alive completed in ${totalTime}ms.`);
    console.log(`✓ Database inactivity reset. Next execution in 4 days.`);
    console.log("==================================================");
    process.exit(0);
  } else {
    console.error(`✗ FAILED: Could not confirm Supabase activity. Check credentials or network.`);
    console.log("==================================================");
    process.exit(1);
  }
}

runKeepAlive();
