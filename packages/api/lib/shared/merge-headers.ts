/**
 * Merges header objects case-insensitively, so a header set with different casing
 * (e.g. `Idempotency-Key` vs `idempotency-key`) overrides rather than duplicates.
 * Later sources win. The casing of the last-set occurrence of a header name is kept.
 *
 * @param {...(Record<string, string> | undefined)} sources - Header objects to merge, in precedence order.
 * @returns {Record<string, string>} - The merged headers.
 */
export const mergeHeaders = (...sources: (Record<string, string> | undefined)[]): Record<string, string> => {
  const result: Record<string, string> = {};
  const keyByLowerCase: Record<string, string> = {};

  for (const source of sources) {
    for (const [key, value] of Object.entries(source || {})) {
      const lowerKey = key.toLowerCase();
      const existingKey = keyByLowerCase[lowerKey];
      if (existingKey && existingKey !== key) {
        delete result[existingKey];
      }
      result[key] = value;
      keyByLowerCase[lowerKey] = key;
    }
  }

  return result;
};
