import { AuditResult } from './audit-engine';

// In-memory cache for live audits on the server
const auditCache = new Map<string, AuditResult>();

export function saveAuditToStore(audit: AuditResult): void {
  auditCache.set(audit.id.toLowerCase(), audit);
  // Also index by handle without @
  const cleanHandle = audit.handle.replace(/^@/, '').toLowerCase();
  auditCache.set(cleanHandle, audit);
  auditCache.set(`ig_${cleanHandle}`, audit);
  auditCache.set(`instagram_${cleanHandle}`, audit);
}

export function getAuditFromStore(idOrHandle: string): AuditResult | null {
  const clean = idOrHandle.replace(/^@/, '').toLowerCase();
  return auditCache.get(clean) || null;
}
