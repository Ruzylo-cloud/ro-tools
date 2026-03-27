/**
 * JMVG Store Directory — maps store IDs to names and locations.
 * Source: JMVG Scoreboard data + meeting notes.
 */

const STORE_DIRECTORY = [
  { id: '20013', name: 'Buellton' },
  { id: '20218', name: 'Riverside' },
  { id: '20381', name: 'San Diego' },
  { id: '20091', name: 'Camarillo' },
  { id: '20366', name: 'Ventura' },
  { id: '20363', name: 'San Marcos' },
  { id: '20267', name: 'Oxnard' },
  { id: '20294', name: 'Escondido' },
  { id: '20026', name: 'Simi Valley' },
  { id: '20245', name: 'Vista' },
  { id: '20156', name: 'Thousand Oaks' },
  { id: '20292', name: 'Carlsbad' },
  { id: '20048', name: 'Moorpark' },
  { id: '20300', name: 'Encinitas' },
  { id: '20255', name: 'Oceanside' },
  { id: '20311', name: 'Westlake Village' },
  { id: '20116', name: 'San Marcos South' },
  { id: '20291', name: 'Fallbrook' },
  { id: '20171', name: 'North Hollywood' },
  { id: '20352', name: 'Temecula' },
  { id: '20075', name: 'Newbury Park' },
  { id: '20071', name: 'Agoura Hills' },
  { id: '20177', name: 'Chatsworth' },
  { id: '20011', name: 'Lompoc' },
  { id: '20273', name: 'Poway' },
  { id: '20360', name: 'Santa Barbara' },
  { id: '20335', name: 'Goleta' },
  { id: '20424', name: 'NorCal' },
  { id: '20388', name: 'Ojai' },
];

/**
 * Get store name by ID.
 * @param {string} storeId
 * @returns {string} Store name or the ID if not found
 */
export function getStoreName(storeId) {
  const store = STORE_DIRECTORY.find(s => s.id === storeId);
  return store ? store.name : storeId;
}

/**
 * Get store display label: "Name (#ID)"
 */
export function getStoreLabel(storeId) {
  const store = STORE_DIRECTORY.find(s => s.id === storeId);
  return store ? `${store.name} (#${store.id})` : `#${storeId}`;
}

/**
 * Search stores by partial ID or name. Used for predictive input.
 * @param {string} query
 * @returns {Array} Matching stores
 */
export function searchStores(query) {
  if (!query) return STORE_DIRECTORY;
  const q = query.toLowerCase();
  return STORE_DIRECTORY.filter(s =>
    s.id.includes(q) || s.name.toLowerCase().includes(q)
  );
}

export { STORE_DIRECTORY };
