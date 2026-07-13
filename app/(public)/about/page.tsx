import Image from "@/components/shared/CustomImage";

export const metadata = {
  title: "About Us | SoulsWed",
  description: "Learn more about SoulsWed, the premier destination wedding planning platform.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-16 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 font-heading">
            Our <span className="text-orange-500">Story</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Crafting timeless memories across the globe. We transform couples&apos; visions into magnificent international celebrations with unparalleled elegance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-amber-100/50">
            <Image 
              src="/soulswed/venue.jpg" 
              alt="Beautiful Destination Wedding"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6 font-heading">The Heritage</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Founded with the vision to make destination weddings accessible and stress-free, SoulsWed is your trusted partner in planning the most important day of your life. We believe that every couple deserves a magical, flawless celebration regardless of where they choose to tie the knot.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Our platform connects you with the finest venues, world-class vendors, and expert planners across the globe. From sun-kissed beaches to historic castles, we bring the world&apos;s most breathtaking locations to your fingertips.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8 border-t border-amber-200/60 pt-8">
               <div>
                  <h3 className="text-4xl font-extrabold text-orange-500">500+</h3>
                  <p className="text-sm font-semibold tracking-wide text-slate-500 mt-2 uppercase">Weddings Planned</p>
               </div>
               <div>
                  <h3 className="text-4xl font-extrabold text-orange-500">50+</h3>
                  <p className="text-sm font-semibold tracking-wide text-slate-500 mt-2 uppercase">Destinations</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
