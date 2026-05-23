import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedVenues from "@/components/home/FeaturedVenues";
import HowItWorks from "@/components/home/HowItWorks";
import PopularDestinations from "@/components/home/PopularDestinations";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import VendorCTA from "@/components/home/VendorCTA";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <CategoryGrid />
        <FeaturedVenues />
        <HowItWorks />
        <PopularDestinations />
        <TestimonialsSection />
        <VendorCTA />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
