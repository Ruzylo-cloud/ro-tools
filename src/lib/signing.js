import crypto from 'crypto';
import { loadJsonFileAsync, updateJsonFile } from './data.js';

const SIGNING_FILE = 'signing-requests.json';
const EXPIRY_MS = 72 * 60 * 60 * 1000; // 72 hours

/**
 * Generate a unique signing token for document e-signature requests.
 * Uses crypto.randomUUID() for unpredictable, URL-safe tokens.
 */
export function generateSigningToken() {
  return crypto.randomUUID();
}

/**
 * Create a new signing request and persist it.
 * @param {Object} params
 * @param {string} params.token - Unique signing token
 * @param {string} params.documentType - Type of document (e.g. 'write-up', 'acknowledgment')
 * @param {string} params.documentTitle - Human-readable document title
 * @param {string} params.employeeName - Employee who needs to sign
 * @param {string} params.employeeEmail - Employee's email address
 * @param {string} params.managerName - Manager who created the request
 * @param {string} params.managerEmail - Manager's email
 * @param {Object} params.formData - The document form data for reference
 * @param {string} params.driveFolder - Google Drive folder ID (for future use)
 */
export async function createSigningRequest({
  token,
  documentType,
  documentTitle,
  employeeName,
  employeeEmail,
  managerName,
  managerEmail,
  formData,
  driveFolder,
}) {
  const request = {
    token,
    documentType,
    documentTitle,
    employeeName,
    employeeEmail,
    managerName,
    managerEmail,
    formData,
    driveFolder,
    status: 'pending',
    createdAt: new Date().toISOString(),
    signedAt: null,
    signerIP: null,
    signatureDataUrl: null,
  };

  await updateJsonFile(SIGNING_FILE, (data) => {
    if (!data.requests) data.requests = {};
    data.requests[token] = request;
    return data;
  });

  return request;
}

/**
 * Load a signing request by token.
 * Returns null if not found.
 */
export async function getSigningRequest(token) {
  const data = await loadJsonFileAsync(SIGNING_FILE);
  if (!data.requests) return null;
  return data.requests[token] || null;
}

/**
 * Check if a signing request has expired (72 hours from creation).
 */
export function isExpired(request) {
  if (!request?.createdAt) return true;
  const created = new Date(request.createdAt).getTime();
  return Date.now() - created > EXPIRY_MS;
}

/**
 * Complete a signing request with the employee's signature.
 * @param {string} token - Signing token
 * @param {Object} params
 * @param {string} params.signatureDataUrl - Base64 PNG data URL of the signature
 * @param {string} params.signedAt - ISO timestamp of signing
 * @param {string} params.signerIP - IP address of the signer
 */
export async function completeSigningRequest(token, { signatureDataUrl, signedAt, signerIP }) {
  const updated = await updateJsonFile(SIGNING_FILE, (data) => {
    if (!data.requests || !data.requests[token]) return data;
    data.requests[token].status = 'signed';
    data.requests[token].signatureDataUrl = signatureDataUrl;
    data.requests[token].signedAt = signedAt;
    data.requests[token].signerIP = signerIP;
    return data;
  });

  return updated.requests?.[token] || null;
}
