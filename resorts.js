/**
 * 🎿 ICECOAST Resort Data - Single Source of Truth
 * This file contains all 39 resort definitions used across:
 * - Frontend (index.html)
 * - Cloudflare Worker (cloudflare-worker.js)
 * - Scheduled Worker (icecoast-scheduler.js)
 */

const RESORTS = [
    // ========== PENNSYLVANIA (POCONOS) - 8 resorts ==========
    {
        id: 'camelback',
        name: 'Camelback',
        icon: '🚁',
        location: 'Tannersville, PA',
        region: 'poconos',
        familyOwned: false,
        lat: 41.0525,
        lon: -75.3560,
        liftie: 'camelback'
    },
    {
        id: 'blue-mountain',
        name: 'Blue Mountain',
        icon: '🦅',
        location: 'Palmerton, PA',
        region: 'poconos',
        familyOwned: true,
        lat: 40.8101,
        lon: -75.5209,
        liftie: 'bluemountain'
    },
    {
        id: 'jack-frost',
        name: 'Jack Frost',
        icon: '❄️',
        location: 'Blakeslee, PA',
        region: 'poconos',
        familyOwned: true,
        lat: 41.0910,
        lon: -75.4690,
        liftie: 'null'
    },
    {
        id: 'shawnee',
        name: 'Shawnee',
        icon: '🏔️',
        location: 'East Stroudsburg, PA',
        region: 'poconos',
        familyOwned: true,
        lat: 41.0380,
        lon: -75.0770,
        liftie: 'shawnee'
    },
    {
        id: 'bear-creek',
        name: 'Bear Creek',
        icon: '🐻',
        location: 'Macungie, PA',
        region: 'poconos',
        familyOwned: true,
        lat: 40.7434,
        lon: -76.0493,
        liftie: 'null'
    },
    {
        id: 'elk',
        name: 'Elk Mountain',
        icon: '🦌',
        location: 'Union Dale, PA',
        region: 'poconos',
        familyOwned: true,
        lat: 41.6523,
        lon: -75.5643,
        liftie: 'null'
    },
    {
        id: 'big-boulder',
        name: 'Big Boulder',
        icon: '🪨',
        location: 'Lake Harmony, PA',
        region: 'poconos',
        familyOwned: false,
        lat: 41.1046,
        lon: -75.5554,
        liftie: 'null'
    },
    {
        id: 'montage',
        name: 'Montage Mountain',
        icon: '⛰️',
        location: 'Scranton, PA',
        region: 'poconos',
        familyOwned: true,
        lat: 41.1812,
        lon: -75.5590,
        liftie: 'null'
    },

    // ========== NEW YORK - 5 resorts ==========
    {
        id: 'hunter',
        name: 'Hunter Mountain',
        icon: '🏔️',
        location: 'Hunter, NY',
        region: 'catskills',
        familyOwned: false,
        lat: 42.2080,
        lon: -74.2116,
        liftie: 'hunter'
    },
    {
        id: 'windham',
        name: 'Windham Mountain',
        icon: '🌬️',
        location: 'Windham, NY',
        region: 'catskills',
        familyOwned: true,
        lat: 42.2985,
        lon: -74.2627,
        liftie: 'windham'
    },
    {
        id: 'belleayre',
        name: 'Belleayre Mountain',
        icon: '🏔️',
        location: 'Highmount, NY',
        region: 'catskills',
        familyOwned: false,
        lat: 42.1344,
        lon: -74.5121,
        liftie: 'belleayre'
    },
    {
        id: 'whiteface',
        name: 'Whiteface Mountain',
        icon: '🏔️',
        location: 'Wilmington, NY',
        region: 'adirondacks',
        familyOwned: false,
        lat: 44.3611,
        lon: -73.8865,
        liftie: 'whiteface'
    },
    {
        id: 'gore-mountain',
        name: 'Gore Mountain',
        icon: '⛰️',
        location: 'North Creek, NY',
        region: 'adirondacks',
        familyOwned: false,
        lat: 43.6774,
        lon: -74.0116,
        liftie: 'gore-mountain'
    },

    // ========== MASSACHUSETTS & CONNECTICUT - 3 resorts ==========
    {
        id: 'jiminy-peak',
        name: 'Jiminy Peak',
        icon: '🎿',
        location: 'Hancock, MA',
        region: 'massachusetts',
        familyOwned: true,
        lat: 42.5386,
        lon: -73.2928,
        liftie: 'jiminy-peak'
    },
    {
        id: 'wachusett',
        name: 'Wachusett Mountain',
        icon: '⛷️',
        location: 'Princeton, MA',
        region: 'massachusetts',
        familyOwned: true,
        lat: 42.5153,
        lon: -71.8900,
        liftie: 'wachusett'
    },
    {
        id: 'mohawk',
        name: 'Mohawk Mountain',
        icon: '🏔️',
        location: 'Cornwall, CT',
        region: 'connecticut',
        familyOwned: true,
        lat: 41.6892,
        lon: -73.3148,
        liftie: 'mohawk-mountain'
    },

    // ========== VERMONT - 11 resorts ==========
    {
        id: 'stratton',
        name: 'Stratton Mountain',
        icon: '🏔️',
        location: 'Stratton, VT',
        region: 'vermont-south',
        familyOwned: false,
        lat: 43.1172,
        lon: -72.9094,
        liftie: 'stratton'
    },
    {
        id: 'mount-snow',
        name: 'Mount Snow',
        icon: '⛷️',
        location: 'West Dover, VT',
        region: 'vermont-south',
        familyOwned: false,
        lat: 42.9714,
        lon: -72.8963,
        liftie: 'mount-snow'
    },
    {
        id: 'killington',
        name: 'Killington',
        icon: '👑',
        location: 'Killington, VT',
        region: 'vermont-central',
        familyOwned: false,
        lat: 43.6317,
        lon: -72.8057,
        liftie: 'killington'
    },
    {
        id: 'okemo',
        name: 'Okemo Mountain',
        icon: '🏔️',
        location: 'Ludlow, VT',
        region: 'vermont-central',
        familyOwned: false,
        lat: 43.4057,
        lon: -72.7196,
        liftie: 'okemo'
    },
    {
        id: 'pico',
        name: 'Pico Mountain',
        icon: '🎿',
        location: 'Mendon, VT',
        region: 'vermont-central',
        familyOwned: false,
        lat: 43.6597,
        lon: -72.8521,
        liftie: 'pico'
    },
    {
        id: 'sugarbush',
        name: 'Sugarbush',
        icon: '🌿',
        location: 'Warren, VT',
        region: 'vermont-central',
        familyOwned: true,
        lat: 44.1513,
        lon: -72.8821,
        liftie: 'sugarbush'
    },
    {
        id: 'mad-river-glen',
        name: 'Mad River Glen',
        icon: '⛷️',
        location: 'Waitsfield, VT',
        region: 'vermont-central',
        familyOwned: true,
        lat: 44.2056,
        lon: -72.9215,
        liftie: 'mad-river-glen'
    },
    {
        id: 'stowe',
        name: 'Stowe Mountain',
        icon: '⛰️',
        location: 'Stowe, VT',
        region: 'vermont-north',
        familyOwned: false,
        lat: 44.5385,
        lon: -72.7844,
        liftie: 'stowe'
    },
    {
        id: 'smugglers-notch',
        name: "Smugglers' Notch",
        icon: '🎿',
        location: 'Jeffersonville, VT',
        region: 'vermont-north',
        familyOwned: true,
        lat: 44.5414,
        lon: -72.7847,
        liftie: 'smugglers-notch'
    },
    {
        id: 'jay-peak',
        name: 'Jay Peak',
        icon: '🏔️',
        location: 'Jay, VT',
        region: 'vermont-north',
        familyOwned: false,
        lat: 44.9338,
        lon: -72.5049,
        liftie: 'jay-peak'
    },
    {
        id: 'burke',
        name: 'Burke Mountain',
        icon: '⛰️',
        location: 'East Burke, VT',
        region: 'vermont-north',
        familyOwned: true,
        lat: 44.5770,
        lon: -71.9212,
        liftie: 'burke'
    },

    // ========== NEW HAMPSHIRE & MAINE - 8 resorts ==========
    {
        id: 'loon',
        name: 'Loon Mountain',
        icon: '🌙',
        location: 'Lincoln, NH',
        region: 'white-mountains',
        familyOwned: false,
        lat: 44.0400,
        lon: -71.6239,
        liftie: 'loon'
    },
    {
        id: 'brettonwoods',
        name: 'Bretton Woods',
        icon: '🏔️',
        location: 'Bretton Woods, NH',
        region: 'white-mountains',
        familyOwned: true,
        lat: 44.0798,
        lon: -71.3435,
        liftie: 'brettonwoods'
    },
    {
        id: 'waterville',
        name: 'Waterville Valley',
        icon: '💧',
        location: 'Waterville Valley, NH',
        region: 'white-mountains',
        familyOwned: true,
        lat: 43.9686,
        lon: -71.5292,
        liftie: 'waterville'
    },
    {
        id: 'cannon',
        name: 'Cannon Mountain',
        icon: '🏔️',
        location: 'Franconia, NH',
        region: 'white-mountains',
        familyOwned: false,
        lat: 44.1593,
        lon: -71.7012,
        liftie: 'cannon'
    },
    {
        id: 'wildcat',
        name: 'Wildcat Mountain',
        icon: '🐱',
        location: 'Pinkham Notch, NH',
        region: 'white-mountains',
        familyOwned: true,
        lat: 44.2665,
        lon: -71.2420,
        liftie: 'wildcat'
    },
    {
        id: 'sunday-river',
        name: 'Sunday River',
        icon: '🌊',
        location: 'Newry, ME',
        region: 'maine',
        familyOwned: false,
        lat: 44.4768,
        lon: -70.8601,
        liftie: 'sunday-river'
    },
    {
        id: 'sugarloaf',
        name: 'Sugarloaf',
        icon: '🍞',
        location: 'Carrabassett Valley, ME',
        region: 'maine',
        familyOwned: true,
        lat: 45.0359,
        lon: -70.3166,
        liftie: 'sugarloaf'
    },
    {
        id: 'saddleback',
        name: 'Saddleback',
        icon: '🏔️',
        location: 'Rangeley, ME',
        region: 'maine',
        familyOwned: true,
        lat: 44.9345,
        lon: -70.5130,
        liftie: 'saddleback'
    },

    // ========== CANADA (QUEBEC) - 4 resorts ==========
    {
        id: 'tremblant',
        name: 'Mont Tremblant',
        icon: '🇨🇦',
        location: 'Mont-Tremblant, QC',
        region: 'canada',
        familyOwned: false,
        lat: 46.2094,
        lon: -74.5903,
        liftie: 'mont-tremblant'
    },
    {
        id: 'mont-sainte-anne',
        name: 'Mont-Sainte-Anne',
        icon: '⛷️',
        location: 'Beaupré, QC',
        region: 'canada',
        familyOwned: false,
        lat: 47.0711,
        lon: -70.9061,
        liftie: 'mont-sainte-anne'
    },
    {
        id: 'le-massif',
        name: 'Le Massif',
        icon: '🏔️',
        location: 'Petite-Rivière-Saint-François, QC',
        region: 'canada',
        familyOwned: true,
        lat: 47.3292,
        lon: -70.6489,
        liftie: 'le-massif'
    },
    {
        id: 'mont-sutton',
        name: 'Mont Sutton',
        icon: '⛰️',
        location: 'Sutton, QC',
        region: 'canada',
        familyOwned: true,
        lat: 45.0769,
        lon: -72.4561,
        liftie: 'mont-sutton'
    }
];

