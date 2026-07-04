import crypto from "crypto";

/**
 * Hash a password using PBKDF2 with a random salt.
 * Returns the hash in the format: salt:hash
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a plain text password against a stored pbkdf2 hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }
  const [salt, originalHash] = storedHash.split(":");
  const hashToTest = crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return originalHash === hashToTest;
}
