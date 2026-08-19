import type { Timestamp } from "firebase/firestore";

export { db } from "./config";

/** Firestore server timestamps arrive as Timestamp objects on read; local optimistic
 * writes may still hold a plain number until the server round-trip resolves. */
export function toMillis(value: Timestamp | number | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  return value.toMillis();
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}
