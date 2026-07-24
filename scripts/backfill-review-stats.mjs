/**
 * One-time data migration: make `rating` and `reviewCount` reflect the ACTUAL
 * reviews stored on each record, instead of the fabricated seed values.
 *
 * Seed data shipped venues/rooms/services with numbers like "412 reviews" and a
 * 5.0 rating but zero real review documents. This recomputes both fields from the
 * real `reviews[]` array (0 when there are none). The review-submission API keeps
 * them in sync going forward.
 *
 *   node scripts/backfill-review-stats.mjs
 */
import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

const loose = new mongoose.Schema({}, { strict: false });
const models = {
  Venue: mongoose.model("Venue", loose),
  Vendor: mongoose.model("Vendor", loose),
  ServiceListing: mongoose.model("ServiceListing", loose),
};

function computeStats(reviews) {
  const list = Array.isArray(reviews) ? reviews : [];
  const count = list.length;
  const rating =
    count === 0
      ? 0
      : Math.round((list.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / count) * 10) / 10;
  return { rating, reviewCount: count };
}

const run = async () => {
  await mongoose.connect(uri);
  let changed = 0;

  for (const [name, Model] of Object.entries(models)) {
    const docs = await Model.find({}).lean();
    for (const doc of docs) {
      const { rating, reviewCount } = computeStats(doc.reviews);
      if (doc.rating !== rating || doc.reviewCount !== reviewCount) {
        await Model.updateOne({ _id: doc._id }, { $set: { rating, reviewCount } });
        changed++;
        console.log(
          `${name}: ${doc.name || doc.businessName || doc._id}  ${doc.rating ?? 0}/${doc.reviewCount ?? 0} → ${rating}/${reviewCount}`
        );
      }
    }
  }

  console.log(`\nDone. Updated ${changed} record(s).`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
