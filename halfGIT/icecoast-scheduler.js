/**
 * ❄️ ICECOAST Scheduled Worker - Background Data Fetcher (Sliced Merge Mode)
 * - 48 resorts total
 * - Every 5 minutes, updates only a slice of resorts to avoid subrequest limits
 * - Over several runs, all resorts get fresh data, merged into KV
 */

const RESORTS = {
  // Pennsylvania (Poconos)
  camelback: { lat: 41.0525, lon: -75.3560, liftie: 'camelback' },
  'blue-mountain': { lat: 40.8101, lon: -75.5209, liftie: 'blue-mountain' },
  'jack-frost': { lat: 41.0910, lon: -75.4690, liftie: 'null' },
  shawnee: { lat: 41.0380, lon: -75.0770, liftie: 'shawnee' },
  'bear-creek': { lat: 40.7434, lon: -76.0493, liftie: 'null' },
  elk: { lat: 41.6523, lon: -75.5643, liftie: 'null' },
  'big-boulder': { lat: 41.1046, lon: -75.5554, liftie: 'null' },
  montage: { lat: 41.1812, lon: -75.5590, liftie: 'null' },

  // New York (Catskills)
  hunter: { lat: 42.2080, lon: -74.2116, liftie: 'hunter' },
  windham: { lat: 42.2985, lon: -74.2627, liftie: 'windham' },
  belleayre: { lat: 42.1344, lon: -74.5121, liftie: 'belleayre' },
  plattekill: { lat: 42.3037, lon: -74.6538, liftie: 'null' },

  // New York (Adirondacks)
  whiteface: { lat: 44.3611, lon: -73.8865, liftie: 'whiteface' },
  'gore-mountain': { lat: 43.6774, lon: -74.0116, liftie: 'gore-mountain' },

  // Massachusetts
  'jiminy-peak': { lat: 42.5386, lon: -73.2928, liftie: 'jiminy-peak' },
  wachusett: { lat: 42.5153, lon: -71.8900, liftie: 'wachusett' },
  catamount: { lat: 42.1847, lon: -73.2602, liftie: 'null' },
  'berkshire-east': { lat: 42.6201, lon: -72.8915, liftie: 'null' },

  // Connecticut
  mohawk: { lat: 41.6892, lon: -73.3148, liftie: 'mohawk-mountain' },

  // Vermont (Southern)
  stratton: { lat: 43.1172, lon: -72.9094, liftie: 'stratton' },
  'mount-snow': { lat: 42.9714, lon: -72.8963, liftie: 'mount-snow' },
  'magic-mountain': { lat: 43.2013, lon: -72.7791, liftie: 'null' },

  // Vermont (Central)
  killington: { lat: 43.6172, lon: -72.8035, liftie: 'killington' },
  okemo: { lat: 43.4057, lon: -72.7196, liftie: 'okemo' },
  pico: { lat: 43.6597, lon: -72.8521, liftie: 'pico' },
  sugarbush: { lat: 44.1513, lon: -72.8821, liftie: 'sugarbush' },
  'mad-river-glen': { lat: 44.2056, lon: -72.9215, liftie: 'mad-river-glen' },

  // Vermont (Northern)
  stowe: { lat: 44.5385, lon: -72.7844, liftie: 'stowe' },
  'smugglers-notch': { lat: 44.5414, lon: -72.7847, liftie: 'smugglers-notch' },
  'jay-peak': { lat: 44.9338, lon: -72.5049, liftie: 'jay-peak' },
  burke: { lat: 44.5770, lon: -71.9212, liftie: 'burke' },
  'bolton-valley': { lat: 44.4216, lon: -72.8514, liftie: 'null' },

  // New Hampshire (White Mountains)
  loon: { lat: 44.0400, lon: -71.6239, liftie: 'loon' },
  brettonwoods: { lat: 44.0798, lon: -71.3435, liftie: 'brettonwoods' },
  waterville: { lat: 43.9686, lon: -71.5292, liftie: 'waterville' },
  cannon: { lat: 44.1593, lon: -71.7012, liftie: 'cannon' },
  wildcat: { lat: 44.2665, lon: -71.2420, liftie: 'wildcat' },
  'black-mountain': { lat: 44.1890, lon: -71.1649, liftie: 'null' },
  'ragged-mountain': { lat: 43.4864, lon: -71.8420, liftie: 'null' },
  sunapee: { lat: 43.3653, lon: -72.0546, liftie: 'mount-sunapee' },
  'pats-peak': { lat: 43.1775, lon: -71.8440, liftie: 'pats-peak' },

  // Maine
  'sunday-river': { lat: 44.4768, lon: -70.8601, liftie: 'sunday-river' },
  sugarloaf: { lat: 45.0359, lon: -70.3166, liftie: 'sugarloaf' },
  saddleback: { lat: 44.9345, lon: -70.5130, liftie: 'saddleback' },

  // Canada (Quebec)
  tremblant: { lat: 46.2094, lon: -74.5903, liftie: 'mont-tremblant' },
  'mont-sainte-anne': { lat: 47.0711, lon: -70.9061, liftie: 'mont-sainte-anne' },
  'le-massif': { lat: 47.3292, lon: -70.6489, liftie: 'le-massif' },
  'mont-sutton': { lat: 45.0769, lon: -72.4561, liftie: 'mont-sutton' },
};

