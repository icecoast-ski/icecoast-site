// IceCoast Scraper API - Cloudflare Pages Function
// Deploy this to: functions/api/ski.ts

export const onRequest: PagesFunction<{
  SKI_KV: KVNamespace;
  SKI_CACHE_TTL_SECONDS: string;
  SKI_REFRESH_TOKEN?: string;
}> = async (ctx) => {
  const url = new URL(ctx.request.url);

  // CORS headers for browser requests
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (ctx.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Optional: filter list: /api/ski?resorts=stowe,okemo
  const only = (url.searchParams.get("resorts") || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // Optional: force refresh (admin only)
  const refresh = url.searchParams.get("refresh") === "1";
  const token = url.searchParams.get("token") || "";
  const allowRefresh =
    !!ctx.env.SKI_REFRESH_TOKEN && token === ctx.env.SKI_REFRESH_TOKEN;

  const ttlSeconds = Number(ctx.env.SKI_CACHE_TTL_SECONDS || "10800");

  const resorts = RESORTS.filter((r) =>
    only.length ? only.includes(r.id) : true,
  );

  const results = await Promise.all(
    resorts.map(async (r) => {
      try {
        return await getResortSnapshot(ctx, r, refresh && allowRefresh);
      } catch (e: any) {
        return {
          id: r.id,
          resort: r.name,
          timestamp: new Date().toISOString(),
          error: String(e?.message || e),
          scraped: false,
        } as Snapshot;
      }
    }),
  );

  return new Response(
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        ttl_seconds: ttlSeconds,
        results,
      },
      null,
      2,
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": `public, max-age=${ttlSeconds}`,
        ...corsHeaders,
      },
    },
  );
};

type Resort = {
  id: string;
  name: string;
  url: string;
  family: "vail" | "camelback_print" | "alterra" | "generic";
};

type Counts = { open?: number; total?: number };

type Snapshot = {
  id: string;
  resort: string;
  timestamp: string;
  scraped: boolean;
  lifts?: Counts;
  trails?: Counts;
  rating?: string;
  confidence?: number;
  signals?: {
    surface_text?: string;
    open_pct?: number;
    snow24_in?: number | null;
    snow48_in?: number | null;
    snow7d_in?: number | null;
  };
  error?: string;
};

// TIER 1 - Proven Easy Resorts (Deploy First!)
const RESORTS: Resort[] = [
  // Vail Resorts (Epic Pass) - Standardized template
  {
    id: "hunter",
    name: "Hunter Mountain",
    url: "https://www.huntermtn.com/mountain-report/",
    family: "vail",
  },
  {
    id: "stowe",
    name: "Stowe",
    url: "https://www.stowe.com/the-mountain/mountain-report/",
    family: "vail",
  },
  {
    id: "okemo",
    name: "Okemo",
    url: "https://www.okemo.com/the-mountain/mountain-report/",
    family: "vail",
  },
  {
    id: "mountsnow",
    name: "Mount Snow",
    url: "https://www.mountsnow.com/the-mountain/mountain-report/",
    family: "vail",
  },
  {
    id: "wildcat",
    name: "Wildcat Mountain",
    url: "https://www.skiwildcat.com/the-mountain/mountain-report/",
    family: "vail",
  },
  {
    id: "stratton",
    name: "Stratton",
    url: "https://www.stratton.com/the-mountain/mountain-report",
    family: "vail",
  },

  // Camelback - Custom scraper (proven working)
  {
    id: "camelback",
    name: "Camelback",
    url: "https://conditions.camelbackresort.com/conditions/snow-report/printable-report/",
    family: "camelback_print",
  },
];

