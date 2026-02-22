const DEFAULT_ENDPOINT = 'https://cloudflare-worker.rickt123-0f8.workers.dev/';
const ENDPOINT_PARAM = new URLSearchParams(window.location.search).get('endpoint');
const WORKER_ENDPOINT = (ENDPOINT_PARAM || localStorage.getItem('ICECOAST_BRIEF_ENDPOINT') || DEFAULT_ENDPOINT).trim();
if (ENDPOINT_PARAM) localStorage.setItem('ICECOAST_BRIEF_ENDPOINT', WORKER_ENDPOINT);
const LOCAL_PROFILE_KEY = 'brief_local_profile';
const ALERT_INTENT_KEY = 'brief_alert_intent_4in';
const HISTORY_KEY = 'brief_daily_history';
const LOCAL_RADIUS_MI = 150;
const STORM_MODE_CONFIG = {
  minResortsAt4in: 5,
  minTop10SnowSum: 40,
  minStatesAt6in: 3
};
const DRIVE_MODEL = {
  roadFactor: 1.22,
  avgMph: 55,
  fallbackPeakOffsetHr: 4
};

const RESORT_PASS_MEMBERSHIP = {
  'jack-frost': ['epic'], 'big-boulder': ['epic'], 'hunter': ['epic'], 'mount-snow': ['epic'],
  'okemo': ['epic'], 'stowe': ['epic'], 'wildcat': ['epic'], 'sunapee': ['epic'],
  'camelback': ['ikon'], 'blue-mountain': ['ikon'], 'stratton': ['ikon'], 'killington': ['ikon'],
  'pico': ['ikon'], 'sugarbush': ['ikon'], 'loon': ['ikon'], 'sunday-river': ['ikon'],
  'sugarloaf': ['ikon'], 'tremblant': ['ikon'], 'le-massif': ['ikon'], 'jiminy-peak': ['ikon'],
  montage: ['indy'], mohawk: ['indy'], catamount: ['indy'], 'berkshire-east': ['indy'],
  plattekill: ['indy'], 'jay-peak': ['indy'], burke: ['indy'], 'bolton-valley': ['indy'],
  cannon: ['indy'], 'black-mountain': ['indy'], 'magic-mountain': ['indy'], 'ragged-mountain': ['indy'],
  waterville: ['indy'], saddleback: ['indy'], 'mont-sutton': ['indy'], 'pats-peak': ['indy']
};

const FALLBACK_RESORTS = [
  { id:'sugarloaf', name:'Sugarloaf', loc:'ME', region:'maine', conditions:'Powder', rating:5, snow24:8, temp:16, wind:6, pow:'on', passes:['ikon'], trails:'144/162', price:'$129', snow48:14, snow72:16 },
  { id:'stowe', name:'Stowe Mountain', loc:'VT', region:'vermont-north', conditions:'Powder', rating:5, snow24:6, temp:22, wind:8, pow:'on', passes:['epic'], trails:'116/116', price:'$219', snow48:10, snow72:12 },
  { id:'jay-peak', name:'Jay Peak', loc:'VT', region:'vermont-north', conditions:'Packed Powder', rating:4, snow24:1, temp:18, wind:20, pow:'building', passes:['indy'], trails:'78/78', price:'$89', snow48:4, snow72:6 }
];

const state = {
  search: '',
  regions: [],
  passes: [],
  activeHints: new Set(),
  nlHints: new Set(),
  sortKey: 'snow24',
  sortDir: 'desc',
  currentTab: 'all',
  localMode: false,
  userLocation: null,
  locationLabel: '',
  alertIntent4in: localStorage.getItem(ALERT_INTENT_KEY) === '1',
  resorts: [],
  loadedAt: null,
  source: 'fallback'
};

function saveLocalProfile() {
  if (!state.localMode || !state.userLocation) {
    localStorage.removeItem(LOCAL_PROFILE_KEY);
    return;
  }
  localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify({
    localMode: true,
    userLocation: state.userLocation,
    locationLabel: state.locationLabel || ''
  }));
}

function loadLocalProfile() {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.localMode !== true || !parsed.userLocation) return;
    const lat = Number(parsed.userLocation.lat);
    const lon = Number(parsed.userLocation.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    state.localMode = true;
    state.userLocation = { lat, lon };
    state.locationLabel = typeof parsed.locationLabel === 'string' ? parsed.locationLabel : '';
  } catch (_err) {
    // Ignore corrupted local profile.
  }
}

function saveAlertIntent(on) {
  state.alertIntent4in = Boolean(on);
  localStorage.setItem(ALERT_INTENT_KEY, state.alertIntent4in ? '1' : '0');
}

function updateDailyHistorySnapshots() {
  if (!Array.isArray(state.resorts) || !state.resorts.length) return;
  const today = new Date().toISOString().slice(0, 10);
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch (_err) {
    history = [];
  }
  if (!Array.isArray(history)) history = [];
  history = history.filter((x) => x && typeof x.date === 'string' && typeof x.rows === 'object').slice(-44);
  const existingIdx = history.findIndex((h) => h.date === today);
  const rows = {};
  state.resorts.forEach((r) => {
    rows[r.id] = Number(getDisplayPowTotals(r).snow24.toFixed(1));
  });
  const entry = { date: today, rows };
  if (existingIdx >= 0) history[existingIdx] = entry;
  else history.push(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-45)));
}

function getBestInDaysLabel(resort) {
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch (_err) {
    history = [];
  }
  if (!Array.isArray(history) || history.length < 2) return '';
  const current = getDisplayPowTotals(resort).snow24;
  if (!Number.isFinite(current) || current <= 0) return '';
  const sorted = history
    .filter((h) => h && typeof h.date === 'string' && h.rows && Number.isFinite(Number(h.rows[resort.id])))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  if (sorted.length < 2) return '';
  const today = sorted[sorted.length - 1];
  const prev = sorted.slice(0, -1);
  let days = 1;
  for (let i = prev.length - 1; i >= 0; i -= 1) {
    const v = Number(prev[i].rows[resort.id] || 0);
    if (v >= current) break;
    days += 1;
  }
  return days >= 4 ? `Best in ${days} days` : '';
}

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseWindMph(raw) {
  if (typeof raw === 'number') return Math.round(raw);
  const m = String(raw || '').match(/-?\d+(?:\.\d+)?/);
  return m ? Math.round(Number(m[0])) : 0;
}