// Fixed order of 48 resorts
const RESORT_IDS = Object.keys(RESORTS);
const DEFAULT_SLICE_SIZE = 10;
const DEFAULT_SLICE_INTERVAL_MINUTES = 5;
const DEFAULT_REQUEST_TIMEOUT_MS = 9000;
const DEFAULT_REQUEST_DELAY_MS = 200;
const DEFAULT_WEATHER_REFRESH_MINUTES = 90;
const DEFAULT_VC_REFRESH_MINUTES = 360; // every 6 hours per resort
const DEFAULT_MAX_WEATHER_FETCHES_PER_RUN = 7; // each refresh uses 2 OWM calls (current + forecast)
const DEFAULT_MAX_VC_FETCHES_PER_RUN = 2;
const DEFAULT_WEATHER_DAILY_BUDGET = 1400; // OpenWeather API calls/day
const DEFAULT_VC_DAILY_BUDGET = 240; // Visual Crossing records/day
const VC_PRICE_PER_RECORD_USD = 0.0001;
const VC_FREE_RECORDS_PER_DAY = 1000;
const DEFAULT_ALERT_THRESHOLDS = [70, 80, 90, 100];
const DEFAULT_ALERT_EMAILS = ['sendit@icecoast.ski', 'rickt123@gmail.com'];

function parsePositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.floor(n);
  return i > 0 ? i : fallback;
}

async function fetchJsonWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort('timeout'), timeoutMs);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'icecoast-scheduler/1.0',
      },
    });
    return resp;
  } finally {
    clearTimeout(timeout);
  }
}

function toMs(minutes) {
  return Math.max(1, minutes) * 60 * 1000;
}

function isStale(isoTs, ttlMinutes, nowMs) {
  if (!isoTs || typeof isoTs !== 'string') return true;
  const tsMs = Date.parse(isoTs);
  if (!Number.isFinite(tsMs)) return true;
  return (nowMs - tsMs) >= toMs(ttlMinutes);
}

function getUtcDayKey(dateObj) {
  const y = dateObj.getUTCFullYear();
  const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseAlertThresholds(raw) {
  if (!raw || typeof raw !== 'string') return DEFAULT_ALERT_THRESHOLDS.slice();
  const out = raw
    .split(',')
    .map((v) => parseInt(v.trim(), 10))
    .filter((v) => Number.isFinite(v) && v >= 1 && v <= 100);
  if (!out.length) return DEFAULT_ALERT_THRESHOLDS.slice();
  return Array.from(new Set(out)).sort((a, b) => a - b);
}

function parseEmailRecipients(raw) {
  if (!raw || typeof raw !== 'string') return DEFAULT_ALERT_EMAILS.slice();
  const out = raw
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.includes('@'));
  return out.length ? out : DEFAULT_ALERT_EMAILS.slice();
}

function getPercent(used, budget) {
  if (!Number.isFinite(used) || !Number.isFinite(budget) || budget <= 0) return 0;
  return Math.min(1000, Math.round((used / budget) * 100));
}

function getDayProgressFraction(now = new Date()) {
  const mins = (now.getUTCHours() * 60) + now.getUTCMinutes();
  return Math.max(0.01, Math.min(1, mins / 1440));
}

