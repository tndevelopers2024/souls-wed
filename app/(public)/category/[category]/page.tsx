import { redirect } from "next/navigation";
import { VENDOR_CATEGORIES } from "@/lib/config/categories";

const vendorCategories = new Set(VENDOR_CATEGORIES.map(c => c.slug));

export default async function CategoryRedirectPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (category === "venues") {
    redirect("/venues");
  }

  if (vendorCategories.has(category)) {
    redirect(`/${category}`);
  }

  redirect("/");
}
