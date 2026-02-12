
const DEFAULT_SENDIT_RADIUS_MILES = 1.5;
const SENDIT_MAX_ACCURACY_METERS = 200;
const SENDIT_KEY_PREFIX = "sendit_votes_";
const SENDIT_SOFT_COOLDOWN_MS = 12 * 60 * 1000;
const SENDIT_RESORT_COOLDOWN_OVERRIDES_MS = {};
const SENDIT_MAX_VOTES_PER_HOUR = 3;
const SENDIT_MAX_VOTES_PER_DAY = 8;
const SENDIT_WINDOW_1H_MS = 60 * 60 * 1000;
const SENDIT_SOCIAL_WINDOW_MS = 60 * 60 * 1000;
const SENDIT_WINDOW_24H_MS = 24 * 60 * 60 * 1000;
const SENDIT_WINDOW_48H_MS = 48 * 60 * 60 * 1000;
const SENDIT_WINDOW_72H_MS = 72 * 60 * 60 * 1000;
const SENDIT_ALLOWED_CROWD = new Set(["quiet", "normal", "swarm"]);
const SENDIT_ALLOWED_WIND = new Set(["calm", "breezy", "nuking"]);
const SENDIT_ALLOWED_HAZARD = new Set(["clear", "icy", "swarm"]);
const SENDIT_ALLOWED_DIFFICULTY = new Set(["green", "blue", "black", "double"]);
const SENDIT_DEFAULT_CROWD = "normal";
const SENDIT_DEFAULT_WIND = "breezy";
const SENDIT_DEFAULT_HAZARD = "clear";
const SENDIT_DEFAULT_DIFFICULTY = "blue";
const SENDIT_RESORT_KEY_OVERRIDES = {
  "blue-mountain": "sendit_votes_blue-mountain_live",
};
const SENDIT_RESORT_RADIUS_OVERRIDES = {
  killington: 2.0,
  "sunday-river": 2.0,
  sugarloaf: 2.0,
};
const HEALTH_SCHEMA_VERSION = 2;

const RESORT_COORDS = {
  camelback: { lat: 41.0525, lon: -75.356 },
  "blue-mountain": { lat: 40.8101, lon: -75.5209 },
  "jack-frost": { lat: 41.091, lon: -75.469 },
  shawnee: { lat: 41.038, lon: -75.077 },
  "bear-creek": { lat: 40.7434, lon: -76.0493 },
  elk: { lat: 41.6523, lon: -75.5643 },
  "big-boulder": { lat: 41.1046, lon: -75.5554 },
  montage: { lat: 41.1812, lon: -75.559 },
  hunter: { lat: 42.208, lon: -74.2116 },
  windham: { lat: 42.2985, lon: -74.2627 },
  belleayre: { lat: 42.1344, lon: -74.5121 },
  whiteface: { lat: 44.3611, lon: -73.8865 },
  "gore-mountain": { lat: 43.6774, lon: -74.0116 },
  "jiminy-peak": { lat: 42.5386, lon: -73.2928 },
  wachusett: { lat: 42.5153, lon: -71.89 },
  mohawk: { lat: 41.6892, lon: -73.3148 },
  stratton: { lat: 43.1172, lon: -72.9094 },
  "mount-snow": { lat: 42.9714, lon: -72.8963 },
  killington: { lat: 43.6317, lon: -72.8057 },
  okemo: { lat: 43.4057, lon: -72.7196 },
  pico: { lat: 43.6597, lon: -72.8521 },
  sugarbush: { lat: 44.1513, lon: -72.8821 },
  "mad-river-glen": { lat: 44.2056, lon: -72.9215 },
  stowe: { lat: 44.5385, lon: -72.7844 },
  "smugglers-notch": { lat: 44.5414, lon: -72.7847 },
  "jay-peak": { lat: 44.9338, lon: -72.5049 },
  burke: { lat: 44.577, lon: -71.9212 },
  loon: { lat: 44.04, lon: -71.6239 },
  brettonwoods: { lat: 44.0798, lon: -71.3435 },
  waterville: { lat: 43.9686, lon: -71.5292 },
  cannon: { lat: 44.1593, lon: -71.7012 },
  wildcat: { lat: 44.2665, lon: -71.242 },
  sunapee: { lat: 43.3653, lon: -72.0546 },
  "pats-peak": { lat: 43.1775, lon: -71.8440 },
  "sunday-river": { lat: 44.4768, lon: -70.8601 },
  sugarloaf: { lat: 45.0359, lon: -70.3166 },
  saddleback: { lat: 44.9345, lon: -70.513 },
  tremblant: { lat: 46.2094, lon: -74.5903 },
  "mont-sainte-anne": { lat: 47.0711, lon: -70.9061 },
  "le-massif": { lat: 47.3292, lon: -70.6489 },
  "mont-sutton": { lat: 45.0769, lon: -72.4561 },
};