function slugToName(slug) {
  return String(slug || '').split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

function parseTrailsString(raw) {
  const parts = String(raw || '').split('/');
  const open = Number(parts[0]);
  const total = Number(parts[1]);
  return {
    open: Number.isFinite(open) ? open : null,
    total: Number.isFinite(total) ? total : null
  };
}

function getLocCode(location) {
  const last = String(location || '').split(',').pop()?.trim();
  return last || 'EC';
}

function toNumOrNull(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function normalizePowWatch(rawPowWatch) {
  const livePowWatch = rawPowWatch && typeof rawPowWatch === 'object' ? rawPowWatch : {};
  const totals = livePowWatch.totals || {};
  const hourly = livePowWatch.hourly || {};
  const windHoldRisk = livePowWatch.windHoldRisk || {};
  const alert = livePowWatch.alert || {};
  const snowLevel = livePowWatch.snowLevel || {};

  return {
    provider: typeof livePowWatch.provider === 'string' ? livePowWatch.provider : null,
    source: typeof livePowWatch.source === 'string' ? livePowWatch.source : null,
    overrideNote: typeof livePowWatch.overrideNote === 'string' ? livePowWatch.overrideNote : null,
    updatedAt: typeof livePowWatch.updatedAt === 'string' ? livePowWatch.updatedAt : null,
    band: typeof livePowWatch.band === 'string' ? livePowWatch.band : '',
    statusLabel: typeof livePowWatch.statusLabel === 'string' ? livePowWatch.statusLabel : null,
    nwsAvailable: Boolean(livePowWatch.nwsAvailable),
    modelSpread72: toNumOrNull(livePowWatch.modelSpread72),
    confidence: typeof livePowWatch.confidence === 'string' ? livePowWatch.confidence : null,
    modelSources: Array.isArray(livePowWatch.modelSources) ? livePowWatch.modelSources.slice(0, 3) : [],
    powBrief: typeof livePowWatch.powBrief === 'string' ? livePowWatch.powBrief : null,
    powBriefSource: typeof livePowWatch.powBriefSource === 'string' ? livePowWatch.powBriefSource : null,
    powBriefUpdatedAt: typeof livePowWatch.powBriefUpdatedAt === 'string' ? livePowWatch.powBriefUpdatedAt : null,
    hourlySourceMix: (livePowWatch.hourlySourceMix && typeof livePowWatch.hourlySourceMix === 'object')
      ? {
        nws: toNumOrNull(livePowWatch.hourlySourceMix.nws) ?? 0,
        vc: toNumOrNull(livePowWatch.hourlySourceMix.vc) ?? 0,
        vc_inferred: toNumOrNull(livePowWatch.hourlySourceMix.vc_inferred) ?? 0,
        none: toNumOrNull(livePowWatch.hourlySourceMix.none) ?? 0
      }
      : { nws: 0, vc: 0, vc_inferred: 0, none: 0 },
    days: Array.isArray(livePowWatch.days) ? livePowWatch.days.slice(0, 3) : [],
    totals: {
      snow24: toNumOrNull(totals.snow24),
      snow48: toNumOrNull(totals.snow48),
      snow72: toNumOrNull(totals.snow72),
      snow24Low: toNumOrNull(totals.snow24Low),
      snow24High: toNumOrNull(totals.snow24High),
      snow48Low: toNumOrNull(totals.snow48Low),
      snow48High: toNumOrNull(totals.snow48High),
      snow72Low: toNumOrNull(totals.snow72Low),
      snow72High: toNumOrNull(totals.snow72High),
      stormTotal: toNumOrNull(totals.stormTotal),
      stormTotalHigh: toNumOrNull(totals.stormTotalHigh)
    },
    hourly: {
      snowSeries24: Array.isArray(hourly.snowSeries24) ? hourly.snowSeries24.slice(0, 24).map(toNumOrNull).filter((v) => v !== null) : [],
      snowSeries48: Array.isArray(hourly.snowSeries48) ? hourly.snowSeries48.slice(0, 48).map(toNumOrNull).filter((v) => v !== null) : [],
      snowSeries72: Array.isArray(hourly.snowSeries72) ? hourly.snowSeries72.slice(0, 72).map(toNumOrNull).filter((v) => v !== null) : [],
      peakTs: typeof hourly.peakTs === 'string' ? hourly.peakTs : null,
      peakLabel: typeof hourly.peakLabel === 'string' ? hourly.peakLabel : null,
      peakSnowPerHour: toNumOrNull(hourly.peakSnowPerHour),
      stormStartTs: typeof hourly.stormStartTs === 'string' ? hourly.stormStartTs : null,
      stormEndTs: typeof hourly.stormEndTs === 'string' ? hourly.stormEndTs : null
    },
    windHoldRisk: {
      level: typeof windHoldRisk.level === 'string' ? windHoldRisk.level : 'LOW',
      maxGustMph: toNumOrNull(windHoldRisk.maxGustMph)
    },
    alert: {
      active: Boolean(alert.active),
      event: typeof alert.event === 'string' ? alert.event : null,
      expires: typeof alert.expires === 'string' ? alert.expires : null,
      headline: typeof alert.headline === 'string' ? alert.headline : null,
      severity: typeof alert.severity === 'string' ? alert.severity : null
    },
    snowLevel: {
      current: toNumOrNull(snowLevel.current),
      trend: typeof snowLevel.trend === 'string' ? snowLevel.trend : null,
      updatedAt: typeof snowLevel.updatedAt === 'string' ? snowLevel.updatedAt : null,
      rainPossibleAtBase: Boolean(snowLevel.rainPossibleAtBase),
      baseElevationFt: toNumOrNull(snowLevel.baseElevationFt)
    }
  };
}

function getDisplayPowTotals(resort) {
  const powWatch = resort?.powWatch || null;
  const hasManualSnowOverride = Boolean(resort?._manualSnowOverride);
  const toSnowTotal = (arr) => Number((Array.isArray(arr) ? arr : []).reduce((sum, v) => sum + (Number(v) || 0), 0).toFixed(1));
  const powWatchNwsHours = Number(powWatch?.hourlySourceMix?.nws || 0);
  const mergedHourly24 = toSnowTotal(powWatch?.hourly?.snowSeries24);
  const mergedHourly48 = toSnowTotal(powWatch?.hourly?.snowSeries48);
  const mergedHourly72 = toSnowTotal(powWatch?.hourly?.snowSeries72);
  const useMergedHourlyTotals = !hasManualSnowOverride
    && Boolean(powWatch?.nwsAvailable)
    && powWatchNwsHours >= 12
    && mergedHourly72 > 0;

  const snow24 = useMergedHourlyTotals
    ? mergedHourly24
    : (toNumOrNull(powWatch?.totals?.snow24) ?? toNumOrNull(resort?.snow24) ?? 0);
  const snow48 = useMergedHourlyTotals
    ? mergedHourly48
    : (toNumOrNull(powWatch?.totals?.snow48) ?? toNumOrNull(resort?.snow48) ?? snow24);
  const snow72 = useMergedHourlyTotals
    ? mergedHourly72
    : (toNumOrNull(powWatch?.totals?.snow72) ?? toNumOrNull(resort?.snow72) ?? snow48);

  return {
    snow24: Number(snow24.toFixed(1)),
    snow48: Number(snow48.toFixed(1)),
    snow72: Number(snow72.toFixed(1)),
    modelSpread72: toNumOrNull(powWatch?.modelSpread72)
  };
}

function getPowDisplayContext(resort) {
  const powWatch = resort?.powWatch || null;
  const totals = getDisplayPowTotals(resort);
  const powAlert = powWatch?.alert || null;
  const hasPowAlert = Boolean(powAlert?.active && powAlert?.event);
  const alertExpiryMs = Date.parse(String(powAlert?.expires || ''));
  const alertExpiryLabel = Number.isFinite(alertExpiryMs)
    ? new Date(alertExpiryMs).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
    : 'later';

  const snowLevelCurrent = Number.isFinite(Number(powWatch?.snowLevel?.current))
    ? Math.round(Number(powWatch.snowLevel.current))
    : null;
  const snowLevelTrendRaw = String(powWatch?.snowLevel?.trend || '').toLowerCase();
  const snowLevelTrendSymbol = snowLevelTrendRaw === 'falling' ? '↓' : (snowLevelTrendRaw === 'rising' ? '↑' : '→');
  const snowLevelLine = snowLevelCurrent !== null
    ? (powWatch?.snowLevel?.rainPossibleAtBase
      ? `Snow Level: ~${snowLevelCurrent.toLocaleString()} ft — rain possible at base`
      : `Snow Level: ~${snowLevelCurrent.toLocaleString()} ft ${snowLevelTrendSymbol} ${snowLevelTrendRaw || 'steady'}`)
    : '';

  const nwsAlertEvent = String(powWatch?.alert?.event || '').trim();
  const windHoldRiskLevelRaw = String(powWatch?.windHoldRisk?.level || 'LOW').toUpperCase();
  const powBriefText = typeof powWatch?.powBrief === 'string' ? powWatch.powBrief.trim() : '';
  const fallbackBlipParts = [];
  if (nwsAlertEvent) fallbackBlipParts.push(`${nwsAlertEvent} active.`);
  if (snowLevelLine) fallbackBlipParts.push(String(snowLevelLine).replace(/^Snow Level:\s*/i, ''));
  if (windHoldRiskLevelRaw === 'HIGH') fallbackBlipParts.push('Wind hold risk is elevated this cycle.');
  const fallbackPowBrief = fallbackBlipParts.join(' ');
  const displayPowBrief = powBriefText || fallbackPowBrief;

  const snowSeries72 = Array.isArray(powWatch?.hourly?.snowSeries72)
    ? powWatch.hourly.snowSeries72.map((v) => Number(v)).filter((v) => Number.isFinite(v))
    : [];
  const compactSeries = snowSeries72.length
    ? snowSeries72.filter((_, idx) => idx % 3 === 0).slice(0, 24)
    : [];
  const fallbackSegments = compactSeries.length
    ? []
    : [
      totals.snow24,
      Math.max(0, totals.snow48 - totals.snow24),
      Math.max(0, totals.snow72 - totals.snow48)
    ];
  const chartSource = compactSeries.length ? compactSeries : fallbackSegments;
  const maxSeriesVal = chartSource.length ? Math.max(...chartSource, 0.1) : 0.1;
  const chartBars = chartSource.length
    ? chartSource.map((v) => {
      const h = Math.max(6, Math.round((Math.max(0, v) / maxSeriesVal) * 34));
      return `<div class="sp-bar${v <= 0 ? ' sp-trace' : ''}" style="height:${h}px"></div>`;
    }).join('')
    : '<div class="sp-bar sp-trace" style="height:2px"></div>';

  const rangeHalf = totals.modelSpread72 !== null ? (totals.modelSpread72 / 2) : 0;
  const potentialLow = Math.max(0, totals.snow72 - rangeHalf);
  const potentialHigh = Math.max(potentialLow, totals.snow72 + rangeHalf);

  return {
    totals,
    hasPowAlert,
    powAlert,
    alertExpiryLabel,
    snowLevelLine,
    displayPowBrief,
    chartBars,
    maxSeriesVal,
    potentialLow,
    potentialHigh
  };
}

function getConfidenceFromPatrol(resort) {
  let level = 'Basic';
  const updatedTs = Date.parse(String(resort?.patrolUpdatedAt || ''));
  if (Number.isFinite(updatedTs)) {
    const hoursOld = (Date.now() - updatedTs) / (60 * 60 * 1000);
    if (hoursOld <= 24) level = 'High';
    else if (hoursOld <= 48) level = 'Medium';
  }
  return level;
}

function derivePowState(powWatch, snow24) {
  const label = String(powWatch?.statusLabel || '').toUpperCase();
  if (label === 'STORM' || label === 'ACTIVE') return 'on';
  if (label === 'INCOMING' || label === 'WINDY') return 'building';
  if ((num(powWatch?.totals?.snow48) >= 3) || snow24 >= 2) return 'building';
  return 'quiet';
}

function deriveRating(live, snow24, temp, wind) {
  const explicit = Number(live?.rating);
  if (Number.isFinite(explicit) && explicit >= 1 && explicit <= 5) return Math.round(explicit);
  let score = 2;
  if (snow24 >= 6) score += 2;
  else if (snow24 >= 3) score += 1;
  if (temp >= 12 && temp <= 30) score += 1;
  if (wind >= 24) score -= 1;
  if (String(live?.weather?.condition || '').toLowerCase().includes('rain')) score -= 1;
  return Math.max(1, Math.min(5, score));
}

function mapLiveToBrief(id, live, catalogMap) {
  const meta = catalogMap.get(id) || {};
  const powWatch = normalizePowWatch(live?.powWatch);
  const totals = powWatch.totals || {};
  const snow24 = num(totals.snow24, num(live?.snowfall?.['24h'], num(live?.snowfall24h, 0)));
  const snow48 = num(totals.snow48, num(live?.snowfall?.['48h'], snow24));
  const snow72 = num(totals.snow72, snow48);
  const temp = Math.round(num(live?.weather?.temp, 0));
  const wind = parseWindMph(live?.weather?.wind);
  const pow = derivePowState(powWatch, snow24);
  const rating = deriveRating(live, snow24, temp, wind);
  const passes = RESORT_PASS_MEMBERSHIP[id] || [];
  const trailsOpen = num(live?.trails?.open, null);
  const trailsTotal = num(live?.trails?.total, null);
  const trails = (Number.isFinite(trailsOpen) && Number.isFinite(trailsTotal) && trailsTotal > 0)
    ? `${trailsOpen}/${trailsTotal}`
    : '—';
  const priceRaw = live?.liftTicket?.weekend || live?.liftTicket?.weekday || live?.liftTicket || null;
  const price = priceRaw ? String(priceRaw) : '—';

  return {
    id,
    name: meta.name || slugToName(id),
    loc: getLocCode(meta.location || meta.loc || ''),
    lat: toNumOrNull(meta.lat),
    lon: toNumOrNull(meta.lon),
    region: meta.region || '',
    conditions: live?.conditions || live?.weather?.condition || 'Unknown',
    rating,
    snow24: Number(snow24.toFixed(1)),
    snow48: Number(snow48.toFixed(1)),
    snow72: Number(snow72.toFixed(1)),
    temp,
    wind,
    feelsLike: toNumOrNull(live?.weather?.feelsLike) ?? toNumOrNull(live?.weather?.feelsLikeF) ?? temp,
    pow,
    powWatch,
    patrolUpdatedAt: typeof live?._updatedAt === 'string' ? live._updatedAt : null,
    warning: (powWatch.alert?.active && powWatch.alert?.event)
      ? { text: `${powWatch.alert.event} in effect`, type: String(powWatch.alert.event).toLowerCase().includes('storm warning') ? 'storm' : 'watch' }
      : null,
    nwsBrief: typeof powWatch.powBrief === 'string' ? powWatch.powBrief : null,
    forecast: Array.isArray(live?.forecast)
      ? live.forecast.slice(0, 3).map((d) => ({
        day: typeof d?.day === 'string' ? d.day : '',
        icon: typeof d?.icon === 'string'
          ? (d.icon.includes('❄') ? 'snow' : d.icon.includes('☀') ? 'sun' : d.icon.includes('🌧') ? 'rain' : 'cloud')
          : 'cloud',
        hi: toNumOrNull(d?.temp) ?? toNumOrNull(d?.high) ?? temp
      }))
      : [],
    passes,
    trails,
    price,
    terrainNote: typeof live?.terrainNote === 'string' ? live.terrainNote.trim() : ''
  };
}

async function loadResorts() {
  const catalog = Array.isArray(window.RESORTS) ? window.RESORTS : [];
  const catalogMap = new Map(catalog.map((r) => [r.id, r]));

  try {
    const resp = await fetch(WORKER_ENDPOINT, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    const raw = (json && typeof json === 'object') ? (json.data && typeof json.data === 'object' ? json.data : json) : {};
    const entries = Object.entries(raw).filter(([k, v]) => !k.startsWith('_') && v && typeof v === 'object');
    const liveResorts = entries.map(([id, live]) => mapLiveToBrief(id, live, catalogMap));

    if (!liveResorts.length) throw new Error('No resort rows in payload');

    state.resorts = liveResorts;
    state.loadedAt = json?.snapshot?.lastUpdated || raw?._metadata?.lastUpdated || new Date().toISOString();
    state.source = 'live';
  } catch (err) {
    console.warn('Brief V2 lab fallback mode:', err.message);
    state.resorts = FALLBACK_RESORTS.slice();
    state.loadedAt = new Date().toISOString();
    state.source = 'fallback';
  }
}

function applyManualOverridesToResorts() {
  const raw = window.MANUAL_RESORT_OVERRIDES;
  const overrides = (raw && typeof raw === 'object') ? raw : {};
  if (!state.resorts.length || !Object.keys(overrides).length) return;

  state.resorts = state.resorts.map((resort) => {
    const ov = overrides[resort.id];
    if (!ov || typeof ov !== 'object') return resort;

    const next = { ...resort };
    let hasManualSnowOverride = false;

    if (typeof ov.conditions === 'string' && ov.conditions.trim()) {
      next.conditions = ov.conditions.trim();
    }
    if (typeof ov.terrainNote === 'string') {
      next.terrainNote = ov.terrainNote.trim();
    } else if (typeof ov.patrolNote === 'string') {
      next.terrainNote = ov.patrolNote.trim();
    }
    if (Number.isFinite(Number(ov.icecoastRating))) {
      next.rating = Math.max(1, Math.min(5, Math.round(Number(ov.icecoastRating))));
    }
    if (Number.isFinite(Number(ov.snowfall24h))) {
      next.snow24 = Number(Number(ov.snowfall24h).toFixed(1));
      if (next.powWatch?.totals) next.powWatch.totals.snow24 = next.snow24;
      hasManualSnowOverride = true;
    }
    if (Number.isFinite(Number(ov.snowfall48h))) {
      next.snow48 = Number(Number(ov.snowfall48h).toFixed(1));
      if (next.powWatch?.totals) next.powWatch.totals.snow48 = next.snow48;
      hasManualSnowOverride = true;
    }
    if (Number.isFinite(next.snow48) && Number.isFinite(next.snow24) && next.snow48 < next.snow24) {
      next.snow48 = next.snow24;
    }
    if (Number.isFinite(next.snow72) && Number.isFinite(next.snow48) && next.snow72 < next.snow48) {
      next.snow72 = next.snow48;
      if (next.powWatch?.totals) next.powWatch.totals.snow72 = next.snow72;
    }

    if (hasManualSnowOverride) {
      next._manualSnowOverride = true;
    }

    if (typeof ov._patrolUpdatedAt === 'string') {
      next.patrolUpdatedAt = ov._patrolUpdatedAt;
    }

    const trailsFromOverride = Number.isFinite(Number(ov?.trails?.open)) ? Number(ov.trails.open) : null;
    const totalFromOverride = Number.isFinite(Number(ov?.trails?.total)) ? Number(ov.trails.total) : null;
    const parsed = parseTrailsString(next.trails);
    const open = trailsFromOverride ?? parsed.open;
    const total = totalFromOverride ?? parsed.total;
    if (Number.isFinite(open) && Number.isFinite(total) && total > 0) {
      next.trails = `${open}/${total}`;
    } else if (Number.isFinite(open)) {
      next.trails = `${open}/—`;
    }

    const ticketWeekend = typeof ov?.liftTicket?.weekend === 'string' ? ov.liftTicket.weekend.trim() : '';
    const ticketWeekday = typeof ov?.liftTicket?.weekday === 'string' ? ov.liftTicket.weekday.trim() : '';
    if (ticketWeekend || ticketWeekday) {
      next.price = ticketWeekend || ticketWeekday;
    }

    return next;
  });
}

function tickClock() {
  const el = document.getElementById('liveTime');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleString('en-US', {
    weekday:'short', month:'short', day:'numeric',
    hour:'numeric', minute:'2-digit', hour12:true
  });
}

function updateNameplateRule() {
  const el = document.getElementById('nameplateRule');
  if (!el) return;
  const count = Array.isArray(state.resorts) ? state.resorts.length : 0;
  el.textContent = `EST 2026 • EAST COAST • ${count} RESORTS`;
}

function buildForecastBars(containerId, days) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const max = Math.max(...days.map((d) => d.snow), 0.1);
  el.innerHTML = days.map((d) => {
    const h = Math.max((d.snow / max) * 28, d.snow > 0 ? 3 : 0);
    const trace = d.snow <= 0.1;
    return `<div class="forecast-day"><div class="forecast-bar-wrap"><div class="forecast-bar${trace ? ' trace' : ''}" style="height:${h}px"></div></div><div class="forecast-day-lbl">${d.day}</div><div class="forecast-day-amt">${d.snow > 0 ? `${d.snow}"` : '—'}</div></div>`;
  }).join('');
}

const RESORT_LORE = {
  'sugarloaf': {
    name: 'The Loaf',
    nuclear: { verbs: ['nuking', 'sending it', 'absolutely cooking', 'going full Carrabassett', 'doing Loafer things'], decks: ['The Snowfields are loaded. Brackett Basin is calling. This is what the drive is for.', 'Above-treeline skiing. The whole Carrabassett Valley is buried. You know what to do.', 'The Bigelow Boys would approve. Oh-My-Gosh Corner delivers.'] },
    sending: { verbs: ['stacking it', 'freaking', 'delivering', 'putting down'], decks: ['The Loaf is working. Narrow Gauge, Bubblecuffer, pick your poison.', 'Sugarloafers are already in the lift line. First tracks matter here.'] },
    building: { verbs: ['loading up', 'getting after it', 'warming up'], decks: ['Storm on the way to Carrabassett Valley. Worth watching.', "The drive pays off when The Loaf fires. It's loading."] },
    quiet: { verbs: ['showing up', 'being the Loaf', 'holding court'], decks: ['Groomed and cold. The Superquad is spinning. That is enough.', "The Loaf doesn't need powder to be worth the drive. It just helps."] }
  },
  'sunday-river': {
    name: 'Sunday River',
    nuclear: { verbs: ['nuking', 'going off', 'delivering proper Maine pow'], decks: ['Eight peaks, all of them loaded. The Outfit gang is out.', "Sunday River when it snows is a different animal. This is that day."] },
    sending: { verbs: ['stacking', 'putting in work', 'running'], decks: ['Jordan Bowl is going to be good. Sunday River in form.', "The snowmaking backbone plus natural snow. This is what it's built for."] },
    building: { verbs: ['building', 'loading', 'watching the forecast'], decks: ['Storm track is favorable for the Sunday River terrain.', 'Worth the ride up 26. Give it a day.'] },
    quiet: { verbs: ['grinding', 'staying open', 'making it work'], decks: ['Solid grooming. All eight peaks accessible. Maine does not apologize.', 'Sunday River on manufactured snow is still Sunday River.'] }
  },
  'jay-peak': {
    name: 'Jay',
    nuclear: { verbs: ['getting buried', 'catching the Jay Cloud', 'doing Jay things', 'hammering'], decks: ['Most snow east of the Rockies, today it is earning the title. The tram is running.', 'Quebec Clipper came through. Jay is doing what Jay does best.', 'The Face Chutes are loaded. The in-bounds policy is liberal. You know the reputation.'] },
    sending: { verbs: ['stacking', 'delivering', 'running'], decks: ['Jay in form is Jay at its best. Glades, tram, repeat.', 'The Montreal Express is your friend today. Jay is benefiting.'] },
    building: { verbs: ['loading', 'watching the border', 'building'], decks: ['Storm system tracking toward the Northeast Kingdom. Jay catches everything.', "Every clipper has to cross the border somehow. Jay's geography wins again."] },
    quiet: { verbs: ['grinding', 'being Jay', 'holding'], decks: ['The glades hold snow longer than anywhere. Jay even on a quiet day.', 'Short lines. Good terrain. The remote location earns its keep.'] }
  },
  'stowe': {
    name: 'Stowe',
    nuclear: { verbs: ['firing', 'earning its title', 'living up to the legend', 'delivering Front Four conditions'], decks: ['Mount Mansfield in a storm. The Ski Capital of the East is in full effect.', 'The Front Four when loaded is the East Coast benchmark. This is that day.', 'Stowe has been doing this since 1937. Some things do not change.'] },
    sending: { verbs: ['showing up', 'delivering', 'putting on a show'], decks: ['Mansfield is making a case. Liftline is going to be good.', 'The birthplace of alpine skiing in Vermont is earning its history today.'] },
    building: { verbs: ['loading', 'watching Mansfield', 'building toward something'], decks: ["Storm window looks favorable for Vermont's highest peak.", "Stowe doesn't do anything small. This one's worth tracking."] },
    quiet: { verbs: ['grooming', 'being Stowe', 'doing the classics'], decks: ['National. Goat. Starr. Liftline. Even groomed, these runs hold weight.', 'Corduroy on the Front Four is still the Front Four.'] }
  },
  'killington': {
    name: 'Killington',
    nuclear: { verbs: ['going berserk', 'earning Beast of the East', 'absolutely sending it'], decks: ["The Beast has 3,000 acres. When it snows, there's nowhere better.", 'Killington in a real storm is a different resort. This is that resort.'] },
    sending: { verbs: ['delivering', 'putting in Beast hours', 'loading up'], decks: ['K1 gondola. Superstar. Cascade. Big mountain eating big snow.', 'Six peaks, fresh snow. The Beast is earning it.'] },
    building: { verbs: ['building', 'watching the weather'], decks: ['Snowmaking backbone plus incoming natural. Killington has options.', 'First to open, last to close. The Beast is patient.'] },
    quiet: { verbs: ['grooming', 'being the Beast', 'open late'], decks: ['150 trails, corduroy. The Beast does not need your validation.', 'Longest ski season in the East for a reason. Open and running.'] }
  },
  'gore-mountain': {
    name: 'Gore',
    nuclear: { verbs: ['going deep', 'delivering ADK pow', 'cooking in the Adirondacks'], decks: ['No condos on the summit. Just forest and Adirondack State Park as far as you can see, loaded.', "Gore in a storm is New York's best-kept secret earning its legend."] },
    sending: { verbs: ['stacking', 'delivering', 'working the Adirondacks'], decks: ['The gondola is running. North Side is holding snow. Old school Gore.', 'No pretension here. Brown bag lunch, good snow, Adirondack forest.'] },
    building: { verbs: ['loading', 'building'], decks: ['Gore lies in the Adirondacks. The snowfall here surprises people.', 'Worth the drive up from Albany. Storm has Gore in its path.'] },
    quiet: { verbs: ['grooming', 'being Gore', 'holding court in North Creek'], decks: ['Down-to-earth ADK vibe. More terrain than you would expect. Quiet lifts.', "New York's largest ski resort, and barely anyone outside the state knows it."] }
  },
  'tremblant': {
    name: 'Tremblant',
    nuclear: { verbs: ['en fuego', 'going full Quebec', 'delivering north of the border'], decks: ['Quebec clipper country. Tremblant catches everything that crosses the border.', 'Le mountain est en feu. 102 trails under proper Canadian snow.'] },
    sending: { verbs: ['delivering', 'stacking', 'putting in work'], decks: ['Tremblant in form is the East Coast argument for not going west.', '94 trails under Laurentian snow. The answer is oui.'] },
    building: { verbs: ['loading', 'building toward something'], decks: ['Laurentian storm system is tracking. Tremblant geography wins.'] },
    quiet: { verbs: ['grooming', 'running', 'holding court'], decks: ['Cold, groomed, open. Tremblant does not need powder to justify the drive.'] }
  }
};

const REGION_LORE = {
  'vermont-north': { nuclear: ['going absolutely nuclear', 'nuking', 'catching the storm'], sending: ['stacking', 'delivering'], building: ['loading up', 'building', 'watching the Vermont sky'], quiet: ['grooming', 'holding', 'running'] },
  'vermont-central': { nuclear: ['firing', 'going deep', 'delivering Mad River Valley snow'], sending: ['stacking', 'delivering'], building: ['loading', 'building'], quiet: ['grooming', 'holding'] },
  'maine': { nuclear: ['nuking', 'going full Maine', 'sending it'], sending: ['stacking', 'delivering'], building: ['loading', 'building'], quiet: ['grooming', 'holding'] },
  'white-mountains': { nuclear: ['going deep', 'delivering White Mountain snow'], sending: ['stacking', 'delivering'], building: ['loading', 'building'], quiet: ['grooming', 'running'] },
  'adirondacks': { nuclear: ['going deep', 'cooking in the ADKs'], sending: ['stacking', 'delivering'], building: ['loading', 'building'], quiet: ['grooming', 'holding'] },
  'catskills': { nuclear: ['going full Catskills', 'delivering'], sending: ['stacking', 'delivering'], building: ['loading', 'building'], quiet: ['running the groomers', 'holding'] },
  'poconos': { nuclear: ['going off', 'delivering Pocono snow'], sending: ['stacking', 'delivering'], building: ['loading', 'building'], quiet: ['running', 'holding'] },
  'canada': { nuclear: ['going full Quebec', 'delivering north of the border'], sending: ['stacking', 'delivering'], building: ['loading', 'building'], quiet: ['grooming', 'running'] }
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWithAvoid(arr, avoidValue) {
  if (!Array.isArray(arr) || arr.length === 0) return '';
  if (!avoidValue) return pick(arr);
  const filtered = arr.filter((v) => v !== avoidValue);
  return pick(filtered.length ? filtered : arr);
}

const WEAK_HEADLINE_VERBS = new Set([
  'running',
  'showing up',
  'holding',
  'making it work',
  'working'
]);

const NEVER_HEADLINE_VERBS = new Set([
  'being the loaf',
  'being jay',
  'being stowe',
  'being gore',
  'being the beast',
  'holding court',
  'doing the classics',
  'open late',
  'en fuego'
]);

const STRONG_VERBS_BY_TIER = {
  nuclear: ['getting nuked', 'firing hard', 'going off', 'stacking deep'],
  sending: ['firing', 'delivering', 'stacking up', 'skiing soft'],
  building: ['loading up', 'lining up', 'on deck', 'trending up'],
  quiet: ['skiing fast', 'holding good snow', 'riding clean', 'worth laps']
};

const REGION_VOICE = {
  'vermont-north': ['Green Mountain weather doing Green Mountain weather things.'],
  'vermont-central': ['Mad River Valley energy is fully online.'],
  'maine': ['Maine legs required.'],
  'white-mountains': ['Granite State turns are in play.'],
  'adirondacks': ['ADK laps are worth the drive right now.'],
  'catskills': ['Catskills are punching above their weight today.'],
  'poconos': ['Pocono grinders can make this work.'],
  'canada': ['Québec cold keeps this snow honest.']
};

function getLoreTier(resort, totals) {
  if (totals.snow24 >= 8) return 'nuclear';
  if (totals.snow24 >= 4) return 'sending';
  if (resort.pow === 'building') return 'building';
  return 'quiet';
}

function normalizeVerb(v) {
  return String(v || '').trim().toLowerCase();
}

function chooseHeadlineVerb({ tier, totals, avoidVerb, seedVerb, candidateVerbs = [] }) {
  const avoid = normalizeVerb(avoidVerb);
  const seeded = normalizeVerb(seedVerb);
  const needsHighEnergy = totals.snow24 >= 4 || totals.snow72 >= 8;
  const desired = Array.isArray(candidateVerbs) ? candidateVerbs.slice() : [];
  if (seeded) desired.unshift(seedVerb);
  let filtered = desired.filter((v) => {
    const nv = normalizeVerb(v);
    return nv !== avoid && !NEVER_HEADLINE_VERBS.has(nv);
  });

  if (needsHighEnergy) {
    filtered = filtered.filter((v) => !WEAK_HEADLINE_VERBS.has(normalizeVerb(v)));
  }

  if (!filtered.length) {
    filtered = (STRONG_VERBS_BY_TIER[tier] || STRONG_VERBS_BY_TIER.sending)
      .filter((v) => normalizeVerb(v) !== avoid && !NEVER_HEADLINE_VERBS.has(normalizeVerb(v)));
  }

  return pick(filtered.length ? filtered : STRONG_VERBS_BY_TIER.sending);
}

function buildDelightDeck(resort, tier) {
  const cultureLine = pick(REGION_VOICE[resort.region] || ['East Coast legs required.']);
  const powCtx = getPowDisplayContext(resort);
  const windRisk = String(resort?.powWatch?.windHoldRisk?.level || '').toUpperCase();
  const hasAlert = Boolean(resort?.powWatch?.alert?.active && resort?.powWatch?.alert?.event);

  if (tier === 'nuclear') {
    if (hasAlert) return `Deep turns are live and patrol is flagging active weather. Hit sheltered terrain early, then chase reloads. ${cultureLine}`;
    return `This is an all-timer window. Prioritize first-chair laps and protected lines before it gets tracked. ${cultureLine}`;
  }

  if (tier === 'sending') {
    if (windRisk === 'HIGH') return `Snow is on and ski quality is there, but wind could clip upper lifts. Build your day around mid-mountain flow. ${cultureLine}`;
    return `Coverage is strong and turns are soft in the right zones. Plan first laps where the mountain loads quickest. ${cultureLine}`;
  }

  if (tier === 'building') {
    if (powCtx.displayPowBrief) return `Window is still building. ${powCtx.displayPowBrief} Time the drive for the reload push, not just opening bell. ${cultureLine}`;
    return `Window is still building. This one is a strong second-wave play once the next band moves through. ${cultureLine}`;
  }

  if (windRisk === 'HIGH') return `Fast snow with mixed grip; treat upper lifts as a maybe and stack efficient mid-mountain laps. ${cultureLine}`;
  return `Not a hero day, but absolutely skiable if you stay disciplined on aspect and timing. ${cultureLine}`;
}

function getLeadLore(resort, options = {}) {
  const sharedLexicon = (typeof window !== 'undefined' && window.ICECOAST_LEXICON) ? window.ICECOAST_LEXICON : null;
  const avoidVerb = typeof options.avoidVerb === 'string' ? options.avoidVerb : '';
  const totals = getDisplayPowTotals(resort);
  const tier = getLoreTier(resort, totals);
  const lore = RESORT_LORE[resort.id];
  let base = null;

  if (sharedLexicon && typeof sharedLexicon.getVerb === 'function') {
    base = sharedLexicon.getVerb(resort, options);
  }

  if (!base && lore) {
    const t = lore[tier] || lore.quiet;
    base = { verb: pickWithAvoid(t.verbs, avoidVerb), deck: pick(t.decks), displayName: lore.name };
  }

  const regionLore = REGION_LORE[resort.region] || {
    nuclear: ['going deep'],
    sending: ['stacking'],
    building: ['building'],
    quiet: ['running']
  };
  const tierLore = lore ? (lore[tier] || lore.quiet) : null;
  const candidateVerbs = [
    ...(tierLore?.verbs || []),
    ...((regionLore[tier] || regionLore.quiet) || [])
  ];
  const selectedVerb = chooseHeadlineVerb({
    tier,
    totals,
    avoidVerb,
    seedVerb: base?.verb,
    candidateVerbs
  });

  return {
    verb: selectedVerb,
    deck: buildDelightDeck(resort, tier),
    displayName: resort.name
  };
}

function getLocalLeadList() {
  if (!state.localMode || !state.userLocation) return null;
  const withDistance = state.resorts
    .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lon))
    .map((r) => {
      const miles = haversineMiles(state.userLocation.lat, state.userLocation.lon, r.lat, r.lon);
      return { ...r, _distanceMiles: miles };
    });

  if (!withDistance.length) return null;

  const inRadius = withDistance.filter((r) => r._distanceMiles <= LOCAL_RADIUS_MI);
  const pool = inRadius.length >= 2
    ? inRadius
    : withDistance.sort((a, b) => a._distanceMiles - b._distanceMiles).slice(0, 10);

  const powRankMap = { on: 0, building: 1, quiet: 2 };
  return pool.sort((a, b) => {
    const snowDiff = getDisplayPowTotals(b).snow24 - getDisplayPowTotals(a).snow24;
    if (snowDiff !== 0) return snowDiff;
    const powDiff = (powRankMap[a.pow] ?? 2) - (powRankMap[b.pow] ?? 2);
    if (powDiff !== 0) return powDiff;
    const distDiff = (a._distanceMiles ?? 9999) - (b._distanceMiles ?? 9999);
    if (distDiff !== 0) return distDiff;
    return b.rating - a.rating;
  });
}

function updateLocalStatus() {
  const statusEl = document.getElementById('localStatus');
  if (!statusEl) return;
  if (!state.localMode || !state.userLocation) {
    statusEl.textContent = '';
    return;
  }
  const localList = getLocalLeadList();
  if (!localList || !localList.length) {
    statusEl.textContent = 'Local mode on. Could not score nearby resorts yet.';
    return;
  }
  const top = localList[0];
  const totals = getDisplayPowTotals(top);
  const dist = Number.isFinite(top._distanceMiles) ? `${Math.round(top._distanceMiles)} mi` : '';
  const place = state.locationLabel ? `near ${state.locationLabel}` : 'near you';
  statusEl.textContent = `Local mode ${place}: ${top.name} leads (${totals.snow24.toFixed(1)}" / 24h${dist ? ` · ${dist}` : ''}).`;
}

function setLocalLocation(lat, lon, label = '') {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
  state.localMode = true;
  state.userLocation = { lat, lon };
  state.locationLabel = label;
  saveLocalProfile();
  renderTicker();
}

function updateLeadStories(list) {
  const topA = list[0] || FALLBACK_RESORTS[0];
  const topB = list[1] || FALLBACK_RESORTS[1] || topA;
  const stories = document.querySelectorAll('.lead-story');
  const loreA = getLeadLore(topA);
  const loreB = getLeadLore(topB, { avoidVerb: loreA.verb });

  function fillStory(storyEl, resort, modeLabel, lore) {
    if (!storyEl || !resort) return;
    const signalEl = storyEl.querySelector('.lead-signal');
    const headlineEl = storyEl.querySelector('.lead-headline');
    const deckEl = storyEl.querySelector('.lead-deck');
    const statVals = storyEl.querySelectorAll('.lead-stat-val');
    const totals = getDisplayPowTotals(resort);
    const signalLabel = resort.pow === 'on'
      ? `Powder Alert · ${totals.snow24}" / 24h`
      : (resort.pow === 'building'
        ? `Storm Building · ${totals.snow72.toFixed(1)}" forecast`
        : `${modeLabel} · ${resort.conditions}`);
    signalEl.className = `lead-signal ${resort.pow === 'on' ? 'pow' : resort.pow === 'building' ? 'building' : 'groomed'}`;
    signalEl.innerHTML = `<span class="sig-dot"></span>${signalLabel}`;
    headlineEl.innerHTML = `${lore.displayName}: <em>${lore.verb}</em>`;
    deckEl.textContent = lore.deck;

    if (statVals.length >= 4) {
      statVals[0].textContent = `${totals.snow24.toFixed(1)}"`;
      statVals[1].textContent = `${totals.snow72.toFixed(1)}"`;
      statVals[2].textContent = `${resort.temp}°F`;
      statVals[3].textContent = `${resort.wind} mph`;
    }
  }

  fillStory(stories[0], topA, 'Pow Signal', loreA);
  fillStory(stories[1], topB, 'Storm Window', loreB);

  const topATotals = getDisplayPowTotals(topA);
  const topBTotals = getDisplayPowTotals(topB);

  buildForecastBars('lead1Forecast', [
    { day: 'Thu', snow: Number((topATotals.snow24 * 0.35).toFixed(1)) },
    { day: 'Fri', snow: Number(topATotals.snow24.toFixed(1)) },
    { day: 'Sat', snow: Number((Math.max(0, topATotals.snow48 - topATotals.snow24)).toFixed(1)) },
    { day: 'Sun', snow: Number((Math.max(0, topATotals.snow72 - topATotals.snow48)).toFixed(1)) },
    { day: 'Mon', snow: 0 }
  ]);

  buildForecastBars('lead2Forecast', [
    { day: 'Thu', snow: Number((topBTotals.snow24 * 0.35).toFixed(1)) },
    { day: 'Fri', snow: Number(topBTotals.snow24.toFixed(1)) },
    { day: 'Sat', snow: Number((Math.max(0, topBTotals.snow48 - topBTotals.snow24)).toFixed(1)) },
    { day: 'Sun', snow: Number((Math.max(0, topBTotals.snow72 - topBTotals.snow48)).toFixed(1)) },
    { day: 'Mon', snow: 0 }
  ]);
}

function getPowPip(pow) {
  if (pow === 'on') return '<div class="pow-pip on"></div>';
  if (pow === 'building') return '<div class="pow-pip building"></div>';
  return '<div class="pow-pip"></div>';
}

function getRatingBlocks(rating, pow) {
  let blocks = '';
  for (let i = 1; i <= 5; i++) {
    const cls = i <= rating ? (pow === 'on' ? 'on pow-on' : 'on') : '';
    blocks += `<div class="rat-sq${cls ? ` ${cls}` : ''}"></div>`;
  }
  return `<div class="rr-rating">${blocks}</div>`;
}

function getForecastIconSrc(icon) {
  const key = String(icon || '').toLowerCase();
  if (key === 'snow') return '../weather_icons/snow.svg';
  if (key === 'sun') return '../weather_icons/clear-day.svg';
  if (key === 'rain') return '../weather_icons/rain.svg';
  return '../weather_icons/overcast.svg';
}

const CHIP_MAP = {
  pow: { type: 'vibe', label: '⚡ POW On' },
  storm: { type: 'vibe', label: '🌨 Storm Coming' },
  ice: { type: 'vibe', label: '🧊 Avoid Ice' },
  cold: { type: 'vibe', label: '🥶 Cold' },
  ikon: { type: 'pass', label: 'Ikon' },
  epic: { type: 'pass', label: 'Epic' },
  indy: { type: 'pass', label: 'Indy' },
  indie: { type: 'pass', label: 'No Pass' },
  vt: { type: 'state', regions: ['vermont-north', 'vermont-central'], label: 'Vermont' },
  me: { type: 'state', regions: ['maine'], label: 'Maine' },
  nh: { type: 'state', regions: ['white-mountains'], label: 'NH' },
  ny: { type: 'state', regions: ['catskills', 'adirondacks'], label: 'New York' },
  pa: { type: 'state', regions: ['poconos'], label: 'PA' },
  ma: { type: 'state', regions: ['massachusetts'], label: 'MA' },
  ct: { type: 'state', regions: ['connecticut'], label: 'CT' },
  nj: { type: 'state', regions: ['new-jersey'], label: 'NJ' },
  wv: { type: 'state', regions: ['west-virginia'], label: 'WV' },
  qc: { type: 'state', regions: ['canada'], label: 'Québec' },
  'northern-vt': { type: 'region', region: 'vermont-north', label: 'N. Vermont' },
  'central-vt': { type: 'region', region: 'vermont-central', label: 'C. Vermont' },
  'white-mtns': { type: 'region', region: 'white-mountains', label: 'White Mtns' },
  catskills: { type: 'region', region: 'catskills', label: 'Catskills' },
  adirondacks: { type: 'region', region: 'adirondacks', label: 'Adirondacks' },
  maine: { type: 'region', region: 'maine', label: 'Maine' },
  poconos: { type: 'region', region: 'poconos', label: 'Poconos' },
  canada: { type: 'region', region: 'canada', label: 'Canada' }
};

function getAllActive() {
  return new Set([...state.activeHints, ...(state.nlHints || new Set())]);
}

function updateExpandBtnBadge() {
  const expandBtn = document.getElementById('dispatchExpandBtn');
  if (!expandBtn) return;
  const drawerActive = [...state.activeHints].filter((cmd) => !['pow', 'storm'].includes(cmd)).length;
  const lbl = expandBtn.querySelector('.deb-label');
  const existing = expandBtn.querySelector('.deb-count');
  if (existing) existing.remove();
  if (drawerActive > 0 && lbl) {
    lbl.insertAdjacentHTML('afterend', `<span class="deb-count">${drawerActive}</span>`);
  }
}

function applyFilters() {
  let list = state.resorts.slice();
  const q = state.search.trim().toLowerCase();
  const active = getAllActive();

  if (state.currentTab === 'favorites') {
    list = list.filter((r) => savedResorts.has(r.id));
  }

  if (q) {
    list = list.filter((r) =>
      r.name.toLowerCase().includes(q)
      || r.loc.toLowerCase().includes(q)
      || r.region.toLowerCase().includes(q)
      || r.conditions.toLowerCase().includes(q)
      || (r.passes || []).some((p) => p.includes(q))
    );
  }

  if (active.has('pow')) list = list.filter((r) => r.pow === 'on');
  if (active.has('storm')) list = list.filter((r) => r.pow === 'on' || r.pow === 'building');
  if (active.has('ice')) list = list.filter((r) => r.conditions.toLowerCase().includes('ice'));
  if (active.has('cold')) list = list.filter((r) => r.temp < 20);

  if (active.has('ikon')) list = list.filter((r) => (r.passes || []).includes('ikon'));
  if (active.has('epic')) list = list.filter((r) => (r.passes || []).includes('epic'));
  if (active.has('indy')) list = list.filter((r) => (r.passes || []).includes('indy'));
  if (active.has('indie')) list = list.filter((r) => !(r.passes || []).length);

  const targetRegions = new Set();
  [...active].forEach((cmd) => {
    const meta = CHIP_MAP[cmd];
    if (!meta) return;
    if (meta.type === 'state') meta.regions.forEach((reg) => targetRegions.add(reg));
    if (meta.type === 'region') targetRegions.add(meta.region);
  });
  if (targetRegions.size) list = list.filter((r) => targetRegions.has(r.region));

  const powRank = { on: 0, building: 1, quiet: 2 };
  list.sort((a, b) => {
    let primary = 0;
    if (state.sortKey === 'name') {
      primary = String(a.name || '').localeCompare(String(b.name || ''), 'en', { sensitivity: 'base' });
    } else if (state.sortKey === 'conditions') {
      primary = String(a.conditions || '').localeCompare(String(b.conditions || ''), 'en', { sensitivity: 'base' });
    } else if (state.sortKey === 'rating') {
      primary = (Number(a.rating) || 0) - (Number(b.rating) || 0);
    } else {
      primary = (Number(a.snow24) || 0) - (Number(b.snow24) || 0);
    }

    if (primary !== 0) {
      return state.sortDir === 'asc' ? primary : -primary;
    }

    const snowTie = (Number(b.snow24) || 0) - (Number(a.snow24) || 0);
    if (snowTie !== 0) return snowTie;
    const powDiff = (powRank[a.pow] ?? 2) - (powRank[b.pow] ?? 2);
    if (powDiff !== 0) return powDiff;
    return (Number(b.rating) || 0) - (Number(a.rating) || 0);
  });
  return list;
}

function updateSortHeaderUI() {
  document.querySelectorAll('.th-sortbtn[data-sort]').forEach((btn) => {
    const key = btn.dataset.sort;
    const active = key === state.sortKey;
    btn.classList.toggle('active', active);
    btn.classList.toggle('asc', active && state.sortDir === 'asc');
    btn.classList.toggle('desc', active && state.sortDir === 'desc');
  });
}

function getWindHoldStatus(resort) {
  const level = String(resort?.powWatch?.windHoldRisk?.level || '').toUpperCase();
  const gust = Number(resort?.powWatch?.windHoldRisk?.maxGustMph || 0);
  if (level === 'HIGH' || gust >= 40) {
    return {
      level: 'high',
      short: 'Upper hold risk',
      detail: `Upper mountain: likely hold · Mid-mountain: likely running${gust ? ` · Gusts ${Math.round(gust)} mph` : ''}`
    };
  }
  if (level === 'MEDIUM' || gust >= 28) {
    return {
      level: 'med',
      short: 'Lift watch',
      detail: `Upper mountain: possible hold · Mid-mountain: likely running${gust ? ` · Gusts ${Math.round(gust)} mph` : ''}`
    };
  }
  return {
    level: 'low',
    short: 'Lifts likely running',
    detail: `Upper mountain: likely running · Mid-mountain: running${gust ? ` · Gusts ${Math.round(gust)} mph` : ''}`
  };
}

function getDriveOrigin() {
  if (state.userLocation && Number.isFinite(state.userLocation.lat) && Number.isFinite(state.userLocation.lon)) {
    return { label: 'your location', lat: state.userLocation.lat, lon: state.userLocation.lon };
  }
  return { label: 'North Jersey', lat: 40.73, lon: -74.17 };
}

function getDriveHours(origin, resort) {
  if (!Number.isFinite(origin?.lat) || !Number.isFinite(origin?.lon) || !Number.isFinite(resort?.lat) || !Number.isFinite(resort?.lon)) {
    return null;
  }
  const miles = haversineMiles(origin.lat, origin.lon, resort.lat, resort.lon);
  return Math.max(0.5, (miles * DRIVE_MODEL.roadFactor) / DRIVE_MODEL.avgMph);
}

function getPeakSnowHourOffset(resort) {
  const arr = Array.isArray(resort?.powWatch?.hourly?.snowSeries24) ? resort.powWatch.hourly.snowSeries24 : [];
  if (!arr.length) return null;
  let bestIdx = 0;
  let bestVal = -1;
  arr.forEach((v, idx) => {
    const n = Number(v) || 0;
    if (n > bestVal) {
      bestVal = n;
      bestIdx = idx;
    }
  });
  return bestVal > 0 ? bestIdx : null;
}

function fmtClock(d) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getDriveWindow(resort) {
  const origin = getDriveOrigin();
  const hrs = getDriveHours(origin, resort);
  if (!hrs) return '';
  const now = new Date();
  const peakOffset = getPeakSnowHourOffset(resort);
  const target = new Date(now.getTime() + ((peakOffset ?? DRIVE_MODEL.fallbackPeakOffsetHr) * 60 * 60 * 1000));
  const leave = new Date(target.getTime() - (hrs * 60 * 60 * 1000));
  const arrive = new Date(leave.getTime() + (hrs * 60 * 60 * 1000));
  return `Drive Window (Beta): Leave by ${fmtClock(leave)} from ${origin.label} → arrive ${fmtClock(arrive)} for the reload window.`;
}

function getDriveWindowSummary(resort) {
  const origin = getDriveOrigin();
  const hrs = getDriveHours(origin, resort);
  if (!hrs) return '';
  const now = new Date();
  const peakOffset = getPeakSnowHourOffset(resort);
  const target = new Date(now.getTime() + ((peakOffset ?? DRIVE_MODEL.fallbackPeakOffsetHr) * 60 * 60 * 1000));
  const leave = new Date(target.getTime() - (hrs * 60 * 60 * 1000));
  return `Leave by ${fmtClock(leave)}`;
}

function buildInline72hChart(resort, totals) {
  const series = Array.isArray(resort?.powWatch?.hourly?.snowSeries72)
    ? resort.powWatch.hourly.snowSeries72.map((v) => Number(v) || 0).slice(0, 72)
    : [];
  const bins = [];
  if (series.length >= 24) {
    for (let i = 0; i < 72; i += 3) {
      const block = series.slice(i, i + 3);
      bins.push(block.reduce((sum, v) => sum + (Number(v) || 0), 0));
    }
  } else {
    const chunk = Math.max((Number(totals.snow72) || 0) / 8, 0);
    for (let i = 0; i < 24; i += 1) bins.push(i < 8 ? chunk : 0);
  }
  const maxBin = Math.max(...bins, 0.1);
  const bars = bins.map((v) => {
    const h = Math.max(2, Math.round((v / maxBin) * 16));
    return `<span class="rr72-bar${v <= 0.05 ? ' trace' : ''}" style="height:${h}px"></span>`;
  }).join('');
  return `<div class="rr-72h" aria-label="72 hour snowfall trend"><div class="rr72-bars">${bars}</div><div class="rr72-total">${totals.snow72.toFixed(1)}" / 72h</div></div>`;
}

function getComparablePair(list) {
  if (!Array.isArray(list) || list.length < 2) return null;
  return [list[0], list[1]];
}

function getWorthExtraHourLine(a, b) {
  if (!a || !b) return '';
  const origin = getDriveOrigin();
  const ah = getDriveHours(origin, a);
  const bh = getDriveHours(origin, b);
  if (!ah || !bh) return '';
  const deltaH = Math.abs(ah - bh);
  const snowDelta = getDisplayPowTotals(a).snow24 - getDisplayPowTotals(b).snow24;
  const aWind = getWindHoldStatus(a);
  const bWind = getWindHoldStatus(b);
  const windPenalty = (aWind.level === 'high' ? 1 : 0) - (bWind.level === 'high' ? 1 : 0);
  const worth = (snowDelta >= 3 && windPenalty <= 0) || (snowDelta >= 2 && deltaH <= 0.75 && windPenalty <= 0);
  const nameFarther = ah > bh ? a.name : b.name;
  const nameCloser = ah > bh ? b.name : a.name;
  const extra = Math.round(deltaH * 60);
  return worth
    ? `Compare (Beta): Worth the extra ${extra} min to ${nameFarther}: more snow without a wind penalty.`
    : `Compare (Beta): Not worth the extra ${extra} min to ${nameFarther}; ${nameCloser} is the smarter move this morning.`;
}

const LOC_LABELS = {
  VT: 'Vermont',
  ME: 'Maine',
  NH: 'New Hampshire',
  NY: 'New York',
  PA: 'Pennsylvania',
  MA: 'Massachusetts',
  CT: 'Connecticut',
  NJ: 'New Jersey',
  WV: 'West Virginia',
  QC: 'Québec'
};

function getStormModeSnapshot(resorts) {
  const withSnow = (resorts || []).map((r) => ({
    resort: r,
    snow24: getDisplayPowTotals(r).snow24
  }));
  const snow4 = withSnow.filter((x) => x.snow24 >= 4);
  const snow6 = withSnow.filter((x) => x.snow24 >= 6);
  const top10 = withSnow.slice().sort((a, b) => b.snow24 - a.snow24).slice(0, 10);
  const top10Sum = top10.reduce((sum, x) => sum + x.snow24, 0);

  const states4 = new Set(snow4.map((x) => String(x.resort.loc || '').toUpperCase()).filter(Boolean));
  const states6 = new Set(snow6.map((x) => String(x.resort.loc || '').toUpperCase()).filter(Boolean));

  const minSnow = snow4.length ? Math.floor(Math.min(...snow4.map((x) => x.snow24))) : 0;
  const maxSnow = snow4.length ? Math.ceil(Math.max(...snow4.map((x) => x.snow24))) : 0;
  const trigger =
    snow4.length >= STORM_MODE_CONFIG.minResortsAt4in
    || top10Sum >= STORM_MODE_CONFIG.minTop10SnowSum
    || states6.size >= STORM_MODE_CONFIG.minStatesAt6in;

  return {
    isStormMode: trigger,
    count4: snow4.length,
    count6: snow6.length,
    states4: Array.from(states4),
    states6: Array.from(states6),
    minSnow,
    maxSnow
  };
}

function applyStormModeUI(storm) {
  const body = document.body;
  const hero = document.getElementById('stormModeHero');
  const title = document.getElementById('stormHeroTitle');
  const deck = document.getElementById('stormHeroDeck');
  const meta = document.getElementById('stormHeroMeta');
  const leadRule = document.getElementById('leadRule');
  const tickerRule = document.getElementById('tickerRule');

  if (!body || !hero || !title || !deck || !meta || !leadRule || !tickerRule) return;

  body.classList.toggle('storm-mode', storm.isStormMode);
  hero.hidden = !storm.isStormMode;

  if (!storm.isStormMode) {
    leadRule.dataset.label = "Today's Lead";
    leadRule.dataset.count = 'Top stories';
    tickerRule.dataset.label = 'All Resorts';
    return;
  }

  const stateText = storm.states4.map((s) => LOC_LABELS[s] || s).join(', ');
  title.textContent = 'The East Coast is going off.';
  deck.textContent = `${storm.minSnow}–${storm.maxSnow}" fell overnight across ${stateText}. If you can drive today, this is the day.`;
  meta.textContent = `${storm.count4} resorts reporting 4"+ in 24h · ${storm.count6} resorts at 6"+`;
  leadRule.dataset.label = 'Top Hits';
  leadRule.dataset.count = 'Storm support';
  tickerRule.dataset.label = 'Storm Map';
}

function buildResortMarkup(r, rank) {
  const powCtx = getPowDisplayContext(r);
  const displayTotals = powCtx.totals;
  const wind = getWindHoldStatus(r);
  const bestBadge = getBestInDaysLabel(r);
  const driveWindow = getDriveWindow(r);
  const driveSummary = getDriveWindowSummary(r);
  const snowCls = displayTotals.snow24 >= 4 ? ' snow' : displayTotals.snow24 === 0 ? ' ice' : '';
  const passStr = (r.passes || []).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' · ') || '—';
  const terrainSnippet = r.terrainNote ? r.terrainNote : '';
  const insightParts = [wind.short];
  if (driveSummary) insightParts.push(driveSummary);
  if (terrainSnippet) insightParts.push(terrainSnippet);
  const rowInsight = insightParts.join(' · ');
  const inline72h = buildInline72hChart(r, displayTotals);
  const forecast = Array.isArray(r.forecast) && r.forecast.length
    ? r.forecast
    : [{ day: 'Sat', icon: 'cloud', hi: Number(r.temp) || 0 }, { day: 'Sun', icon: 'cloud', hi: Number(r.temp) || 0 }, { day: 'Mon', icon: 'cloud', hi: Number(r.temp) || 0 }];
  const warningHtml = powCtx.hasPowAlert ? `
    <div class="det-warning ${String(powCtx.powAlert.event).toLowerCase().includes('warning') ? 'storm' : 'watch'}">
      <span class="det-warn-icon">${String(powCtx.powAlert.event).toLowerCase().includes('warning') ? '⚠' : '👁'}</span>
      ${powCtx.powAlert.event} in effect through ${powCtx.alertExpiryLabel}
    </div>` : '';
  const conf = getConfidenceFromPatrol(r);
  const confCls = conf === 'High' ? 'conf-high' : conf === 'Low' ? 'conf-low' : 'conf-med';
  const verdict = r.verdict || (r.rating >= 4 ? 'Shredable!' : r.rating <= 2 ? 'Manage Expectations' : 'Solid Day');
  const verdictCls = ['Shredable!', 'Worth It'].includes(verdict)
    ? 'verdict-go'
    : (verdict === 'Go Tomorrow' ? 'verdict-wait' : 'verdict-meh');
  const powWatchHtml = `
    <div class="det-section">
      <div class="det-section-head">
        <span class="det-section-label">POW WATCH</span>
        <span class="det-storm-badge ${r.pow === 'on' ? 'badge-pow' : r.pow === 'building' ? 'badge-storm' : 'badge-quiet'}">${r.pow === 'on' ? 'POW' : r.pow === 'building' ? 'STORM' : 'QUIET'}</span>
      </div>
      <div class="det-pow-row">
        <div class="det-pow-stat"><span class="dpv">${displayTotals.snow24.toFixed(1)}"</span><span class="dpl">24h</span></div>
        <div class="det-pow-stat"><span class="dpv big">${displayTotals.snow48.toFixed(1)}"</span><span class="dpl">48h</span></div>
        <div class="det-pow-stat"><span class="dpv big">${displayTotals.snow72.toFixed(1)}"</span><span class="dpl">72h</span></div>
      </div>
      <div class="det-pow-meta">${powCtx.snowLevelLine || 'Snow Level: —'} &nbsp;·&nbsp; Storm Total: <strong>${powCtx.potentialLow.toFixed(1)}–${powCtx.potentialHigh.toFixed(1)}"</strong></div>
    </div>`;
  const forecastHtml = `
    <div class="det-section">
      <div class="det-section-label">3-Day Forecast</div>
      <div class="det-forecast">
        ${forecast.map((d) => `
          <div class="det-fc-day">
            <div class="det-fc-label">${d.day || '—'}</div>
            <div class="det-fc-icon"><img src="${getForecastIconSrc(d.icon)}" alt="${d.icon || 'cloud'}"></div>
            <div class="det-fc-hi">${(typeof d.hi === 'number' ? d.hi : Number(d.hi) || 0)}°</div>
          </div>`).join('')}
      </div>
    </div>`;
  const sparkHtml = `
    <div class="det-section">
      <div class="det-section-head">
        <span class="det-section-label">72h Snowfall Outlook</span>
        <span class="det-spark-range">3h blocks · next 72h</span>
      </div>
      <div class="det-sparkline">${powCtx.chartBars}</div>
      <div class="det-spark-footer">
        <span>72h total: <strong>${displayTotals.snow72.toFixed(1)}"</strong></span>
        ${powCtx.maxSeriesVal > 0.1 ? `<span>Peak: <strong>${powCtx.maxSeriesVal.toFixed(1)}"</strong></span>` : ''}
      </div>
    </div>`;
  const passPriceHtml = `
    <div class="detail-pass-price">
      <span class="detail-pass">${passStr !== '—' ? `${passStr} Pass` : 'No Pass Required'}</span>
      <span class="detail-price">${r.price}</span>
    </div>`;
  return `
    <div class="resort-row" data-resort="${r.id}" tabindex="0">
      <div class="rr-rank">${rank}</div>
      <div class="rr-name-col">
        <div class="rr-name">${r.name}</div>
        <div class="rr-meta">${r.loc} · ${passStr}${bestBadge ? ` · ${bestBadge}` : ''}</div>
        <div class="rr-insight">${rowInsight}</div>
        ${inline72h}
      </div>
      <div class="rr-cond"><span>${r.conditions}</span><span class="wind-badge ${wind.level}" title="${wind.short}">W</span></div>
      <div class="rr-stat${snowCls}">${displayTotals.snow24 > 0 ? `${displayTotals.snow24}"` : '—'}</div>
      <div class="rr-stat">${r.temp}°</div>
      ${getRatingBlocks(r.rating, r.pow)}
      <div class="rr-pow">${getPowPip(r.pow)}</div>
    </div>
    <div class="resort-detail" id="detail-${r.id}">
      <div class="det-header">
        <div class="det-header-left">
          <div class="det-conditions-label">Current Conditions</div>
          <div class="det-conditions-main">${r.conditions}</div>
          <div class="det-quick-stats">
            <span>24h Snow <strong>${displayTotals.snow24 > 0 ? `${displayTotals.snow24}"` : '0"'}</strong></span>
            <span>48h Snow <strong>${displayTotals.snow48 > 0 ? `${displayTotals.snow48}"` : '0"'}</strong></span>
            <span>Temp <strong>${r.temp}°</strong></span>
            <span>Feels Like <strong>${Number(r.feelsLike ?? r.temp)}°</strong></span>
            <span>Wind <strong>${r.wind} mph</strong></span>
          </div>
          ${powCtx.displayPowBrief ? `<div class="det-nws-brief"><strong>NWS Brief:</strong> ${powCtx.displayPowBrief}</div>` : ''}
          <div class="det-nws-brief"><strong>Lift Ops:</strong> ${wind.detail}</div>
          ${driveWindow ? `<div class="det-nws-brief"><strong>Drive Window:</strong> ${driveWindow}</div>` : ''}
          ${r.terrainNote ? `<div class="det-terrain-note"><strong>Terrain note:</strong> ${r.terrainNote}</div>` : ''}
        </div>
        <div class="det-header-right">
          <span class="det-confidence ${confCls}">Confidence: ${conf}</span>
        </div>
      </div>
      ${warningHtml}
      <div class="det-body">
        <div class="det-col">${forecastHtml}</div>
        <div class="det-col">${powWatchHtml}</div>
        <div class="det-col">${sparkHtml}</div>
      </div>
      <div class="det-footer">
        <div class="det-rating-zone">
          <div class="det-rating-label">ICECOAST RATING</div>
          <div class="det-stars">${[1, 2, 3, 4, 5].map((n) => `<div class="det-star${n <= r.rating ? (r.pow === 'on' ? ' on pow-on' : ' on') : ''}"></div>`).join('')}</div>
        </div>
        <div class="det-verdict ${verdictCls}">${verdict}</div>
      </div>
      <div class="detail-actions">
        <button class="d-btn primary" data-drive="${r.id}">Drive there →</button>
        <button class="d-btn" data-share="${r.id}">Share conditions</button>
        <button class="d-btn save-btn" data-resort-id="${r.id}" data-resort-name="${r.name}">Save resort</button>
        ${passPriceHtml}
      </div>
    </div>`;
}

function renderTicker() {
  const list = applyFilters();
  const ticker = document.getElementById('resortTicker');
  const sectionRule = document.getElementById('tickerRule');
  if (sectionRule) sectionRule.dataset.count = `${list.length} reporting`;

  const storm = getStormModeSnapshot(state.resorts);
  applyStormModeUI(storm);

  const localLeadList = getLocalLeadList();
  const leadSource = (localLeadList && localLeadList.length >= 2)
    ? localLeadList
    : state.resorts.slice().sort((a, b) => getDisplayPowTotals(b).snow24 - getDisplayPowTotals(a).snow24);
  updateLeadStories(leadSource);
  updateLocalStatus();
  renderSavedMorningBrief();
  updateSortHeaderUI();

  if (!list.length) {
    ticker.innerHTML = '<div style="padding:1.5rem 0;font-family:var(--mono);font-size:0.72rem;color:var(--ink-faint);font-style:italic">No resorts match. East Coast grit says lower your standards and try again.</div>';
    return;
  }

  const stormMapMode = storm.isStormMode
    && state.currentTab === 'all'
    && !state.search.trim()
    && getAllActive().size === 0;

  if (!stormMapMode) {
    if (sectionRule) sectionRule.dataset.count = `${list.length} reporting`;
    ticker.innerHTML = list.map((r, i) => buildResortMarkup(r, i + 1)).join('');
  } else {
    const ranked = state.resorts
      .slice()
      .sort((a, b) => getDisplayPowTotals(b).snow24 - getDisplayPowTotals(a).snow24);
    const groupsByLoc = new Map();
    ranked.forEach((r) => {
      const loc = String(r.loc || 'EC').toUpperCase();
      if (!groupsByLoc.has(loc)) groupsByLoc.set(loc, []);
      groupsByLoc.get(loc).push(r);
    });
    const orderedGroups = Array.from(groupsByLoc.entries()).sort((a, b) => {
      const maxA = Math.max(...a[1].map((r) => getDisplayPowTotals(r).snow24));
      const maxB = Math.max(...b[1].map((r) => getDisplayPowTotals(r).snow24));
      return maxB - maxA;
    });

    let rank = 1;
    const rows = [];
    orderedGroups.forEach(([loc, resorts]) => {
      const maxSnow = Math.max(...resorts.map((r) => getDisplayPowTotals(r).snow24));
      rows.push(`<div class="storm-group-head"><span class="storm-group-state">${loc}</span><span class="storm-group-meta">${resorts.length} resorts · up to ${maxSnow.toFixed(1)}"</span></div>`);
      resorts.forEach((r) => {
        rows.push(buildResortMarkup(r, rank));
        rank += 1;
      });
    });
    if (sectionRule) sectionRule.dataset.count = `${storm.count4} resorts at 4"+`;
    ticker.innerHTML = rows.join('');
  }

  ticker.querySelectorAll('.resort-row').forEach((row) => {
    row.addEventListener('click', () => {
      const wasExpanded = row.classList.contains('expanded');
      ticker.querySelectorAll('.resort-row').forEach((r) => r.classList.remove('expanded'));
      if (!wasExpanded) row.classList.add('expanded');
    });
  });

  const rows = ticker.querySelectorAll('.resort-row');
  if (rows.length) {
    const defaultExpandCount = window.matchMedia('(max-width: 720px)').matches ? 1 : 3;
    rows.forEach((row, idx) => {
      row.classList.toggle('expanded', idx < defaultExpandCount);
    });
  }

  ticker.querySelectorAll('.save-btn').forEach((btn) => {
    const id = btn.dataset.resortId;
    if (savedResorts.has(id)) setSavedState(btn, true);
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      triggerSave(btn);
    });
  });

  ticker.querySelectorAll('[data-drive]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = btn.getAttribute('data-drive');
      const resort = state.resorts.find((r) => r.id === id);
      if (!resort) return;
      const q = encodeURIComponent(`${resort.name} ski resort`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank', 'noopener,noreferrer');
    });
  });

  ticker.querySelectorAll('[data-share]').forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      event.stopPropagation();
      const id = btn.getAttribute('data-share');
      const resort = state.resorts.find((r) => r.id === id);
      if (!resort) return;
      const totals = getDisplayPowTotals(resort);
      const text = `${resort.name}: ${totals.snow24}" in 24h, ${resort.conditions}, ${resort.temp}°F.`;
      try {
        if (navigator.share) await navigator.share({ title: `icecoast brief — ${resort.name}`, text });
        else await navigator.clipboard.writeText(text);
      } catch (_) {}
    });
  });
}

