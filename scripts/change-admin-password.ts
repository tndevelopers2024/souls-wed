import { connectDB } from "../lib/mongodb";
import { Admin } from "../lib/models/Admin";
import { hashPassword } from "../lib/auth";

async function changeAdminPassword() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: npx tsx scripts/change-admin-password.ts <admin-email> <new-password>");
    process.exit(1);
  }

  const [email, newPassword] = args;

  await connectDB();
  console.log(`Looking for admin account with email: ${email}...`);

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

  if (!admin) {
    console.error(`❌ Admin account with email "${email}" not found.`);
    process.exit(1);
  }

  admin.passwordHash = hashPassword(newPassword);
  await admin.save();

  console.log(`✅ Successfully changed the password for admin: ${email}`);
  process.exit(0);
}

changeAdminPassword().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