async function getResortSnapshot(
  ctx: Parameters<typeof onRequest>[0],
  r: Resort,
  forceRefresh: boolean,
): Promise<Snapshot> {
  const ttl = Number(ctx.env.SKI_CACHE_TTL_SECONDS || "10800");
  const key = `ski:${r.id}`;

  if (!forceRefresh) {
    const cached = await ctx.env.SKI_KV.get(key, { type: "json" });
    if (cached) return cached as Snapshot;
  }

  const html = await fetchHtml(r.url);

  // Detect bot/captcha blocks early (prevents “false scraped=true”)
  if (looksBlocked(html)) {
    const blockedSnap: Snapshot = {
      id: r.id,
      resort: r.name,
      timestamp: new Date().toISOString(),
      scraped: false,
      error: "Blocked by bot protection / CAPTCHA (server-side fetch)",
    };
    await ctx.env.SKI_KV.put(key, JSON.stringify(blockedSnap), {
      expirationTtl: ttl,
    });
    return blockedSnap;
  }

  let lifts: Counts | undefined;
  let trails: Counts | undefined;
  let surface_text: string | undefined;
  let snow24_in: number | null = null;
  let snow48_in: number | null = null;
  let snow7d_in: number | null = null;

  const text = collapseWhitespace(stripTagsForText(html));

  // Parse based on resort family
  if (r.family === "camelback_print") {
    const openLifts = matchNumberAfter(text, /open\s*lifts/i);
    const openTrails = matchNumberAfter(text, /open\s*trails/i);
    lifts = openLifts != null ? { open: openLifts } : undefined;
    trails = openTrails != null ? { open: openTrails } : undefined;
  } else if (r.family === "vail" || r.family === "alterra") {
    lifts = matchFractionNear(text, /lifts?\s*open/i) ?? undefined;
    trails = matchFractionNear(text, /trails?\s*open/i) ?? undefined;
  } else {
    lifts = matchFractionNear(text, /lifts?\s*open/i) ?? undefined;
    trails = matchFractionNear(text, /trails?\s*open/i) ?? undefined;
  }

  // Try to extract surface conditions text
  surface_text = extractSurfaceText(text);

  // Try to extract snowfall data (if available on page)
  snow24_in = matchInchesNear(
    text,
    /(24\s*hr|24-hour|past\s*24\s*hours|overnight)/i,
  );
  snow48_in = matchInchesNear(text, /(48\s*hr|48-hour|past\s*48\s*hours)/i);
  snow7d_in = matchInchesNear(text, /(7\s*day|past\s*7\s*days|week)/i);

  const open_pct =
    trails?.open != null && trails?.total != null && trails.total > 0
      ? trails.open / trails.total
      : undefined;

  const { rating, confidence } = computeRating({
    surface_text,
    open_pct,
    snow24_in,
    snow48_in,
    snow7d_in,
  });

  // IMPORTANT FIX: only mark scraped=true when we actually extracted something useful
  const scraped = Boolean(
    (lifts?.open != null && Number.isFinite(lifts.open)) ||
    (trails?.open != null && Number.isFinite(trails.open)) ||
    (surface_text && surface_text.length > 0) ||
    snow24_in != null ||
    snow48_in != null ||
    snow7d_in != null,
  );

  const snapshot: Snapshot = {
    id: r.id,
    resort: r.name,
    timestamp: new Date().toISOString(),
    scraped,
    lifts,
    trails,
    rating,
    confidence,
    signals: { surface_text, open_pct, snow24_in, snow48_in, snow7d_in },
    ...(scraped
      ? {}
      : { error: "Parsed page but did not find expected fields" }),
  };

  await ctx.env.SKI_KV.put(key, JSON.stringify(snapshot), {
    expirationTtl: ttl,
  });

  return snapshot;
}

async function fetchHtml(url: string) {
  const resp = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; IceCoastBot/1.0; +https://icecoast.ski)",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return await resp.text();
}

function looksBlocked(html: string): boolean {
  const h = html.toLowerCase();

  // Your observed Killington block
  if (h.includes("/.well-known/sgcaptcha") || h.includes("sgcaptcha"))
    return true;

  // Common generic block pages
  if (
    (h.includes("captcha") && h.includes("verify")) ||
    h.includes("please enable javascript") ||
    h.includes("access denied") ||
    h.includes("bot detection") ||
    (h.includes("cloudflare") && h.includes("attention required"))
  ) {
    return true;
  }

  return false;
}

// ----------------- Rating logic -----------------

