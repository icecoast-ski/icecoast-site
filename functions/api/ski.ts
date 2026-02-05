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

  // For Vail resorts, try API first, then fall back to HTML scraping
  if (r.family === "vail") {
    try {
      const apiResult = await tryVailAPI(r);
      if (apiResult && apiResult.scraped) {
        await ctx.env.SKI_KV.put(key, JSON.stringify(apiResult), {
          expirationTtl: ttl,
        });
        return apiResult;
      }
    } catch (e) {
      console.log(`[${r.id}] Vail API failed, falling back to HTML scraping`);
    }
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

  // Parse based on resort family - try multiple strategies
  if (r.family === "camelback_print") {
    // Camelback uses simpler format
    const openLifts = matchNumberAfter(text, /open\s*lifts/i);
    const openTrails = matchNumberAfter(text, /open\s*trails/i);
    lifts = openLifts != null ? { open: openLifts } : undefined;
    trails = openTrails != null ? { open: openTrails } : undefined;
  } else {
    // Vail/Alterra - try multiple pattern strategies
    
    // Strategy 1: Standard fraction patterns
    lifts = matchFractionNear(text, /lifts?\s*(?:open|operating)?/i);
    trails = matchFractionNear(text, /trails?\s*(?:open|operating)?/i);
    
    // Strategy 2: If lifts/trails not found, try reverse patterns
    if (!lifts) {
      lifts = matchFractionNear(text, /open\s*lifts?/i);
    }
    if (!trails) {
      trails = matchFractionNear(text, /open\s*trails?/i);
    }
    
    // Strategy 3: Try alternate labels
    if (!lifts) {
      lifts = matchFractionNear(text, /lifts?/i);
    }
    if (!trails) {
      trails = matchFractionNear(text, /runs?|trails?/i);
    }
  }

  // Try to extract surface conditions text
  surface_text = extractSurfaceText(text);

  // Try to extract snowfall data (if available on page) - try multiple label variations
  snow24_in = 
    matchInchesNear(text, /(24\s*hr|24-hour|24\s*hour|past\s*24\s*hours|overnight|last\s*24)/i) ??
    matchInchesNear(text, /new\s*snow|fresh\s*snow/i);
  
  snow48_in = 
    matchInchesNear(text, /(48\s*hr|48-hour|48\s*hour|past\s*48\s*hours|last\s*48)/i) ??
    matchInchesNear(text, /2\s*day/i);
  
  snow7d_in = 
    matchInchesNear(text, /(7\s*day|seven\s*day|past\s*7\s*days|past\s*week|weekly)/i);

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

  // Debug logging (helpful for troubleshooting)
  console.log(`[${r.id}] Scraped=${scraped}`, {
    lifts: lifts?.open ? `${lifts.open}/${lifts.total}` : 'none',
    trails: trails?.open ? `${trails.open}/${trails.total}` : 'none',
    surface: surface_text || 'none',
    snow: `24h:${snow24_in ?? 'none'} 48h:${snow48_in ?? 'none'} 7d:${snow7d_in ?? 'none'}`
  });

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

// Try to fetch from Vail's data API (many Vail resorts have JSON endpoints)
async function tryVailAPI(r: Resort): Promise<Snapshot | null> {
  // Vail resorts often have a structured data endpoint
  // Try common API patterns
  const apiUrls = [
    `https://www.${r.id === 'hunter' ? 'huntermtn' : r.id}.com/api/mountain-report`,
    `https://www.${r.id === 'hunter' ? 'huntermtn' : r.id}.com/data/mountain-report.json`,
  ];

  for (const apiUrl of apiUrls) {
    try {
      const resp = await fetch(apiUrl, {
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; IceCoastBot/1.0)",
          "accept": "application/json",
        },
      });
      
      if (resp.ok) {
        const data = await resp.json();
        // Try to extract data from JSON (structure varies by resort)
        const lifts = extractFromJSON(data, ['lifts', 'openLifts', 'liftsOpen']);
        const trails = extractFromJSON(data, ['trails', 'openTrails', 'trailsOpen']);
        const surface = extractFromJSON(data, ['surface', 'conditions', 'primarySurface', 'snowCondition']);
        
        if (lifts || trails || surface) {
          console.log(`[${r.id}] Successfully used Vail API`);
          return {
            id: r.id,
            resort: r.name,
            timestamp: new Date().toISOString(),
            scraped: true,
            lifts: lifts ? parseLiftsTrails(lifts) : undefined,
            trails: trails ? parseLiftsTrails(trails) : undefined,
            signals: {
              surface_text: typeof surface === 'string' ? surface : undefined,
            },
            rating: 'machine_groomed',
            confidence: 0.85,
          };
        }
      }
    } catch (e) {
      // Continue to next API URL
      continue;
    }
  }
  
  return null;
}