function syncDispatchTags() {
  const zone = document.getElementById('activeDispatch');
  const tags = [];
  const all = getAllActive();
  all.forEach((cmd) => {
    const meta = CHIP_MAP[cmd];
    if (meta) tags.push({ label: meta.label, cmd });
  });
  const hasText = state.search.trim().length > 0;
  zone.classList.toggle('on', tags.length > 0 || hasText);
  if (!tags.length && !hasText) {
    zone.innerHTML = '';
    return;
  }

  const tagCls = (cmd) => {
    const m = CHIP_MAP[cmd];
    if (!m) return '';
    if (m.type === 'vibe' && (cmd === 'pow' || cmd === 'storm')) return 'pow-tag';
    if (m.type === 'pass') return 'pass-tag';
    return 'region-tag';
  };

  zone.innerHTML =
    (hasText ? `<span style="color:var(--ink-faint);font-family:var(--mono);font-size:0.52rem">"${state.search}"</span>` : '')
    + tags.map((t) => `<span class="d-tag ${tagCls(t.cmd)}" data-cmd="${t.cmd}">${t.label} <span class="d-tag-x">✕</span></span>`).join('')
    + '<button onclick="clearAllDispatch()" style="font-family:var(--mono);font-size:0.52rem;letter-spacing:0.06em;text-transform:uppercase;background:none;border:none;color:var(--ink-faint);cursor:pointer;margin-left:auto;">clear all</button>';

  zone.querySelectorAll('.d-tag').forEach((tag) => {
    tag.addEventListener('click', () => {
      const cmd = tag.dataset.cmd;
      state.activeHints.delete(cmd);
      document.querySelectorAll(`.d-hint[data-cmd="${cmd}"], .d-chip[data-cmd="${cmd}"]`).forEach((b) => b.classList.remove('fired'));
      updateExpandBtnBadge();
      document.getElementById('clearSearch').classList.toggle('on', state.activeHints.size > 0 || state.search.trim().length > 0);
      renderTicker();
      syncDispatchTags();
    });
  });
}