function getProjectedVcMonthlyCost(usedToday, now = new Date()) {
  const dayFrac = getDayProgressFraction(now);
  const projectedDaily = usedToday / dayFrac;
  const projectedPaidDaily = Math.max(0, projectedDaily - VC_FREE_RECORDS_PER_DAY);
  return Number((projectedPaidDaily * VC_PRICE_PER_RECORD_USD * 30).toFixed(2));
}

async function postJson(url, body) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return resp.ok;
}

async function sendResendEmail(env, subject, text, recipients) {
  const apiKey = (env.RESEND_API_KEY || '').trim();
  const from = (env.RESEND_FROM || '').trim();
  if (!apiKey || !from || !Array.isArray(recipients) || !recipients.length) return false;
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject,
        text,
      }),
    });
    return resp.ok;
  } catch (e) {
    console.error('Resend send failed:', e.message);
    return false;
  }
}

async function dispatchBudgetAlert(env, payload) {
  const webhookUrl = (env.BUDGET_ALERT_WEBHOOK_URL || '').trim();
  const recipients = parseEmailRecipients(env.BUDGET_ALERT_EMAILS || '');
  const subjectPrefix = (env.BUDGET_ALERT_SUBJECT_PREFIX || 'Icecoast API Budget').trim();
  const subject = `${subjectPrefix}: ${payload.metric} ${payload.level}% (${payload.used}/${payload.budget})`;
  const text = [
    `Metric: ${payload.metric}`,
    `Level: ${payload.level}%`,
    `Used: ${payload.used}`,
    `Budget: ${payload.budget}`,
    `Percent: ${payload.percent}%`,
    `UTC Day: ${payload.day}`,
    `Projected VC Monthly Cost: $${payload.projectedVcMonthlyCostUsd}`,
    `Timestamp: ${payload.ts}`,
  ].join('\n');

  if (webhookUrl) {
    try {
      await postJson(webhookUrl, payload);
    } catch (e) {
      console.error('Budget webhook failed:', e.message);
    }
  }

  await sendResendEmail(env, subject, text, recipients);
}

function getPowWatchBand(snow72) {
  const n = Number(snow72) || 0;
  if (n >= 8) return 'POW WATCH ON';
  if (n >= 4) return 'POW WATCH BUILDING';
  return 'POW WATCH QUIET';
}

async function fetchVisualCrossingPowWatch(resortId, coords, apiKey) {
  if (!apiKey) return null;
  try {
    // Visual Crossing timeline endpoint (US units -> snow in inches).
    const location = `${coords.lat},${coords.lon}`;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next3days?unitGroup=us&include=days&elements=datetime,snow,precip,precipprob,tempmax,tempmin,windspeed,conditions&key=${apiKey}&contentType=json`;
    const resp = await fetchJsonWithTimeout(url, DEFAULT_REQUEST_TIMEOUT_MS);
    if (!resp.ok) {
      console.error(`Visual Crossing fetch failed for ${resortId}: HTTP ${resp.status}`);
      return null;
    }

    const data = await resp.json();
    const days = Array.isArray(data.days) ? data.days.slice(0, 3) : [];
    if (!days.length) return null;

    const normalizedDays = days.map((d) => ({
      date: d.datetime || null,
      snow: Number.isFinite(Number(d.snow)) ? Number(d.snow) : 0,
      precip: Number.isFinite(Number(d.precip)) ? Number(d.precip) : 0,
      precipProb: Number.isFinite(Number(d.precipprob)) ? Number(d.precipprob) : null,
      tempMax: Number.isFinite(Number(d.tempmax)) ? Math.round(Number(d.tempmax)) : null,
      tempMin: Number.isFinite(Number(d.tempmin)) ? Math.round(Number(d.tempmin)) : null,
      wind: Number.isFinite(Number(d.windspeed)) ? Math.round(Number(d.windspeed)) : null,
      conditions: typeof d.conditions === 'string' ? d.conditions : null,
    }));

    const snow24 = Number((normalizedDays[0]?.snow || 0).toFixed(1));
    const snow48 = Number(((normalizedDays[0]?.snow || 0) + (normalizedDays[1]?.snow || 0)).toFixed(1));
    const snow72 = Number(((normalizedDays[0]?.snow || 0) + (normalizedDays[1]?.snow || 0) + (normalizedDays[2]?.snow || 0)).toFixed(1));

    return {
      provider: 'visualcrossing',
      updatedAt: new Date().toISOString(),
      days: normalizedDays,
      totals: {
        snow24,
        snow48,
        snow72,
      },
      band: getPowWatchBand(snow72),
    };
  } catch (e) {
    console.error(`Visual Crossing fetch failed for ${resortId}:`, e.message);
    return null;
  }
}

function getWeatherIcon(code) {
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 400) return '🌧️';
  if (code >= 500 && code < 600) return '🌧️';
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800) return '☀️';
  if (code === 801) return '🌤️';
  if (code === 802) return '⛅';
  return '☁️';
}

async function fetchWeather(resortId, coords, apiKey) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=imperial`;
    const resp = await fetchJsonWithTimeout(url, DEFAULT_REQUEST_TIMEOUT_MS);
    if (!resp.ok) {
      console.error(`Weather fetch failed for ${resortId}: HTTP ${resp.status}`);
      return null;
    }
    const data = await resp.json();
    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      wind: Math.round(data.wind.speed) + ' mph',
      condition: data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase()),
      icon: getWeatherIcon(data.weather[0].id),
      humidity: data.main.humidity,
      windGust: data.wind.gust ? Math.round(data.wind.gust) + ' mph' : null,
    };
  } catch (e) {
    console.error(`Weather fetch failed for ${resortId}:`, e.message);
    return null;
  }
}