function extractFromJSON(obj: any, keys: string[]): any {
  for (const key of keys) {
    if (obj && typeof obj === 'object' && key in obj) {
      return obj[key];
    }
    // Deep search
    for (const k in obj) {
      if (typeof obj[k] === 'object') {
        const result = extractFromJSON(obj[k], keys);
        if (result !== undefined) return result;
      }
    }
  }
  return undefined;
}

function parseLiftsTrails(data: any): { open: number; total: number } | undefined {
  if (typeof data === 'object' && 'open' in data && 'total' in data) {
    return { open: Number(data.open), total: Number(data.total) };
  }
  if (typeof data === 'string') {
    const match = data.match(/(\d+)\s*\/\s*(\d+)/);
    if (match) return { open: Number(match[1]), total: Number(match[2]) };
  }
  return undefined;
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

  // 2) Infer from snowfall signals - BE AGGRESSIVE ABOUT POWDER DAYS!
  const openPct = sig.open_pct ?? 0;
  const s24 = sig.snow24_in ?? null;
  const s48 = sig.snow48_in ?? null;
  const s7 = sig.snow7d_in ?? null;

  // Limited terrain (only use if very restricted)
  if (openPct > 0 && openPct < 0.15)
    return { rating: "limited", confidence: 0.75 };

  // 🎿 POWDER DAY! (6"+ in 24h OR 10"+ in 48h)
  if (s24 != null && s24 >= 6) {
    return { rating: "powder", confidence: 0.95 }; // 6"+ overnight = POWDER!
  }
  if (s48 != null && s48 >= 10 && (s24 == null || s24 >= 4)) {
    return { rating: "powder", confidence: 0.9 }; // 10"+ in 48h with recent snow = POWDER
  }

  // ⛷️ PACKED POWDER (3-5" in 24h OR 6-9" in 48h)
  if (s24 != null && s24 >= 3) {
    return { rating: "packed_powder", confidence: 0.85 }; // 3-5" = packed powder
  }
  if (s48 != null && s48 >= 6 && (s24 == null || s24 >= 2)) {
    return { rating: "packed_powder", confidence: 0.8 }; // Recent snow still soft
  }
  if (s7 != null && s7 >= 12) {
    return { rating: "packed_powder", confidence: 0.7 }; // Good week of snow
  }

  // 🏔️ MACHINE GROOMED (default for most days - NO fresh snow)
  // This is the SAFE DEFAULT - not "variable"
  return { rating: "machine_groomed", confidence: 0.6 };
}

