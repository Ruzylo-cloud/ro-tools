/**
 * JMVG Store Directory — maps store IDs to names, locations, ROs, and DM assignments.
 * Source: UPDATED Weekly Employee Stability Snapshot (Google Sheet)
 *
 * NOTE: Some store names are from the sheet tab names (e.g. "Balboa", "Janss")
 * which may be street/plaza names rather than city names. Stores without confirmed
 * names from the sheet are marked with their store ID only.
 */

const STORE_DIRECTORY = [
  { id: '20011', name: 'Westlake', ro: 'Raul Rodriguez', dm: 'Jacob Elliott' },
  { id: '20013', name: 'Buellton', ro: 'Reilly McMahon', dm: 'Josh Smith', address: '211 E HWY 246 Suite 101, Buellton, CA 93427' },
  { id: '20026', name: 'Tampa', ro: 'Kassandra Baker', dm: 'Josiah Noray' },
  { id: '20048', name: 'Janss', ro: 'Alex Navarrete', dm: 'Jacob Elliott' },
  { id: '20075', name: 'Isla Vista', ro: 'Salvador Rangel', dm: 'Josh Smith' },
  { id: '20091', name: '20091', ro: '', dm: '' },
  { id: '20116', name: 'Encino', ro: 'Jaylen Israel', dm: 'Narek Khudabakhshyan' },
  { id: '20156', name: 'North Hollywood', ro: 'Elias Maldonado', dm: 'Narek Khudabakhshyan' },
  { id: '20171', name: '20171', ro: '', dm: '' },
  { id: '20177', name: '20177', ro: '', dm: '' },
  { id: '20218', name: 'Mission Hills', ro: 'Gabriel Alberto', dm: 'Ryan Dolezal' },
  { id: '20245', name: 'Wendy', ro: 'Oscar Menendez', dm: 'Jacob Elliott' },
  { id: '20255', name: 'Arboles', ro: 'Luis Adrian', dm: 'Narek Khudabakhshyan' },
  { id: '20267', name: 'Balboa', ro: 'Ameena Muhammad', dm: 'Josiah Noray' },
  { id: '20273', name: 'Big Bear', ro: 'Shelby Highfill', dm: 'Ryan Dolezal' },
  { id: '20291', name: '20291', ro: '', dm: '' },
  { id: '20292', name: '20292', ro: '', dm: '' },
  { id: '20294', name: 'Toluca', ro: 'Leonel Valdez', dm: 'Ryan Dolezal' },
  { id: '20300', name: '20300', ro: '', dm: '' },
  { id: '20311', name: 'Porter Ranch', ro: 'Jordan Baker', dm: 'Narek Khudabakhshyan' },
  { id: '20335', name: 'Goleta', ro: 'Marco Gonzalez', dm: 'Josh Smith', address: '163 N Fairview' },
  { id: '20352', name: 'San Fernando', ro: 'Martin Avianeda', dm: 'Ryan Dolezal' },
  { id: '20360', name: 'Santa Barbara', ro: 'Chris Ruzylo', dm: 'Narek Khudabakhshyan', address: '199 S Turnpike Rd, Santa Barbara, CA 93111' },
  { id: '20363', name: 'Warner Center', ro: 'Timothy Branam', dm: 'Josiah Noray' },
  { id: '20366', name: 'Burbank North', ro: 'Jazmin Santiago', dm: 'Jacob Elliott' },
  { id: '20381', name: 'Sylmar', ro: 'Celeste Bravo', dm: 'Ryan Dolezal' },
  { id: '20388', name: 'Lake Arrowhead', ro: 'Maria Bosarreyes', dm: 'Ryan Dolezal' },
  { id: '20424', name: 'Studio City', ro: 'Jasmine Moreno', dm: 'Narek Khudabakhshyan' },
];

/**
 * DM-to-store assignments from the Snapshot sheet.
 * Maps DM name -> array of store IDs they manage.
 */
const DM_ASSIGNMENTS = {
  'Josh Smith':             ['20013', '20360', '20075', '20335', '20255'],
  'Jacob Elliott':          ['20245', '20011', '20048'],
  'Narek Khudabakhshyan':   ['20424', '20156', '20311', '20116', '20366'],
  'Josiah Noray':           ['20026', '20267', '20363'],
  'Ryan Dolezal':           ['20381', '20218', '20273', '20388', '20294', '20352'],
};

/**
 * Maps jmvalley.com email prefixes to DM names for auto-assignment.
 */
const DM_EMAILS = {
  'jacob': 'Jacob Elliott',
  'narek': 'Narek Khudabakhshyan',
  'josh.s': 'Josh Smith',
  'josiah': 'Josiah Noray',
  'ryan': 'Ryan Dolezal',
};

/**
 * Get store name by ID.
 */
export function getStoreName(storeId) {
  const store = STORE_DIRECTORY.find(s => s.id === storeId);
  if (!store) return storeId;
  return store.name === storeId ? `#${storeId}` : store.name;
}

/**
 * Get store display label: "Name (#ID)" or "#ID" if no name.
 */
export function getStoreLabel(storeId) {
  const store = STORE_DIRECTORY.find(s => s.id === storeId);
  if (!store) return `#${storeId}`;
  return store.name === storeId ? `#${storeId}` : `${store.name} (#${store.id})`;
}

/**
 * Search stores by partial ID or name. Used for predictive input.
 */
export function searchStores(query) {
  if (!query) return STORE_DIRECTORY;
  const q = query.toLowerCase();
  return STORE_DIRECTORY.filter(s =>
    s.id.includes(q) || s.name.toLowerCase().includes(q) || (s.ro && s.ro.toLowerCase().includes(q))
  );
}

/**
 * Get stores assigned to a DM by email.
 * Returns array of store objects or empty array.
 */
export function getStoresForDM(email) {
  if (!email) return [];
  const prefix = email.split('@')[0]?.toLowerCase();
  const dmName = DM_EMAILS[prefix];
  if (!dmName || !DM_ASSIGNMENTS[dmName]) return [];

  return DM_ASSIGNMENTS[dmName].map(id =>
    STORE_DIRECTORY.find(s => s.id === id)
  ).filter(Boolean);
}

/**
 * Get store by RO email prefix match.
 */
export function getStoreForRO(email) {
  if (!email) return null;
  const prefix = email.split('@')[0]?.toLowerCase();
  // Match by first name from email
  return STORE_DIRECTORY.find(s => {
    if (!s.ro) return false;
    const roFirst = s.ro.split(' ')[0]?.toLowerCase();
    return roFirst === prefix || prefix.startsWith(roFirst);
  }) || null;
}

export { STORE_DIRECTORY, DM_ASSIGNMENTS, DM_EMAILS };
