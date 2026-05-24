
import HeroSection from "@/components/home/HeroSection";
import WeddingCategoriesSection from "@/components/home/WeddingCategoriesSection";
import FeaturedVenues from "@/components/home/FeaturedVenues";
import PhotographersSection from "@/components/home/PhotographersSection";
import MakeupArtistsSection from "@/components/home/MakeupArtistsSection";
import DecoratorsPlannersSection from "@/components/home/DecoratorsPlannersSection";
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
        <TestimonialsSection />
      </main>

    </>
  );
}
