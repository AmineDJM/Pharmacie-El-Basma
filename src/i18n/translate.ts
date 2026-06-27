/** Resolve a dotted key path within a nested dictionary. */
function resolve(dict: unknown, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
  return typeof value === 'string' ? value : undefined;
}

export type TFunction = (path: string, vars?: Record<string, string | number>) => string;

/** Build a translation function bound to a dictionary. */
export function makeT(dict: unknown): TFunction {
  return (path, vars) => {
    let str = resolve(dict, path);
    if (str === undefined) return path; // visible fallback if a key is missing
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str!.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return str!;
  };
}
