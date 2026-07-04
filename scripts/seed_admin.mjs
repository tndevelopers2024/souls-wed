/**
 * Seed admin user into MongoDB
 * Run with: node scripts/seed_admin.mjs
 */
import crypto from "crypto";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync } from "fs";

// Manually load .env
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

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI not found in .env");

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db();
    const admins = db.collection("admins");

    const email = "admin@soulswed.com";
    const existing = await admins.findOne({ email });
    if (existing) {
      console.log("✅ Admin already exists:", email);
      console.log("   ID:", existing._id.toString());
    } else {
      const result = await admins.insertOne({
        name: "Admin",
        email,
        passwordHash: hashPassword("password123"),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Admin created! ID:", result.insertedId.toString());
    }
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