function computeRating(sig: {
  surface_text?: string;
  open_pct?: number;
  snow24_in?: number | null;
  snow48_in?: number | null;
  snow7d_in?: number | null;
}) {
  const surface = (sig.surface_text || "").toLowerCase();

  // 1) Trust explicit surface text (highest confidence)
  const explicit = mapSurface(surface);
  if (explicit) return { rating: explicit, confidence: 0.9 };

  // 2) Infer from signals
  const openPct = sig.open_pct ?? 0;
  const s24 = sig.snow24_in ?? null;
  const s48 = sig.snow48_in ?? null;
  const s7 = sig.snow7d_in ?? null;

  // Limited if barely open
  if (openPct > 0 && openPct < 0.25)
    return { rating: "limited", confidence: 0.75 };

  // Powder signals
  if ((s24 != null && s24 >= 6) || (s48 != null && s48 >= 10)) {
    return { rating: "powder", confidence: 0.8 };
  }

  if (
    (s24 != null && s24 >= 3) ||
    (s48 != null && s48 >= 5) ||
    (s7 != null && s7 >= 10)
  ) {
    return { rating: "packed_powder", confidence: 0.7 };
  }

  // Default: machine groomed (most common east coast)
  if (openPct >= 0.3) return { rating: "machine_groomed", confidence: 0.6 };

  return { rating: "unknown", confidence: 0.4 };
}

function mapSurface(surface: string): string | null {
  if (surface.includes("powder")) {
    return surface.includes("packed") ? "packed_powder" : "powder";
  }
  if (surface.includes("packed powder")) return "packed_powder";
  if (surface.includes("machine groomed") || surface.includes("groomed"))
    return "machine_groomed";
  if (
    surface.includes("hard pack") ||
    surface.includes("hardpack") ||
    surface.includes("firm")
  )
    return "firm_hardpack";
  if (surface.includes("spring")) return "spring_conditions";
  if (surface.includes("ice") || surface.includes("icy")) return "icy";
  return null;
}

function extractSurfaceText(text: string): string | undefined {
  const candidates = [
    /surface\s*conditions?/i,
    /conditions?\s*:/i,
    /snow\s*conditions?/i,
    /primary\s*surface/i,
  ];

  for (const re of candidates) {
    const idx = text.search(re);
    if (idx >= 0) {
      const window = text.slice(idx, idx + 150);
      const m = window.match(
        /(powder|packed powder|machine groomed|groomed|hard ?pack|firm|spring|icy)[^\.]{0,40}/i,
      );
      if (m) return m[0].trim();
    }
  }
  return undefined;
}

// ----------------- Parsing helpers -----------------

function stripTagsForText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function collapseWhitespace(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function matchFractionNear(
  text: string,
  label: RegExp,
): { open: number; total: number } | null {
  // Pattern 1: "12 / 15 lifts open"
  const m1 = text.match(
    new RegExp(`(\\d+)\\s*\\/\\s*(\\d+)\\s*${label.source}`, "i"),
  );
  if (m1) return { open: Number(m1[1]), total: Number(m1[2]) };

  // Pattern 2: "lifts open 12 / 15"
  const m2 = text.match(
    new RegExp(`${label.source}\\s*(\\d+)\\s*\\/\\s*(\\d+)`, "i"),
  );
  if (m2) return { open: Number(m2[1]), total: Number(m2[2]) };

  // Pattern 3: "11 of 12 lifts open" or "lifts open: 11 of 12"
  const m3 = text.match(
    new RegExp(`(\\d+)\\s*of\\s*(\\d+)\\s*${label.source}`, "i"),
  );
  if (m3) return { open: Number(m3[1]), total: Number(m3[2]) };

  // Pattern 4: "lifts open 11 of 12"
  const m4 = text.match(
    new RegExp(`${label.source}\\s*(\\d+)\\s*of\\s*(\\d+)`, "i"),
  );
  if (m4) return { open: Number(m4[1]), total: Number(m4[2]) };

  return null;
}

function matchNumberAfter(text: string, label: RegExp) {
  const m = text.match(new RegExp(`${label.source}\\s*(\\d+)`, "i"));
  return m ? Number(m[1]) : null;
}

function matchInchesNear(text: string, label: RegExp) {
  const idx = text.search(label);
  if (idx < 0) return null;
  const window = text.slice(idx, idx + 200);
  const m = window.match(/(\d+(?:\.\d+)?)\s*(?:in|"|inches)/i);
  return m ? Number(m[1]) : null;
}
