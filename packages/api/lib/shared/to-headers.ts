/**
 * Wraps the plain header object the monday.com host sends into a `Headers`, so lookups are case-insensitive.
 * Returns undefined when the host forwarded no headers.
 */
export const toHeaders = (raw?: Record<string, string>): Headers | undefined => (raw ? new Headers(raw) : undefined);
