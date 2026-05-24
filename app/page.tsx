
import HeroSection from "@/components/home/HeroSection";
import WeddingCategoriesSection from "@/components/home/WeddingCategoriesSection";
import FeaturedVenues from "@/components/home/FeaturedVenues";
import PhotographersSection from "@/components/home/PhotographersSection";
import MakeupArtistsSection from "@/components/home/MakeupArtistsSection";
import DecoratorsPlannersSection from "@/components/home/DecoratorsPlannersSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import HowItWorks from "@/components/home/HowItWorks";
import PopularDestinations from "@/components/home/PopularDestinations";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function Home() {
  return (
    <>

      <main>
        <HeroSection />
        <WeddingCategoriesSection />
        <FeaturedVenues />
        <PhotographersSection />
        <MakeupArtistsSection />
        <DecoratorsPlannersSection />
        <CategoryGrid />
        <HowItWorks />
        <PopularDestinations />
        <TestimonialsSection />
      </main>

    </>
  );
}