function clearAllDispatch() {
  state.search = '';
  state.activeHints.clear();
  state.nlHints = new Set();
  const input = document.getElementById('resortSearch');
  const clearBtn = document.getElementById('clearSearch');
  if (input) input.value = '';
  if (clearBtn) clearBtn.classList.remove('on');
  document.querySelectorAll('.d-hint.fired, .d-chip.fired').forEach((b) => b.classList.remove('fired'));
  updateExpandBtnBadge();
  renderTicker();
  syncDispatchTags();
}

function getResortVerdictLine(r) {
  const snow24 = getDisplayPowTotals(r).snow24;
  const wind = getWindHoldStatus(r);
  if (snow24 >= 6 && wind.level !== 'high') return 'Go now';
  if (snow24 >= 3 && wind.level !== 'high') return 'Go early';
  if (wind.level === 'high') return 'Go lower mountain';
  return 'Fine if local';
}

function renderSavedMorningBrief() {
  const wrap = document.getElementById('savedMorningBrief');
  const listEl = document.getElementById('savedBriefList');
  const compareEl = document.getElementById('savedCompare');
  const alertBtn = document.getElementById('savedAlertBtn');
  const alertLink = document.getElementById('savedAlertLink');
  if (!wrap || !listEl || !compareEl || !alertBtn || !alertLink) return;

  const saved = state.resorts
    .filter((r) => savedResorts.has(r.id))
    .sort((a, b) => getDisplayPowTotals(b).snow24 - getDisplayPowTotals(a).snow24);

  if (!saved.length) {
    wrap.hidden = true;
    return;
  }

  wrap.hidden = false;
  alertBtn.classList.toggle('on', state.alertIntent4in);
  alertBtn.textContent = state.alertIntent4in ? '4"+ alert: on' : 'Alert me at 4"+';
  const top = saved.slice(0, 5);
  const savedIds = top.map((r) => r.id).join(',');
  alertLink.href = `https://icecoast.beehiiv.com/?utm_source=app&utm_medium=saved-brief&utm_campaign=pow-alerts&saved=${encodeURIComponent(savedIds)}&rule=${state.alertIntent4in ? '4in-on' : '4in-off'}`;
  listEl.innerHTML = top.map((r) => {
    const verdict = getResortVerdictLine(r);
    const wind = getWindHoldStatus(r);
    const best = getBestInDaysLabel(r);
    const note = r.terrainNote || wind.short;
    return `<article class="saved-item">
      <div class="saved-item-name">${r.name}</div>
      <div class="saved-item-verdict">${verdict}${best ? ` · ${best}` : ''}</div>
      <div class="saved-item-note">${note}</div>
    </article>`;
  }).join('');

  const pair = getComparablePair(top);
  const compare = pair ? getWorthExtraHourLine(pair[0], pair[1]) : '';
  const hit4 = top.filter((r) => getDisplayPowTotals(r).snow24 >= 4).length;
  const alertNote = state.alertIntent4in
    ? (hit4 > 0
      ? `Alert check: ${hit4} saved mountain${hit4 > 1 ? 's' : ''} hit 4"+.`
      : 'Alert check: no saved mountains at 4"+ yet.')
    : '';
  compareEl.textContent = [compare, alertNote].filter(Boolean).join(' · ');
}

