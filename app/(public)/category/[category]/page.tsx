import { redirect } from "next/navigation";

const vendorCategories = new Set([
  "planners",
  "photographers",
  "decorators",
  "makeup",
  "caterers",
  "djs",
]);

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
    redirect(`/vendors/${category}`);
  }

  redirect("/vendors");
}
