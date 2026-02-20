/**
 * Create a stable composite key for a row using selected columns.
 * Case-insensitive + trims. (Remove toLowerCase() if you want strict.)
 */
export function makeKey(row, columns) {
  return columns
    .map((col) => String(row?.[col] ?? "").trim().toLowerCase())
    .join("||");
}

/**
 * Returns ONE array: rows that are NOT common between A and B.
 * Each row includes a "__source" field: "file_a" or "file_b"
 * to indicate where it came from.
 *
 * Handles duplicates by counts.
 */
export function compareNotCommon(rowsA, rowsB, columns) {
  const mapA = new Map(); // key -> array(rows)
  const mapB = new Map();

  for (const r of rowsA) {
    const k = makeKey(r, columns);
    if (!mapA.has(k)) mapA.set(k, []);
    mapA.get(k).push(r);
  }

  for (const r of rowsB) {
    const k = makeKey(r, columns);
    if (!mapB.has(k)) mapB.set(k, []);
    mapB.get(k).push(r);
  }

  const notCommon = [];
  const keys = new Set([...mapA.keys(), ...mapB.keys()]);

  for (const k of keys) {
    const arrA = mapA.get(k) || [];
    const arrB = mapB.get(k) || [];

    if (arrA.length > arrB.length) {
      const extras = arrA.slice(arrB.length).map((row) => ({
        __source: "file_a",
        ...row,
      }));
      notCommon.push(...extras);
    } else if (arrB.length > arrA.length) {
      const extras = arrB.slice(arrA.length).map((row) => ({
        __source: "file_b",
        ...row,
      }));
      notCommon.push(...extras);
    }
  }

  return notCommon;
}