function attachUi() {
  const input = document.getElementById('resortSearch');
  const clearBtn = document.getElementById('clearSearch');
  const expandBtn = document.getElementById('dispatchExpandBtn');
  const drawer = document.getElementById('dispatchDrawer');
  const useLocationBtn = document.getElementById('useLocationBtn');
  const localStatus = document.getElementById('localStatus');
  const alertBtn = document.getElementById('savedAlertBtn');
  const alertLink = document.getElementById('savedAlertLink');

  const NL_COMMANDS = [
    { match: /\b(pow|powder|fresh|nuking)\b/i, cmd: 'pow' },
    { match: /\bstorm\b/i, cmd: 'storm' },
    { match: /\bice\b/i, cmd: 'ice' },
    { match: /\b(vt|vermont)\b/i, cmd: 'vt' },
    { match: /\b(me|maine)\b/i, cmd: 'me' },
    { match: /\b(nh|new hampshire)\b/i, cmd: 'nh' },
    { match: /\b(ny|new york|catskills|adk)\b/i, cmd: 'ny' },
    { match: /\b(pa|poconos|pennsylvania)\b/i, cmd: 'pa' },
    { match: /\bikon\b/i, cmd: 'ikon' },
    { match: /\bepic\b/i, cmd: 'epic' },
    { match: /\bindy\b/i, cmd: 'indy' },
    { match: /\bcold\b/i, cmd: 'cold' }
  ];

  input.addEventListener('input', (e) => {
    const val = e.target.value || '';
    state.search = val;
    state.nlHints = new Set();
    NL_COMMANDS.forEach((cmd) => { if (cmd.match.test(val)) state.nlHints.add(cmd.cmd); });
    clearBtn.classList.toggle('on', val.trim().length > 0 || state.activeHints.size > 0);
    renderTicker();
    syncDispatchTags();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    state.search = '';
    state.nlHints = new Set();
    clearBtn.classList.toggle('on', state.activeHints.size > 0);
    renderTicker();
    syncDispatchTags();
    input.focus();
  });

  if (expandBtn && drawer) {
    expandBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      expandBtn.classList.toggle('open', isOpen);
      expandBtn.setAttribute('aria-expanded', String(isOpen));
      drawer.setAttribute('aria-hidden', String(!isOpen));
    });
  }

  function bindChip(btn) {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      if (btn.classList.contains('fired')) {
        btn.classList.remove('fired');
        state.activeHints.delete(cmd);
      } else {
        btn.classList.add('fired');
        state.activeHints.add(cmd);
      }
      updateExpandBtnBadge();
      clearBtn.classList.toggle('on', state.activeHints.size > 0 || state.search.trim().length > 0);
      renderTicker();
      syncDispatchTags();
    });
  }
  document.querySelectorAll('.d-hint, .d-chip').forEach(bindChip);

  document.querySelectorAll('.m-tab[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab === 'newsletter') {
        window.open('https://icecoast.beehiiv.com/', '_blank');
        return;
      }
      state.currentTab = btn.dataset.tab === 'favorites' ? 'favorites' : 'all';
      document.querySelectorAll('.m-tab').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderTicker();
    });
  });

  if (alertBtn) {
    alertBtn.addEventListener('click', () => {
      saveAlertIntent(!state.alertIntent4in);
      renderSavedMorningBrief();
      if (state.alertIntent4in && alertLink) {
        window.open(alertLink.href, '_blank', 'noopener,noreferrer');
      }
    });
  }

  document.querySelectorAll('.th-sortbtn[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      if (!key) return;
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        state.sortKey = key;
        state.sortDir = (key === 'name' || key === 'conditions') ? 'asc' : 'desc';
      }
      renderTicker();
    });
  });

  if (useLocationBtn) {
    useLocationBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        if (localStatus) localStatus.textContent = 'Geolocation unavailable on this browser.';
        return;
      }
      if (localStatus) localStatus.textContent = 'Finding your location...';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude);
          const lon = Number(pos.coords.longitude);
          setLocalLocation(lat, lon, 'you');
        },
        () => {
          if (localStatus) localStatus.textContent = 'Could not access location.';
        },
        { enableHighAccuracy: false, maximumAge: 300000, timeout: 8000 }
      );
    });
  }

  updateExpandBtnBadge();
  updateLocalStatus();
}

