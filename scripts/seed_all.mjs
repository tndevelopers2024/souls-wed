/**
 * Seed all demo accounts into MongoDB.
 * Run with: node scripts/seed_all.mjs
 *
 * Creates (or replaces) these accounts:
 *   Admin  — admin@soulswed.com  / admin123
 *   Vendor — vendor@soulswed.com / vendor123
 *   User   — mohan@soulswed.com  / password123
 */

import crypto from "crypto";
import { MongoClient } from "mongodb";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync } from "fs";

// ── Load .env ──────────────────────────────────────────────────────────────
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

// ── Password hashing — must match lib/auth.ts (100_000 iterations) ─────────
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

// ── Upsert helper — replaces the account if it already exists ──────────────
async function upsertAccount(collection, email, doc, label) {
  const existing = await collection.findOne({ email });
  if (existing) {
    await collection.replaceOne({ email }, { ...doc, createdAt: existing.createdAt });
    console.log(`↺  ${label} updated   → ${email}`);
  } else {
    await collection.insertOne(doc);
    console.log(`✅ ${label} created   → ${email}`);
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI not found in .env");

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db();

    const now = new Date();

    // ── Admin ──────────────────────────────────────────────────────────────
    await upsertAccount(
      db.collection("admins"),
      "admin@soulswed.com",
      {
        name: "Admin",
        email: "admin@soulswed.com",
        passwordHash: hashPassword("admin123"),
        role: "admin",
        createdAt: now,
      },
      "Admin "
    );

    // ── Vendor ─────────────────────────────────────────────────────────────
    await upsertAccount(
      db.collection("vendors"),
      "vendor@soulswed.com",
      {
        name: "Demo Vendor",
        businessName: "SoulsWed Demo Partner",
        email: "vendor@soulswed.com",
        passwordHash: hashPassword("vendor123"),
        phone: "+91 98765 43210",
        category: "Photography",
        city: "Chennai",
        description: "Official demo vendor account for SoulsWed.",
        website: "",
        instagram: "",
        rating: 0,
        reviewCount: 0,
        featured: false,
        verified: true,
        available: true,
        createdAt: now,
      },
      "Vendor"
    );

    // ── User ───────────────────────────────────────────────────────────────
    await upsertAccount(
      db.collection("users"),
      "mohan@soulswed.com",
      {
        name: "Mohan",
        email: "mohan@soulswed.com",
        passwordHash: hashPassword("password123"),
        phone: "",
        role: "user",
        createdAt: now,
      },
      "User  "
    );

    console.log("\nDone. Login details:");
    console.log("  Admin  → https://souls-wed.vercel.app/admin   | admin@soulswed.com  / admin123");
    console.log("  Vendor → https://souls-wed.vercel.app/vendor  | vendor@soulswed.com / vendor123");
    console.log("  User   → https://souls-wed.vercel.app/        | mohan@soulswed.com  / password123");
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