function mapSurface(surface: string): string | null {
  // CRITICAL: Check for POWDER first (before any groomed checks)
  // "Powder" = ungroomed fresh snow (the best!)
  // "Packed Powder" = groomed fresh snow (still good)
  // "Machine Groomed" = groomed base (no fresh snow)
  
  // Check for fresh powder FIRST (most important distinction!)
  if (surface.includes("powder") && !surface.includes("packed")) {
    return "powder"; // Fresh, ungroomed snow
  }
  if (surface.includes("packed powder") || (surface.includes("packed") && surface.includes("powder"))) {
    return "packed_powder"; // Groomed fresh snow
  }
  
  // Only after checking for powder, check for groomed
  if (surface.includes("machine groomed") || surface.includes("groomed"))
    return "machine_groomed"; // Regular groomed base
  
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
  // Common label patterns to search for
  const candidates = [
    /surface\s*conditions?/i,
    /conditions?\s*:/i,
    /snow\s*conditions?/i,
    /primary\s*surface/i,
    /base\s*conditions?/i,
    /current\s*conditions?/i,
    /snow\s*quality/i,
  ];

  // Condition keywords to look for (expanded list)
  const conditionPattern = /(powder|packed\s*powder|machine\s*groomed|groomed|hard\s*pack|hardpack|firm|spring|icy|ice|frozen\s*granular|granular|corn\s*snow|variable|wet|soft)/i;

  for (const re of candidates) {
    const idx = text.search(re);
    if (idx >= 0) {
      // Extract a larger window around the match
      const window = text.slice(Math.max(0, idx - 50), idx + 200);
      const m = window.match(conditionPattern);
      if (m) {
        // Get more context around the match
        const matchIdx = window.indexOf(m[0]);
        const contextStart = Math.max(0, matchIdx - 10);
        const contextEnd = Math.min(window.length, matchIdx + m[0].length + 30);
        const context = window.slice(contextStart, contextEnd).trim();
        
        // Return the cleanest match
        return context.split(/[.,;]|snow(?:fall)?/i)[0].trim();
      }
    }
  }

  // Fallback: search entire text for condition keywords (broader search)
  const broadMatch = text.match(conditionPattern);
  if (broadMatch) {
    return broadMatch[0].trim();
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

  // Pattern 3: "11 of 12 lifts open"
  const m3 = text.match(
    new RegExp(`(\\d+)\\s*of\\s*(\\d+)\\s*${label.source}`, "i"),
  );
  if (m3) return { open: Number(m3[1]), total: Number(m3[2]) };

  // Pattern 4: "lifts open 11 of 12"
  const m4 = text.match(
    new RegExp(`${label.source}\\s*(\\d+)\\s*of\\s*(\\d+)`, "i"),
  );
  if (m4) return { open: Number(m4[1]), total: Number(m4[2]) };

  // Pattern 5: "lifts: 12/15" or "trails: 45/52" (compact format)
  const m5 = text.match(
    new RegExp(`${label.source}\\s*:?\\s*(\\d+)\\s*\\/\\s*(\\d+)`, "i"),
  );
  if (m5) return { open: Number(m5[1]), total: Number(m5[2]) };

  // Pattern 6: "open lifts 12" with separate "total lifts 15" nearby
  const openMatch = text.match(
    new RegExp(`open\\s*${label.source}\\s*(\\d+)`, "i"),
  );
  const totalMatch = text.match(
    new RegExp(`total\\s*${label.source}\\s*(\\d+)`, "i"),
  );
  if (openMatch && totalMatch) {
    return { open: Number(openMatch[1]), total: Number(totalMatch[1]) };
  }

  // Pattern 7: Just open count "12 lifts open" (no total)
  const m7 = text.match(
    new RegExp(`(\\d+)\\s*${label.source}\\s*open`, "i"),
  );
  if (m7) return { open: Number(m7[1]), total: Number(m7[1]) }; // Assume all are total

  return null;
}

function matchNumberAfter(text: string, label: RegExp) {
  const m = text.match(new RegExp(`${label.source}\\s*(\\d+)`, "i"));
  return m ? Number(m[1]) : null;
}

function matchInchesNear(text: string, label: RegExp) {
  const idx = text.search(label);
  if (idx < 0) return null;
  
  // Search in a larger window
  const window = text.slice(Math.max(0, idx - 50), idx + 250);
  
  // Pattern 1: Standard "X inches" or X"
  const m1 = window.match(/(\d+(?:\.\d+)?)\s*(?:in|"|inches)/i);
  if (m1) return Number(m1[1]);
  
  // Pattern 2: Trace amounts (return 0)
  if (window.match(/trace|T"/i)) return 0;
  
  // Pattern 3: Just a number near the label (e.g., "24hr: 5")
  const m3 = window.match(/:\s*(\d+(?:\.\d+)?)\s*$/);
  if (m3) return Number(m3[1]);
  
  // Pattern 4: Number without unit (last resort)
  const m4 = window.match(/(\d+(?:\.\d+)?)\s*(?:new|fresh)?/i);
  if (m4) return Number(m4[1]);
  
  return null;
}