async function fetchForecast(resortId, coords, apiKey) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=imperial&cnt=24`;
    const resp = await fetchJsonWithTimeout(url, DEFAULT_REQUEST_TIMEOUT_MS);
    if (!resp.ok) {
      console.error(`Forecast fetch failed for ${resortId}: HTTP ${resp.status}`);
      return null;
    }
    const data = await resp.json();
    const days = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (const item of data.list) {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      if (!days[dayKey]) {
        days[dayKey] = { day: dayNames[date.getDay()], temps: [], icons: [], snow: 0 };
      }
      days[dayKey].temps.push(item.main.temp);
      days[dayKey].icons.push(item.weather[0].id);
      if (item.snow && item.snow['3h']) {
        days[dayKey].snow += item.snow['3h'] / 25.4;
      }
    }
    const dayList = Object.values(days).slice(0, 3);
    return dayList.map(d => ({
      day: d.day,
      temp: Math.round(d.temps.reduce((a, b) => a + b, 0) / d.temps.length),
      icon: getWeatherIcon(d.icons[Math.floor(d.icons.length / 2)]),
      snow: Number(d.snow.toFixed(1)),
    }));
  } catch (e) {
    console.error(`Forecast fetch failed for ${resortId}:`, e.message);
    return null;
  }
}

async function fetchLiftie(resortId, liftieId) {
  if (!liftieId || liftieId === 'null') return null;
  try {
    const url = `https://liftie.info/api/resort/${liftieId}`;
    const resp = await fetchJsonWithTimeout(url, DEFAULT_REQUEST_TIMEOUT_MS);
    if (!resp.ok) {
      console.error(`Liftie fetch failed for ${resortId}: HTTP ${resp.status}`);
      return null;
    }
    const data = await resp.json();
    if (!data.lifts || typeof data.lifts !== 'object') return null;

    let open = 0;
    let total = 0;
    let closed = 0;
    let details = {};

    // Format A: lifts.status = { "Lift Name": "open" | "closed" | ... }
    if (data.lifts.status && typeof data.lifts.status === 'object') {
      const statuses = data.lifts.status;
      for (const [liftName, rawStatus] of Object.entries(statuses)) {
        const status = String(rawStatus || '').toLowerCase();
        total++;
        if (status === 'open') open++;
        else closed++;
        details[liftName] = status || 'unknown';
      }
    } else {
      // Format B: lifts = { open: [], closed: [], hold: [], scheduled: [] }
      const openList = Array.isArray(data.lifts.open) ? data.lifts.open : [];
      const closedList = Array.isArray(data.lifts.closed) ? data.lifts.closed : [];
      const holdList = Array.isArray(data.lifts.hold) ? data.lifts.hold : [];
      const scheduledList = Array.isArray(data.lifts.scheduled) ? data.lifts.scheduled : [];

      open = openList.length;
      closed = closedList.length + holdList.length + scheduledList.length;
      total = open + closed;

      openList.forEach((name) => { details[String(name)] = 'open'; });
      closedList.forEach((name) => { details[String(name)] = 'closed'; });
      holdList.forEach((name) => { details[String(name)] = 'hold'; });
      scheduledList.forEach((name) => { details[String(name)] = 'scheduled'; });
    }

    if (total <= 0) return null;
    return {
      open,
      total,
      closed,
      details,
      timestamp: new Date().toISOString(),
    };
  } catch (e) {
    console.error(`Liftie fetch failed for ${resortId}:`, e.message);
    return null;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const sliceSize = Math.min(parsePositiveInt(env.SLICE_SIZE, DEFAULT_SLICE_SIZE), RESORT_IDS.length);
    const sliceIntervalMinutes = parsePositiveInt(env.SLICE_INTERVAL_MINUTES, DEFAULT_SLICE_INTERVAL_MINUTES);
    const weatherRefreshMinutes = parsePositiveInt(env.WEATHER_REFRESH_MINUTES, DEFAULT_WEATHER_REFRESH_MINUTES);
    const vcRefreshMinutes = parsePositiveInt(env.VC_REFRESH_MINUTES, DEFAULT_VC_REFRESH_MINUTES);
    const maxWeatherFetchesPerRun = parsePositiveInt(env.MAX_WEATHER_FETCHES_PER_RUN, DEFAULT_MAX_WEATHER_FETCHES_PER_RUN);
    const maxVcFetchesPerRun = parsePositiveInt(env.MAX_VC_FETCHES_PER_RUN, DEFAULT_MAX_VC_FETCHES_PER_RUN);
    const weatherDailyBudget = parsePositiveInt(env.WEATHER_DAILY_BUDGET, DEFAULT_WEATHER_DAILY_BUDGET);
    const vcDailyBudget = parsePositiveInt(env.VC_DAILY_BUDGET, DEFAULT_VC_DAILY_BUDGET);
    const now = new Date();
    const day = getUtcDayKey(now);

    if (url.pathname === '/budget-status' && request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (url.pathname === '/budget-status') {
      if (!env.ICECOASTDATA || typeof env.ICECOASTDATA.get !== 'function') {
        return new Response(JSON.stringify({ error: 'KV binding missing' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      const usageKey = `api_usage_${day}`;
      const usage = (await env.ICECOASTDATA.get(usageKey, 'json')) || {};
      const data = (await env.ICECOASTDATA.get('resort_data', 'json')) || {};
      const metadata = (data && data._metadata) ? data._metadata : {};
      const weatherUsed = Number(usage.weatherApiCalls || 0);
      const vcUsed = Number(usage.vcRecords || 0);
      const weatherPct = getPercent(weatherUsed, weatherDailyBudget);
      const vcPct = getPercent(vcUsed, vcDailyBudget);
      const projectedVcMonthlyCostUsd = getProjectedVcMonthlyCost(vcUsed, now);

      return new Response(JSON.stringify({
        day,
        nowUtc: now.toISOString(),
        budgets: {
          weatherDailyBudget,
          vcDailyBudget,
          thresholds: parseAlertThresholds(env.BUDGET_ALERT_THRESHOLDS || ''),
        },
        usage: {
          weatherApiCalls: weatherUsed,
          vcRecords: vcUsed,
          weatherPercent: weatherPct,
          vcPercent: vcPct,
          projectedVcMonthlyCostUsd,
        },
        scheduler: {
          sliceSize,
          sliceIntervalMinutes,
          weatherRefreshMinutes,
          vcRefreshMinutes,
          maxWeatherFetchesPerRun,
          maxVcFetchesPerRun,
        },
        metadata,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
        },
      });
    }

    return new Response(
      JSON.stringify({
        message: '❄️ IceCoast Scheduler (sliced merge, 41 resorts) - Cron every 5 minutes.',
        note: 'Real work happens in scheduled().',
        totalResorts: RESORT_IDS.length,
        configuredSliceSize: sliceSize,
        configuredSliceIntervalMinutes: sliceIntervalMinutes,
        configuredWeatherRefreshMinutes: weatherRefreshMinutes,
        configuredVcRefreshMinutes: vcRefreshMinutes,
        configuredMaxWeatherFetchesPerRun: maxWeatherFetchesPerRun,
        configuredMaxVcFetchesPerRun: maxVcFetchesPerRun,
        configuredWeatherDailyBudget: weatherDailyBudget,
        configuredVcDailyBudget: vcDailyBudget,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  },

  async scheduled(event, env, ctx) {
    console.log('🎿 Scheduled fetch started at', new Date().toISOString());
    const apiKey = env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENWEATHER_API_KEY; skipping scheduled run.');
      return;
    }
    if (!env.ICECOASTDATA || typeof env.ICECOASTDATA.get !== 'function' || typeof env.ICECOASTDATA.put !== 'function') {
      console.error('Missing ICECOASTDATA KV binding; skipping scheduled run.');
      return;
    }

    // 1) Load previous snapshot
    let previous = await env.ICECOASTDATA.get('resort_data', 'json');
    if (!previous || typeof previous !== 'object') previous = {};
    const combined = {};
    for (const id of RESORT_IDS) {
      combined[id] = previous[id] && typeof previous[id] === 'object' ? { ...previous[id] } : {};
    }

    const totalResorts = RESORT_IDS.length;
    const sliceSize = Math.min(parsePositiveInt(env.SLICE_SIZE, DEFAULT_SLICE_SIZE), totalResorts);
    const sliceIntervalMinutes = parsePositiveInt(env.SLICE_INTERVAL_MINUTES, DEFAULT_SLICE_INTERVAL_MINUTES);
    const requestDelayMs = parsePositiveInt(env.REQUEST_DELAY_MS, DEFAULT_REQUEST_DELAY_MS);
    const weatherRefreshMinutes = parsePositiveInt(env.WEATHER_REFRESH_MINUTES, DEFAULT_WEATHER_REFRESH_MINUTES);
    const vcRefreshMinutes = parsePositiveInt(env.VC_REFRESH_MINUTES, DEFAULT_VC_REFRESH_MINUTES);
    const maxWeatherFetchesPerRun = parsePositiveInt(env.MAX_WEATHER_FETCHES_PER_RUN, DEFAULT_MAX_WEATHER_FETCHES_PER_RUN);
    const maxVcFetchesPerRun = parsePositiveInt(env.MAX_VC_FETCHES_PER_RUN, DEFAULT_MAX_VC_FETCHES_PER_RUN);
    const weatherDailyBudget = parsePositiveInt(env.WEATHER_DAILY_BUDGET, DEFAULT_WEATHER_DAILY_BUDGET);
    const vcDailyBudget = parsePositiveInt(env.VC_DAILY_BUDGET, DEFAULT_VC_DAILY_BUDGET);
    const vcApiKey = (env.VISUAL_CROSSING_API_KEY || '').trim();
    const vcEnabled = !!vcApiKey;
    const totalSlices = Math.ceil(totalResorts / sliceSize);
    const now = new Date(event.scheduledTime || Date.now());
    const nowMs = now.getTime();
    const utcDayKey = getUtcDayKey(now);
    const sliceIndex = Math.floor((now.getTime() / (sliceIntervalMinutes * 60 * 1000)) % totalSlices);
    const start = sliceIndex * sliceSize;
    const end = Math.min(start + sliceSize, totalResorts);
    const slice = RESORT_IDS.slice(start, end);
    const runIso = now.toISOString();

    console.log(`Updating slice ${sliceIndex}: resorts ${start}–${end - 1}`, slice);

    let weatherUpdated = 0;
    let forecastUpdated = 0;
    let liftsUpdated = 0;
    let weatherSkippedFresh = 0;
    let weatherSkippedRunCap = 0;
    let weatherSkippedDailyBudget = 0;
    let vcPowWatchUpdated = 0;
    let vcPowWatchSkippedFresh = 0;
    let vcPowWatchSkippedRunCap = 0;
    let vcPowWatchSkippedDailyBudget = 0;
    let weatherFetchesThisRun = 0;
    let vcFetchesThisRun = 0;

    const usageKey = `api_usage_${utcDayKey}`;
    const alertsKey = `api_alerts_${utcDayKey}`;
    let usage = await env.ICECOASTDATA.get(usageKey, 'json');
    if (!usage || typeof usage !== 'object') usage = {};
    usage.weatherApiCalls = Number.isFinite(Number(usage.weatherApiCalls)) ? Number(usage.weatherApiCalls) : 0;
    usage.vcRecords = Number.isFinite(Number(usage.vcRecords)) ? Number(usage.vcRecords) : 0;
    usage.day = utcDayKey;
    let alerts = await env.ICECOASTDATA.get(alertsKey, 'json');
    if (!alerts || typeof alerts !== 'object') alerts = {};
    if (!alerts.sent || typeof alerts.sent !== 'object') alerts.sent = {};

    for (const resortId of slice) {
      const coords = RESORTS[resortId];
      const weatherIsStale = isStale(combined[resortId]?.weatherUpdatedAt, weatherRefreshMinutes, nowMs)
        || isStale(combined[resortId]?.forecastUpdatedAt, weatherRefreshMinutes, nowMs);
      const canFetchWeatherByRunCap = weatherFetchesThisRun < maxWeatherFetchesPerRun;
      const canFetchWeatherByBudget = (usage.weatherApiCalls + 2) <= weatherDailyBudget;
      const shouldFetchWeather = weatherIsStale && canFetchWeatherByRunCap && canFetchWeatherByBudget;

      const lifts = await fetchLiftie(resortId, coords.liftie);
      if (shouldFetchWeather) {
        const [weather, forecast] = await Promise.all([
          fetchWeather(resortId, coords, apiKey),
          fetchForecast(resortId, coords, apiKey),
        ]);
        usage.weatherApiCalls += 2;
        weatherFetchesThisRun++;

        if (weather) {
          combined[resortId].weather = weather;
          combined[resortId].weatherUpdatedAt = runIso;
          weatherUpdated++;
        }
        if (forecast) {
          combined[resortId].forecast = forecast;
          combined[resortId].forecastUpdatedAt = runIso;
          forecastUpdated++;
        }
      } else if (!weatherIsStale) {
        weatherSkippedFresh++;
      } else if (!canFetchWeatherByRunCap) {
        weatherSkippedRunCap++;
      } else if (!canFetchWeatherByBudget) {
        weatherSkippedDailyBudget++;
      }

      if (lifts) {
        combined[resortId].lifts = lifts;
        combined[resortId].liftsUpdatedAt = runIso;
        liftsUpdated++;
      }

      if (vcEnabled) {
        const existingVcTs = combined[resortId]?.powWatch?.updatedAt;
        const vcIsStale = isStale(existingVcTs, vcRefreshMinutes, nowMs);
        const canFetchVcByRunCap = vcFetchesThisRun < maxVcFetchesPerRun;
        const canFetchVcByBudget = (usage.vcRecords + 1) <= vcDailyBudget;
        if (vcIsStale && canFetchVcByRunCap && canFetchVcByBudget) {
          const powWatch = await fetchVisualCrossingPowWatch(resortId, coords, vcApiKey);
          usage.vcRecords += 1;
          vcFetchesThisRun++;
          if (powWatch) {
            combined[resortId].powWatch = powWatch;
            vcPowWatchUpdated++;
          }
        } else if (!vcIsStale) {
          vcPowWatchSkippedFresh++;
        } else if (!canFetchVcByRunCap) {
          vcPowWatchSkippedRunCap++;
        } else if (!canFetchVcByBudget) {
          vcPowWatchSkippedDailyBudget++;
        }
      }

      combined[resortId]._updatedAt = runIso;

      // Tiny delay, mostly defensive
      await new Promise(resolve => setTimeout(resolve, requestDelayMs));
    }
    await env.ICECOASTDATA.put(usageKey, JSON.stringify(usage));

    const thresholds = parseAlertThresholds(env.BUDGET_ALERT_THRESHOLDS || '');
    const weatherPercent = getPercent(usage.weatherApiCalls, weatherDailyBudget);
    const vcPercent = getPercent(usage.vcRecords, vcDailyBudget);
    const projectedVcMonthlyCostUsd = getProjectedVcMonthlyCost(usage.vcRecords, now);

    for (const level of thresholds) {
      const weatherAlertKey = `weather_${level}`;
      if (weatherPercent >= level && !alerts.sent[weatherAlertKey]) {
        const payload = {
          ts: runIso,
          day: utcDayKey,
          metric: 'OpenWeather',
          level,
          used: usage.weatherApiCalls,
          budget: weatherDailyBudget,
          percent: weatherPercent,
          projectedVcMonthlyCostUsd,
        };
        ctx.waitUntil(dispatchBudgetAlert(env, payload));
        alerts.sent[weatherAlertKey] = runIso;
      }
      const vcAlertKey = `vc_${level}`;
      if (vcPercent >= level && !alerts.sent[vcAlertKey]) {
        const payload = {
          ts: runIso,
          day: utcDayKey,
          metric: 'VisualCrossing',
          level,
          used: usage.vcRecords,
          budget: vcDailyBudget,
          percent: vcPercent,
          projectedVcMonthlyCostUsd,
        };
        ctx.waitUntil(dispatchBudgetAlert(env, payload));
        alerts.sent[vcAlertKey] = runIso;
      }
    }
    await env.ICECOASTDATA.put(alertsKey, JSON.stringify(alerts));

    // Compute overall coverage from merged snapshot
    let weatherCount = 0;
    let forecastCount = 0;
    let liftCount = 0;
    let liftieEligibleCount = 0;
    let liftieCoverageCount = 0;
    let vcPowWatchCoverageCount = 0;
    for (const id of RESORT_IDS) {
      const r = combined[id];
      if (r && r.weather) weatherCount++;
      if (r && r.forecast) forecastCount++;
      if (r && r.lifts) liftCount++;
      if (r && r.powWatch && r.powWatch.provider === 'visualcrossing') vcPowWatchCoverageCount++;
      if (RESORTS[id].liftie && RESORTS[id].liftie !== 'null') {
        liftieEligibleCount++;
        if (r && r.lifts) liftieCoverageCount++;
      }
    }

    const vcEstimatedCallsPerDay = vcEnabled
      ? Math.ceil((24 * 60) / vcRefreshMinutes) * totalResorts
      : 0;
    const vcEstimatedPaidRecordsPerDay = Math.max(0, vcEstimatedCallsPerDay - VC_FREE_RECORDS_PER_DAY);
    const vcEstimatedMonthlyCostUsd = Number((vcEstimatedPaidRecordsPerDay * VC_PRICE_PER_RECORD_USD * 30).toFixed(2));

    const kvData = {
      ...combined,
      _metadata: {
        lastUpdated: runIso,
        weatherCount,
        forecastCount,
        liftCount,
        totalResorts,
        sliceSize,
        totalSlices,
        sliceIntervalMinutes,
        liftieEligibleCount,
        liftieCoverageCount,
        weatherRefreshMinutes,
        maxWeatherFetchesPerRun,
        maxVcFetchesPerRun,
        weatherDailyBudget,
        vcDailyBudget,
        weatherApiCallsUsedToday: usage.weatherApiCalls,
        vcRecordsUsedToday: usage.vcRecords,
        weatherBudgetPercentUsed: weatherPercent,
        vcBudgetPercentUsed: vcPercent,
        projectedVcMonthlyCostUsd,
        vcPowWatchEnabled: vcEnabled,
        vcPowWatchCoverageCount,
        vcRefreshMinutes,
        vcEstimatedCallsPerDay,
        vcEstimatedPaidRecordsPerDay,
        vcEstimatedMonthlyCostUsd,
        updatedThisRun: {
          weather: weatherUpdated,
          forecast: forecastUpdated,
          lifts: liftsUpdated,
          weatherSkippedFresh,
          weatherSkippedRunCap,
          weatherSkippedDailyBudget,
          vcPowWatch: vcPowWatchUpdated,
          vcPowWatchSkippedFresh,
          vcPowWatchSkippedRunCap,
          vcPowWatchSkippedDailyBudget,
          sliceIndex,
          start,
          end: end - 1,
          resortIds: slice,
        },
      },
    };

    await env.ICECOASTDATA.put('resort_data', JSON.stringify(kvData));
    console.log(
      `✅ Slice update complete: coverage ${weatherCount}/${totalResorts} weather, ${forecastCount}/${totalResorts} forecast, ${liftCount}/${totalResorts} lifts (${liftieCoverageCount}/${liftieEligibleCount} Liftie), ${vcPowWatchCoverageCount}/${totalResorts} VC PowWatch (est. $${vcEstimatedMonthlyCostUsd}/mo) (today usage: OWM ${usage.weatherApiCalls}/${weatherDailyBudget}, VC ${usage.vcRecords}/${vcDailyBudget}) (this run: +${weatherUpdated} weather, +${forecastUpdated} forecast, +${liftsUpdated} lifts, +${vcPowWatchUpdated} VC PowWatch)`,
    );
  },
};
