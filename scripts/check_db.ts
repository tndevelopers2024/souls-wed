import { connectDB } from "../lib/mongodb";
import { Vendor } from "../lib/models/Vendor";
import { Venue } from "../lib/models/Venue";
import { ServiceListing } from "../lib/models/ServiceListing";
import mongoose from "mongoose";

async function check() {
  await connectDB();
  const vendors = await Vendor.find({});
  console.log(`Total vendors: ${vendors.length}`);
  vendors.forEach(v => console.log(`Vendor: ${v.email}, ID: ${v._id}`));

  const venues = await Venue.find({});
  console.log(`Total venues: ${venues.length}`);
  venues.forEach(v => console.log(`Venue: ${v.name}, VendorID: ${v.vendorId}`));

  const services = await ServiceListing.find({});
  console.log(`Total services: ${services.length}`);
  services.forEach(s => console.log(`Service: ${s.name}, VendorID: ${s.vendorId}`));

  process.exit(0);
}

check().catch(console.error);