const savedResorts = new Set(JSON.parse(localStorage.getItem('brief_saved_resorts') || '[]'));

function persistSavedResorts() {
  localStorage.setItem('brief_saved_resorts', JSON.stringify(Array.from(savedResorts)));
}

function setSavedState(btn, saved) {
  if (saved) {
    btn.classList.add('saved');
    btn.textContent = '✓ Saved';
  } else {
    btn.classList.remove('saved');
    btn.textContent = 'Save resort';
  }
}

function triggerSave(btn) {
  const id = btn.dataset.resortId;
  const name = btn.dataset.resortName;
  const alreadySaved = savedResorts.has(id);

  if (alreadySaved) {
    savedResorts.delete(id);
    persistSavedResorts();
    setSavedState(btn, false);
    updateSavedTab();
    if (state.currentTab === 'favorites') renderTicker();
    return;
  }

  savedResorts.add(id);
  persistSavedResorts();
  btn.classList.add('flooding');
  setTimeout(() => {
    btn.classList.remove('flooding');
    setSavedState(btn, true);
  }, 240);

  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  angles.forEach((angle) => {
    const rad = (angle * Math.PI) / 180;
    const dist = 28 + Math.random() * 20;
    const p = document.createElement('div');
    p.className = 'save-particle';
    p.style.cssText = `
      left: ${cx - 2.5}px;
      top: ${cy - 2.5}px;
      --tx: ${Math.cos(rad) * dist}px;
      --ty: ${Math.sin(rad) * dist}px;
      animation-delay: ${Math.random() * 0.06}s;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  });

  const toast = document.createElement('div');
  toast.className = 'save-toast';
  toast.textContent = `+ ${name}`;
  toast.style.cssText = `left: ${cx - 40}px; top: ${cy - 10}px;`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 700);

  const row = document.querySelector(`.resort-row[data-resort="${id}"]`);
  if (row) {
    row.classList.add('just-saved');
    setTimeout(() => row.classList.remove('just-saved'), 800);
  }

  updateSavedTab();
}

function updateSavedTab() {
  const tab = document.querySelector('.m-tab[data-tab="favorites"]');
  if (!tab) return;
  const existing = tab.querySelector('.saved-badge');
  if (existing) existing.remove();
  if (savedResorts.size > 0) {
    const badge = document.createElement('span');
    badge.className = 'saved-badge';
    badge.textContent = savedResorts.size;
    tab.appendChild(badge);
  }
  tab.textContent = savedResorts.size > 0 ? 'Saved ' : 'Saved';
  if (savedResorts.size > 0) {
    const badge = document.createElement('span');
    badge.className = 'saved-badge';
    badge.textContent = savedResorts.size;
    tab.appendChild(badge);
  }
}

(async function boot() {
  loadLocalProfile();
  await loadResorts();
  applyManualOverridesToResorts();
  updateDailyHistorySnapshots();
  updateNameplateRule();
  tickClock();
  setInterval(tickClock, 30000);
  attachUi();
  if (savedResorts.size >= 3) {
    state.currentTab = 'favorites';
    const favTab = document.querySelector('.m-tab[data-tab="favorites"]');
    document.querySelectorAll('.m-tab[data-tab]').forEach((b) => b.classList.remove('active'));
    if (favTab) favTab.classList.add('active');
  }
  updateSavedTab();
  renderTicker();
  syncDispatchTags();
})();