function jsonResponse(body, corsHeaders, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function loadSendItSummary(env) {
  const now = Date.now();
  const entries = await Promise.all(
    Object.keys(RESORT_COORDS).map(async (resortId) => {
      const key = getSendItResortKey(resortId);
      const row = await env.ICECOASTDATA.get(key, "json");
      const voteCount = Number(row?.voteCount || 0);
      const totalScore = Number(row?.totalScore || 0);
      const weightedVoteTotal = Number(
        row?.weightedVoteTotal ?? (voteCount > 0 ? voteCount : 0),
      );
      const weightedScoreTotal = Number(
        row?.weightedScoreTotal ?? (voteCount > 0 ? totalScore : 0),
      );
      const score =
        weightedVoteTotal > 0
          ? Math.round(weightedScoreTotal / weightedVoteTotal)
          : null;
      const recentVotes = Array.isArray(row?.recentVotes)
        ? row.recentVotes.filter(
            (ts) => Number.isFinite(ts) && now - ts <= SENDIT_SOCIAL_WINDOW_MS,
          )
        : [];
      const votes24h = Array.isArray(row?.voteTimestamps)
        ? row.voteTimestamps.filter(
            (ts) => Number.isFinite(ts) && now - ts <= SENDIT_WINDOW_24H_MS,
          )
        : [];
      const votes48h = Array.isArray(row?.voteTimestamps)
        ? row.voteTimestamps.filter(
            (ts) => Number.isFinite(ts) && now - ts <= SENDIT_WINDOW_48H_MS,
          )
        : [];
      const votes72h = Array.isArray(row?.voteTimestamps)
        ? row.voteTimestamps.filter(
            (ts) => Number.isFinite(ts) && now - ts <= SENDIT_WINDOW_72H_MS,
          )
        : [];
      const voteEvents = Array.isArray(row?.voteEvents)
        ? row.voteEvents.filter(
            (evt) =>
              Number.isFinite(Number(evt?.ts)) &&
              Number.isFinite(Number(evt?.score)) &&
              now - Number(evt.ts) <= SENDIT_WINDOW_72H_MS,
          )
        : [];
      const events24h = voteEvents.filter(
        (evt) => now - Number(evt.ts) <= SENDIT_WINDOW_24H_MS,
      );
      const events48h = voteEvents.filter(
        (evt) => now - Number(evt.ts) <= SENDIT_WINDOW_48H_MS,
      );
      return [
        resortId,
        {
          score,
          score24h: weightedAverageScoreFromEvents(events24h),
          score48h: weightedAverageScoreFromEvents(events48h),
          votes: voteCount,
          votesLastHour: recentVotes.length,
          votes24h: votes24h.length,
          votes48h: votes48h.length,
          votes3d: votes72h.length,
          crowdMode: getTopMode(
            row?.crowdVotes,
            SENDIT_ALLOWED_CROWD,
            SENDIT_DEFAULT_CROWD,
          ),
          windMode: getTopMode(
            row?.windVotes,
            SENDIT_ALLOWED_WIND,
            SENDIT_DEFAULT_WIND,
          ),
          hazardMode: getTopMode(
            row?.hazardVotes,
            SENDIT_ALLOWED_HAZARD,
            SENDIT_DEFAULT_HAZARD,
          ),
          difficultyMix: buildDifficultyMix(row, voteEvents),
        },
      ];
    }),
  );
  return Object.fromEntries(entries);
}

function normalizeMode(value, allowed, fallback) {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  return allowed.has(normalized) ? normalized : fallback;
}

function bumpModeCount(map, key, increment = 1) {
  const next = map && typeof map === "object" ? { ...map } : {};
  next[key] = Number(next[key] || 0) + Number(increment || 0);
  return next;
}

function getTopMode(map, allowed, fallback) {
  if (!map || typeof map !== "object") return fallback;
  let bestKey = fallback;
  let bestCount = -1;
  for (const [key, raw] of Object.entries(map)) {
    if (!allowed.has(key)) continue;
    const count = Number(raw || 0);
    if (!Number.isFinite(count)) continue;
    if (count > bestCount) {
      bestCount = count;
      bestKey = key;
    }
  }
  return bestKey;
}

function weightedAverageScoreFromEvents(events) {
  if (!Array.isArray(events) || events.length === 0) return null;
  let weightedScore = 0;
  let totalWeight = 0;
  for (const evt of events) {
    const score = Number(evt?.score);
    if (!Number.isFinite(score) || score < 0 || score > 100) continue;
    const weight = Number.isFinite(Number(evt?.weight))
      ? Math.max(0.05, Number(evt.weight))
      : 1;
    weightedScore += score * weight;
    totalWeight += weight;
  }
  if (totalWeight <= 0) return null;
  return Math.round(weightedScore / totalWeight);
}

function inferDifficultyFromScore(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return SENDIT_DEFAULT_DIFFICULTY;
  if (n < 40) return "green";
  if (n < 70) return "blue";
  if (n < 90) return "black";
  return "double";
}

function buildDifficultyMix(row, voteEvents) {
  const mix = { green: 0, blue: 0, black: 0, double: 0 };
  const src = row?.difficultyVotes;
  if (src && typeof src === "object") {
    let hasAny = false;
    for (const key of Object.keys(mix)) {
      const value = Number(src[key] || 0);
      if (Number.isFinite(value) && value > 0) {
        mix[key] = value;
        hasAny = true;
      }
    }
    if (hasAny) return mix;
  }

  if (!Array.isArray(voteEvents)) return mix;
  for (const evt of voteEvents) {
    const key =
      typeof evt?.difficulty === "string" && SENDIT_ALLOWED_DIFFICULTY.has(evt.difficulty)
        ? evt.difficulty
        : inferDifficultyFromScore(evt?.score);
    const weight = Number.isFinite(Number(evt?.weight))
      ? Math.max(0.05, Number(evt.weight))
      : 1;
    mix[key] += weight;
  }
  return mix;
}

function computeSendItVoteWeight({
  now,
  recentVotes,
  lastVoteAt,
  lastScore,
  score,
  cooldownMs,
}) {
  const votesLastHour = recentVotes.filter(
    (ts) => Number.isFinite(ts) && now - ts <= SENDIT_WINDOW_1H_MS,
  ).length;
  const votes24h = recentVotes.length;
  const millisSinceLast =
    Number.isFinite(Number(lastVoteAt)) && Number(lastVoteAt) > 0
      ? now - Number(lastVoteAt)
      : Infinity;

  let weight = 1;
  // Cooldown is enforced separately as a hard gate; keep accepted votes near full weight.
  if (votesLastHour >= SENDIT_MAX_VOTES_PER_HOUR) weight *= 0.85;
  if (votes24h >= SENDIT_MAX_VOTES_PER_DAY) weight *= 0.75;

  // If a voter keeps submitting nearly identical takes repeatedly, trim slightly.
  if (
    Number.isFinite(Number(lastScore)) &&
    Math.abs(Number(score) - Number(lastScore)) <= 5 &&
    millisSinceLast < 45 * 60 * 1000
  ) {
    weight *= 0.9;
  }

  const clampedWeight = Math.max(0.05, Math.min(1, Number(weight.toFixed(3))));
  const interactionTier =
    clampedWeight >= 0.85
      ? "full"
      : clampedWeight >= 0.35
        ? "light"
        : "minimal";

  return {
    weight: clampedWeight,
    interactionTier,
    votesLastHour,
    votes24h,
    millisSinceLast,
  };
}

function getSendItRadiusMiles(resortId) {
  return (
    SENDIT_RESORT_RADIUS_OVERRIDES[resortId] ?? DEFAULT_SENDIT_RADIUS_MILES
  );
}

function getSendItCooldownMs(resortId) {
  return SENDIT_RESORT_COOLDOWN_OVERRIDES_MS[resortId] ?? SENDIT_SOFT_COOLDOWN_MS;
}

function getSendItResortKey(resortId) {
  return (
    SENDIT_RESORT_KEY_OVERRIDES[resortId] ?? `${SENDIT_KEY_PREFIX}${resortId}`
  );
}

function getAdminTokenFromRequest(request, url) {
  const headerToken =
    request.headers.get("x-admin-token") ||
    request.headers.get("X-Admin-Token");
  const queryToken = url.searchParams.get("token");
  return headerToken || queryToken || "";
}

function sanitizeIsoOrNull(value) {
  if (typeof value !== "string") return null;
  const ts = Date.parse(value);
  if (!Number.isFinite(ts)) return null;
  return new Date(ts).toISOString();
}

function inspectSendItRecordSchema(record) {
  if (!record || typeof record !== "object") {
    return { valid: false, reason: "record_not_object" };
  }
  const voteCount = Number(record.voteCount ?? 0);
  const totalScore = Number(record.totalScore ?? 0);
  const weightedVoteTotal = Number(record.weightedVoteTotal ?? voteCount);
  const weightedScoreTotal = Number(record.weightedScoreTotal ?? totalScore);
  if (!Number.isFinite(voteCount) || voteCount < 0) {
    return { valid: false, reason: "invalid_voteCount" };
  }
  if (!Number.isFinite(totalScore) || totalScore < 0) {
    return { valid: false, reason: "invalid_totalScore" };
  }
  if (!Number.isFinite(weightedVoteTotal) || weightedVoteTotal < 0) {
    return { valid: false, reason: "invalid_weightedVoteTotal" };
  }
  if (!Number.isFinite(weightedScoreTotal) || weightedScoreTotal < 0) {
    return { valid: false, reason: "invalid_weightedScoreTotal" };
  }
  return { valid: true, reason: "ok" };
}

async function getAdminHealthReport(env) {
  const nowIso = new Date().toISOString();
  const resortIds = Object.keys(RESORT_COORDS);
  const missingResortRecords = [];
  const malformedResortRecords = [];

  const resortRecords = await Promise.all(
    resortIds.map(async (resortId) => {
      const key = getSendItResortKey(resortId);
      const row = await env.ICECOASTDATA.get(key, "json");
      if (!row) {
        missingResortRecords.push(resortId);
        return { resortId, key, exists: false, voteCount: 0, updatedAt: null };
      }
      const schema = inspectSendItRecordSchema(row);
      if (!schema.valid) {
        malformedResortRecords.push({ resortId, key, reason: schema.reason });
      }
      return {
        resortId,
        key,
        exists: true,
        voteCount: Number(row.voteCount || 0),
        weightedVoteTotal: Number(
          row.weightedVoteTotal ?? Number(row.voteCount || 0),
        ),
        updatedAt: sanitizeIsoOrNull(row.updatedAt),
        schemaReason: schema.reason,
      };
    }),
  );

  let totalVotes = 0;
  let weightedVotes = 0;
  let activeResorts = 0;
  let mostRecentVoteAt = null;
  for (const rec of resortRecords) {
    totalVotes += Number(rec.voteCount || 0);
    weightedVotes += Number(rec.weightedVoteTotal || 0);
    if (Number(rec.voteCount || 0) > 0) activeResorts += 1;
    if (rec.updatedAt && (!mostRecentVoteAt || rec.updatedAt > mostRecentVoteAt)) {
      mostRecentVoteAt = rec.updatedAt;
    }
  }

  let profileKeyCount = 0;
  let malformedProfileCount = 0;
  let cursor;
  do {
    const page = await env.ICECOASTDATA.list({
      prefix: `${SENDIT_KEY_PREFIX}profile_`,
      limit: 1000,
      cursor,
    });
    profileKeyCount += page.keys.length;
    for (const key of page.keys) {
      const profile = await env.ICECOASTDATA.get(key.name, "json");
      if (!profile || typeof profile !== "object") {
        malformedProfileCount += 1;
        continue;
      }
      const lastVoteAt = Number(profile.lastVoteAt || 0);
      if (!Number.isFinite(lastVoteAt) || lastVoteAt < 0) {
        malformedProfileCount += 1;
      }
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return {
    status:
      malformedResortRecords.length === 0 && malformedProfileCount === 0
        ? "ok"
        : "warning",
    checkedAt: nowIso,
    schemaVersion: HEALTH_SCHEMA_VERSION,
    sendit: {
      configuredResorts: resortIds.length,
      activeResorts,
      totalVotes,
      weightedVotes: Number(weightedVotes.toFixed(2)),
      mostRecentVoteAt,
      missingResortRecords,
      malformedResortRecords,
      profileKeys: profileKeyCount,
      malformedProfiles: malformedProfileCount,
    },
  };
}

async function hashSha256Hex(input) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getSendItVoterToken(request, deviceId) {
  if (typeof deviceId === "string" && /^[a-zA-Z0-9_-]{8,80}$/.test(deviceId)) {
    const hashed = await hashSha256Hex(`device:${deviceId}`);
    return hashed.slice(0, 24);
  }

  const ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("x-forwarded-for") ||
    "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  const hashed = await hashSha256Hex(`ipua:${ip}|${ua}`);
  return hashed.slice(0, 24);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://icecoast.ski",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Cache-Control, X-Admin-Token",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/health") {
      return jsonResponse({ status: "ok" }, corsHeaders);
    }

    if (url.pathname === "/admin/health" && request.method === "GET") {
      try {
        const requiredToken = (env.ADMIN_HEALTH_TOKEN || "").trim();
        const providedToken = getAdminTokenFromRequest(request, url).trim();
        if (requiredToken && providedToken !== requiredToken) {
          return jsonResponse(
            { error: "Unauthorized" },
            corsHeaders,
            401,
          );
        }

        const report = await getAdminHealthReport(env);
        return jsonResponse(report, corsHeaders, 200, {
          "Cache-Control": "no-store",
        });
      } catch (error) {
        console.error("Admin health failed:", error);
        return jsonResponse(
          { error: "Failed to generate admin health report" },
          corsHeaders,
          500,
        );
      }
    }

    if (url.pathname === "/admin/sendit/reset" && request.method === "POST") {
      try {
        const requiredToken = (env.ADMIN_HEALTH_TOKEN || "").trim();
        const providedToken = getAdminTokenFromRequest(request, url).trim();
        if (requiredToken && providedToken !== requiredToken) {
          return jsonResponse(
            { error: "Unauthorized" },
            corsHeaders,
            401,
          );
        }

        let resortId = url.searchParams.get("resortId");
        if (!resortId) {
          const body = await request.json().catch(() => ({}));
          resortId = body?.resortId || null;
        }

        if (!resortId || !RESORT_COORDS[resortId]) {
          return jsonResponse(
            { error: "Unknown or missing resortId" },
            corsHeaders,
            400,
          );
        }

        const key = getSendItResortKey(resortId);
        await env.ICECOASTDATA.put(
          key,
          JSON.stringify({
          voteCount: 0,
          totalScore: 0,
          weightedVoteTotal: 0,
          weightedScoreTotal: 0,
          crowdVotes: {},
          windVotes: {},
          hazardVotes: {},
          difficultyVotes: {},
          recentVotes: [],
          voteTimestamps: [],
            voteEvents: [],
            updatedAt: new Date().toISOString(),
            resetByAdmin: true,
          }),
        );

        let profileResetCount = 0;
        let cursor;
        do {
          const page = await env.ICECOASTDATA.list({
            prefix: `${SENDIT_KEY_PREFIX}profile_${resortId}_`,
            limit: 1000,
            cursor,
          });
          await Promise.all(
            page.keys.map(async (entry) => {
              await env.ICECOASTDATA.delete(entry.name);
              profileResetCount += 1;
            }),
          );
          cursor = page.list_complete ? undefined : page.cursor;
        } while (cursor);

        return jsonResponse(
          {
            ok: true,
            resortId,
            key,
            resetProfiles: profileResetCount,
          },
          corsHeaders,
          200,
          { "Cache-Control": "no-store" },
        );
      } catch (error) {
        console.error("Admin sendit reset failed:", error);
        return jsonResponse(
          { error: "Failed to reset sendit data" },
          corsHeaders,
          500,
        );
      }
    }

    if (url.pathname === "/sendit/vote" && request.method === "POST") {
      try {
        const body = await request.json();
        const resortId = body?.resortId;
        const score = Number(body?.score);
        const crowd = normalizeMode(
          body?.crowd,
          SENDIT_ALLOWED_CROWD,
          SENDIT_DEFAULT_CROWD,
        );
        const wind = normalizeMode(
          body?.wind,
          SENDIT_ALLOWED_WIND,
          SENDIT_DEFAULT_WIND,
        );
        const hazard = normalizeMode(
          body?.hazard,
          SENDIT_ALLOWED_HAZARD,
          SENDIT_DEFAULT_HAZARD,
        );
        const difficulty = normalizeMode(
          body?.difficulty,
          SENDIT_ALLOWED_DIFFICULTY,
          SENDIT_DEFAULT_DIFFICULTY,
        );
        const lat = Number(body?.lat);
        const lon = Number(body?.lon);
        const accuracy = Number(body?.accuracy);
        const deviceId = body?.deviceId;

        if (!resortId || !RESORT_COORDS[resortId]) {
          return jsonResponse({ error: "Unknown resortId" }, corsHeaders, 400);
        }
        if (!Number.isFinite(score) || score < 0 || score > 100) {
          return jsonResponse(
            { error: "Score must be a number between 0 and 100" },
            corsHeaders,
            400,
          );
        }
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
          return jsonResponse(
            { error: "Missing valid geolocation coordinates" },
            corsHeaders,
            400,
          );
        }
        if (
          Number.isFinite(accuracy) &&
          accuracy > SENDIT_MAX_ACCURACY_METERS
        ) {
          return jsonResponse(
            {
              error: `Location accuracy is too low (${Math.round(accuracy)}m). Move to open sky and retry.`,
              maxAccuracyMeters: SENDIT_MAX_ACCURACY_METERS,
            },
            corsHeaders,
            400,
          );
        }

        const resortCoords = RESORT_COORDS[resortId];
        const allowedRadiusMiles = getSendItRadiusMiles(resortId);
        const cooldownMs = getSendItCooldownMs(resortId);
        const distanceMiles = haversineMiles(
          lat,
          lon,
          resortCoords.lat,
          resortCoords.lon,
        );

        if (distanceMiles > allowedRadiusMiles) {
          return jsonResponse(
            {
              error: "You need to be on-mountain to vote.",
              distanceMiles: Number(distanceMiles.toFixed(1)),
            },
            corsHeaders,
            403,
          );
        }

        const voterToken = await getSendItVoterToken(request, deviceId);
        const profileKey = `${SENDIT_KEY_PREFIX}profile_${resortId}_${voterToken}`;
        const now = Date.now();
        const voterProfile = (await env.ICECOASTDATA.get(profileKey, "json")) || {};
        const recentVotesByVoter = Array.isArray(voterProfile.recentVotes)
          ? voterProfile.recentVotes.filter(
              (ts) => Number.isFinite(ts) && now - ts <= SENDIT_WINDOW_24H_MS,
            )
          : [];
        const lastVoteAt = Number(voterProfile.lastVoteAt || 0);
        const lastScore = Number(voterProfile.lastScore);
        const voteWeightMeta = computeSendItVoteWeight({
          now,
          recentVotes: recentVotesByVoter,
          lastVoteAt,
          lastScore,
          score,
          cooldownMs,
        });
        if (
          Number.isFinite(lastVoteAt) &&
          lastVoteAt > 0 &&
          now - lastVoteAt < cooldownMs
        ) {
          const retryMs = cooldownMs - (now - lastVoteAt);
          const retryMinutes = Math.max(1, Math.ceil(retryMs / 60000));
          return jsonResponse(
            {
              error: `You already dropped a signal here. Try again in about ${retryMinutes} minute${retryMinutes === 1 ? "" : "s"}.`,
              retryAfterMinutes: retryMinutes,
            },
            corsHeaders,
            429,
          );
        }

        const key = getSendItResortKey(resortId);
        const current = (await env.ICECOASTDATA.get(key, "json")) || {
          voteCount: 0,
          totalScore: 0,
          hazardVotes: {},
        };

        const priorRecentVotes = Array.isArray(current.recentVotes)
          ? current.recentVotes.filter(
              (ts) =>
                Number.isFinite(ts) && now - ts <= SENDIT_SOCIAL_WINDOW_MS,
            )
          : [];
        priorRecentVotes.push(now);
        const voteTimestamps = Array.isArray(current.voteTimestamps)
          ? current.voteTimestamps.filter(
              (ts) =>
                Number.isFinite(ts) && now - ts <= SENDIT_WINDOW_72H_MS,
            )
          : [];
        voteTimestamps.push(now);
        const voteEvents = Array.isArray(current.voteEvents)
          ? current.voteEvents.filter(
              (evt) =>
                Number.isFinite(Number(evt?.ts)) &&
                Number.isFinite(Number(evt?.score)) &&
                now - Number(evt.ts) <= SENDIT_WINDOW_72H_MS,
            )
          : [];
        voteEvents.push({
          ts: now,
          score,
          crowd,
          wind,
          hazard,
          difficulty,
          weight: voteWeightMeta.weight,
        });
        const voteCount = Number(current.voteCount || 0) + 1;
        const totalScore = Number(current.totalScore || 0) + score;
        const weightedVoteTotal =
          Number(
            current.weightedVoteTotal ??
              (Number.isFinite(Number(current.voteCount))
                ? Number(current.voteCount)
                : 0),
          ) + voteWeightMeta.weight;
        const weightedScoreTotal =
          Number(
            current.weightedScoreTotal ??
              (Number.isFinite(Number(current.totalScore))
                ? Number(current.totalScore)
                : 0),
          ) +
          score * voteWeightMeta.weight;
        const crowdVotes = bumpModeCount(
          current.crowdVotes,
          crowd,
          voteWeightMeta.weight,
        );
        const windVotes = bumpModeCount(
          current.windVotes,
          wind,
          voteWeightMeta.weight,
        );
        const hazardVotes = bumpModeCount(
          current.hazardVotes,
          hazard,
          voteWeightMeta.weight,
        );
        const difficultyVotes = bumpModeCount(
          current.difficultyVotes,
          difficulty,
          voteWeightMeta.weight,
        );
        const updated = {
          voteCount,
          totalScore,
          weightedVoteTotal,
          weightedScoreTotal,
          crowdVotes,
          windVotes,
          hazardVotes,
          difficultyVotes,
          recentVotes: priorRecentVotes,
          voteTimestamps,
          voteEvents,
          updatedAt: new Date().toISOString(),
        };

        const votes24h = voteTimestamps.filter(
          (ts) => Number.isFinite(ts) && now - ts <= SENDIT_WINDOW_24H_MS,
        ).length;
        const votes48h = voteTimestamps.filter(
          (ts) => Number.isFinite(ts) && now - ts <= SENDIT_WINDOW_48H_MS,
        ).length;
        const votes3d = voteTimestamps.length;
        const events24h = voteEvents.filter(
          (evt) => now - Number(evt.ts) <= SENDIT_WINDOW_24H_MS,
        );
        const events48h = voteEvents.filter(
          (evt) => now - Number(evt.ts) <= SENDIT_WINDOW_48H_MS,
        );

        await env.ICECOASTDATA.put(key, JSON.stringify(updated));
        await env.ICECOASTDATA.put(
          profileKey,
          JSON.stringify({
            recentVotes: [...recentVotesByVoter, now],
            lastVoteAt: now,
            lastScore: score,
            updatedAt: new Date().toISOString(),
          }),
          {
            expirationTtl: 60 * 60 * 24 * 30,
          },
        );
        return jsonResponse(
          {
            ok: true,
            resortId,
            summary: {
              score:
                weightedVoteTotal > 0
                  ? Math.round(weightedScoreTotal / weightedVoteTotal)
                  : null,
              score24h: weightedAverageScoreFromEvents(events24h),
              score48h: weightedAverageScoreFromEvents(events48h),
              votes: voteCount,
              votesLastHour: priorRecentVotes.length,
              votes24h,
              votes48h,
              votes3d,
              crowdMode: getTopMode(
                crowdVotes,
                SENDIT_ALLOWED_CROWD,
                SENDIT_DEFAULT_CROWD,
              ),
              windMode: getTopMode(
                windVotes,
                SENDIT_ALLOWED_WIND,
                SENDIT_DEFAULT_WIND,
              ),
              hazardMode: getTopMode(
                hazardVotes,
                SENDIT_ALLOWED_HAZARD,
                SENDIT_DEFAULT_HAZARD,
              ),
              difficultyMix: buildDifficultyMix(updated, voteEvents),
            },
            distanceMiles: Number(distanceMiles.toFixed(1)),
            radiusMiles: allowedRadiusMiles,
            voteWeight: voteWeightMeta.weight,
            interactionTier: voteWeightMeta.interactionTier,
            cooldownMinutes: Math.max(1, Math.round(cooldownMs / 60000)),
          },
          corsHeaders,
        );
      } catch (error) {
        console.error("Send It vote failed:", error);
        return jsonResponse(
          { error: "Failed to submit Send It vote" },
          corsHeaders,
          500,
        );
      }
    }

    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, corsHeaders, 405);
    }

    try {
      const cachedData = await env.ICECOASTDATA.get("resort_data", "json");
      if (!cachedData) {
        return jsonResponse(
          { error: "Data not available yet", data: null },
          corsHeaders,
          503,
        );
      }

      const senditSummary = await loadSendItSummary(env);
      const metadata =
        cachedData && typeof cachedData === "object"
          ? cachedData._metadata
          : null;
      let staleMinutes = null;
      if (metadata && metadata.lastUpdated) {
        const ts = Date.parse(metadata.lastUpdated);
        if (Number.isFinite(ts)) {
          staleMinutes = Math.max(0, Math.round((Date.now() - ts) / 60000));
        }
      }

      return jsonResponse(
        {
          data: cachedData,
          snapshot: {
            lastUpdated: metadata?.lastUpdated || null,
            staleMinutes,
            metadata: metadata || null,
          },
          senditSummary,
          senditConfig: {
            defaultRadiusMiles: DEFAULT_SENDIT_RADIUS_MILES,
            resortRadiusMiles: SENDIT_RESORT_RADIUS_OVERRIDES,
            maxAccuracyMeters: SENDIT_MAX_ACCURACY_METERS,
            cooldownMinutes: Math.round(SENDIT_SOFT_COOLDOWN_MS / 60000),
            resortCooldownMinutes: Object.fromEntries(
              Object.entries(SENDIT_RESORT_COOLDOWN_OVERRIDES_MS).map(([id, ms]) => [
                id,
                Math.max(1, Math.round(ms / 60000)),
              ]),
            ),
          },
        },
        corsHeaders,
        200,
        { "Cache-Control": "public, max-age=60" },
      );
    } catch (error) {
      console.error("KV fetch failed:", error);
      return jsonResponse(
        { error: "Failed to load data", data: null },
        corsHeaders,
        500,
      );
    }
  },
};