// ========== UTILITY FUNCTIONS ==========

/**
 * Get resort data by ID
 * @param {string} resortId - The resort's unique ID
 * @returns {object|null} Resort object or null if not found
 */
function getResortById(resortId) {
    return RESORTS.find(r => r.id === resortId) || null;
}

/**
 * Get all resorts in a specific region
 * @param {string} region - Region identifier
 * @returns {array} Array of resort objects
 */
function getResortsByRegion(region) {
    return RESORTS.filter(r => r.region === region);
}

/**
 * Get all family-owned resorts
 * @returns {array} Array of family-owned resort objects
 */
function getFamilyOwnedResorts() {
    return RESORTS.filter(r => r.familyOwned === true);
}

/**
 * Get all resorts with Liftie API coverage
 * @returns {array} Array of resorts with liftie data
 */
function getResortsWithLiftie() {
    return RESORTS.filter(r => r.liftie && r.liftie !== 'null');
}

/**
 * Convert RESORTS array to object format for scheduler
 * @returns {object} Object with resort IDs as keys
 */
function getResortsAsObject() {
    const obj = {};
    RESORTS.forEach(resort => {
        obj[resort.id] = {
            lat: resort.lat,
            lon: resort.lon,
            liftie: resort.liftie
        };
    });
    return obj;
}

/**
 * Get array of all resort IDs in order
 * @returns {array} Array of resort ID strings
 */
function getResortIds() {
    return RESORTS.map(r => r.id);
}

/**
 * Get count of total resorts
 * @returns {number} Total number of resorts
 */
function getResortCount() {
    return RESORTS.length;
}

// ========== EXPORTS ==========

// For Node.js / CommonJS (Cloudflare Workers)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RESORTS,
        getResortById,
        getResortsByRegion,
        getFamilyOwnedResorts,
        getResortsWithLiftie,
        getResortsAsObject,
        getResortIds,
        getResortCount
    };
}

// For ES6 modules
if (typeof exports !== 'undefined') {
    exports.RESORTS = RESORTS;
    exports.getResortById = getResortById;
    exports.getResortsByRegion = getResortsByRegion;
    exports.getFamilyOwnedResorts = getFamilyOwnedResorts;
    exports.getResortsWithLiftie = getResortsWithLiftie;
    exports.getResortsAsObject = getResortsAsObject;
    exports.getResortIds = getResortIds;
    exports.getResortCount = getResortCount;
}
