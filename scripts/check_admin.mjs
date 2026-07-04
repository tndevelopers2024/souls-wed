/**
 * Check admin password hash and reset if needed
 * Run with: node scripts/check_admin.mjs
 */
import crypto from "crypto";
import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx < 0) continue;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim();
  if (!process.env[key]) process.env[key] = val;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, originalHash] = storedHash.split(":");
  const hashToTest = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return originalHash === hashToTest;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

const client = new MongoClient(process.env.MONGODB_URI);

async function check() {
  try {
    await client.connect();
    const db = client.db();
    const admins = db.collection("admins");
    const admin = await admins.findOne({ email: "admin@soulswed.com" });

    if (!admin) {
      console.log("❌ Admin not found!");
      return;
    }

    console.log("Admin found:", admin.email);
    console.log("Hash format valid:", admin.passwordHash?.includes(":"));
    
    const valid = verifyPassword("password123", admin.passwordHash);
    console.log("Password 'password123' matches:", valid);
    
    if (!valid) {
      console.log("⚠️  Resetting password to 'password123'...");
      const newHash = hashPassword("password123");
      await admins.updateOne({ _id: admin._id }, { $set: { passwordHash: newHash } });
      console.log("✅ Password reset successfully!");
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
