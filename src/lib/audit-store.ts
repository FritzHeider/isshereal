import { AuditResult } from './audit-engine';

// ── Bounded LRU cache for live audits on the server ──────────────────────
// Prevents memory exhaustion from unlimited Map growth (DoS vector)
const MAX_CACHE_ENTRIES = 500;
const auditCache = new Map<string, AuditResult>();

/** Evict oldest entries when cache exceeds MAX_CACHE_ENTRIES */
function evictIfNeeded(): void {
  if (auditCache.size <= MAX_CACHE_ENTRIES) return;
  // Map iterates in insertion order — delete the oldest entries
  const excess = auditCache.size - MAX_CACHE_ENTRIES;
  const iterator = auditCache.keys();
  for (let i = 0; i < excess; i++) {
    const key = iterator.next().value;
    if (key) auditCache.delete(key);
  }
}

export function saveAuditToStore(audit: AuditResult): void {
  const cleanHandle = audit.handle.replace(/^@/, '').toLowerCase();

  auditCache.set(audit.id.toLowerCase(), audit);
  auditCache.set(cleanHandle, audit);
  auditCache.set(`ig_${cleanHandle}`, audit);
  auditCache.set(`instagram_${cleanHandle}`, audit);

  evictIfNeeded();
}

export function getAuditFromStore(idOrHandle: string): AuditResult | null {
  const clean = idOrHandle.replace(/^@/, '').toLowerCase();
  return auditCache.get(clean) || null;
}
