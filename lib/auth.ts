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

/**
 * Validate a password for strict security requirements.
 * Returns null if the password is valid, or an error message string if invalid.
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  
  if (!/(?=.*[0-9])/.test(password)) {
    return "Password must contain at least one number.";
  }
  
  if (!/(?=.*[!@#$%^&*()[\]{}\-_=+|;:'",.<>/?`~])/.test(password)) {
    return "Password must contain at least one special character.";
  }

  // Prevent simple or sequential passwords
  const lowerPass = password.toLowerCase();
  const predictablePatterns = ["12345", "qwerty", "password", "abcde", "admin"];
  for (const pattern of predictablePatterns) {
    if (lowerPass.includes(pattern)) {
      return "Password is too predictable. Please avoid common sequences or words.";
    }
  }

  return null;
}
