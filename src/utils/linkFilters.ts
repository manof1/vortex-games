/**
 * Utility functions to filter out non-functional, clutter, or promotional links
 * such as riotpixels.com / riotpixels.net which are screenshot sites, not download hosts.
 */

export function isRiotPixelsLink(dl?: { url?: string; label?: string; hostName?: string } | null): boolean {
  if (!dl) return false;
  const u = (dl.url || '').toLowerCase();
  const l = (dl.label || '').toLowerCase();
  const h = (dl.hostName || '').toLowerCase();

  return (
    u.includes('riotpixels') ||
    l.includes('riot pixels') ||
    l.includes('riotpixels') ||
    h.includes('riot pixels') ||
    h.includes('riotpixels')
  );
}

export function filterOutRiotPixels<T extends { url?: string; label?: string; hostName?: string }>(links: T[] = []): T[] {
  if (!Array.isArray(links)) return [];
  return links.filter(link => !isRiotPixelsLink(link));
}
