#!/usr/bin/env node

/**
 * Standalone Supabase Keep-Alive Script
 *
 * Runs every 4 days to prevent Supabase Free Tier from sleeping / pausing.
 * Can be run via:
 *   1) node scripts/keep-alive.mjs
 *   2) npm run keep-alive
 *   3) GitHub Actions scheduled workflow (.github/workflows/supabase-keep-alive.yml)
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
      console.warn("Notice: Could not read local .env file:", e.message);
    }
  }
}

loadEnvFile();

// Resolve Supabase URL with multiple fallback aliases
const SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ""
).trim().replace(/\/+$/, "");

// Resolve Supabase Key (Service Role or Anon)
const SUPABASE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  ""
).trim();

// Resolve App URL with safe operator precedence (prevents "https://undefined" bug)
const rawAppUrl = (
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  ""
).trim().replace(/\/+$/, "");

const APP_URL = (rawAppUrl.includes("undefined") || !rawAppUrl.startsWith("http"))
  ? ""
  : rawAppUrl;

const CRON_SECRET = (process.env.CRON_SECRET || "").trim();

async function runKeepAlive() {
  const startTime = Date.now();
  const dateStr = new Date().toISOString();

  console.log("==================================================");
  console.log(`[Supabase Keep-Alive] Started at: ${dateStr}`);
  console.log("==================================================");
  console.log("Configuration Check:");
  console.log(`- Supabase URL : ${SUPABASE_URL ? `SET (${SUPABASE_URL})` : "MISSING ⚠️"}`);
  console.log(`- Supabase Key : ${SUPABASE_KEY ? `SET (length: ${SUPABASE_KEY.length})` : "MISSING ⚠️"}`);
  console.log(`- App URL      : ${APP_URL ? `SET (${APP_URL})` : "NOT SET (optional)"}`);
  console.log(`- Cron Secret  : ${CRON_SECRET ? "SET" : "NOT SET (optional)"}`);
  console.log("--------------------------------------------------");

  let pingSucceeded = false;

  // 1. Direct Ping to Supabase REST / Auth APIs
  if (SUPABASE_URL && SUPABASE_KEY) {
    const endpointsToTry = [
      { name: "news table", path: "/rest/v1/news?select=id&limit=1" },
      { name: "delivered_projects table", path: "/rest/v1/delivered_projects?select=id&limit=1" },
      { name: "ongoing_projects table", path: "/rest/v1/ongoing_projects?select=id&limit=1" },
      { name: "admin_users table", path: "/rest/v1/admin_users?select=id&limit=1" },
      { name: "auth health check", path: "/auth/v1/health" },
      { name: "root REST endpoint", path: "/rest/v1/" },
    ];

    for (const ep of endpointsToTry) {
      const targetUrl = `${SUPABASE_URL}${ep.path}`;
      const probeStart = Date.now();
      try {
        console.log(`Probing Supabase ${ep.name}...`);
        const res = await fetch(targetUrl, {
          method: "GET",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "count=none",
          },
        });

        const elapsed = Date.now() - probeStart;

        if (res.ok) {
          console.log(`✓ SUCCESS: ${ep.name} responded with status ${res.status} (${elapsed}ms)`);
          pingSucceeded = true;
          break; // One successful probe is enough to reset Supabase inactivity
        } else {
          console.warn(`! ${ep.name} returned status ${res.status} (${elapsed}ms). Trying next probe...`);
        }
      } catch (err) {
        console.warn(`! ${ep.name} probe error: ${err.message}. Trying next probe...`);
      }
    }
  } else {
    console.warn("⚠️ Supabase URL or Key not found in environment.");
  }

  // 2. Ping deployed App keep-alive endpoint if APP_URL is configured
  if (APP_URL) {
    console.log("--------------------------------------------------");
    console.log(`Pinging Next.js App keep-alive route: ${APP_URL}/api/cron/keep-alive...`);
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
        const body = await appRes.json().catch(() => ({}));
        console.log(`✓ Next.js keep-alive responded:`, body);
        pingSucceeded = true;
      } else {
        console.warn(`! Next.js endpoint returned status: ${appRes.status}`);
      }
    } catch (err) {
      console.warn(`! Could not reach Next.js App endpoint: ${err.message}`);
    }
  }

  const totalTime = Date.now() - startTime;
  console.log("==================================================");

  if (pingSucceeded) {
    console.log(`✓ ALL DONE: Supabase database confirmed active (${totalTime}ms).`);
    console.log(`✓ Inactivity timer reset. The database will not sleep.`);
    console.log("==================================================");
    process.exit(0);
  } else {
    console.error("✗ ERROR: Could not confirm Supabase activity.");
    console.error("Troubleshooting Checklist:");
    console.error("1. In GitHub Repository → Settings → Secrets and variables → Actions:");
    console.error("   - Ensure NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL is added.");
    console.error("   - Ensure SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY is added.");
    console.error("2. If using APP_URL, verify your site is deployed and reachable.");
    console.log("==================================================");
    process.exit(1);
  }
}

runKeepAlive();
