export const metadata = {
  title: "Terms and Conditions | SoulsWed",
  description: "Terms and Conditions of use for SoulsWed services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-400/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>
            Terms & Conditions
          </h1>
          <p className="text-sm text-slate-500 font-medium">Last Updated: July 2026</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 space-y-8 text-sm md:text-base text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>1. Agreement to Terms</h2>
            <p>
              These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and SoulsWed ("we," "us" or "our"), 
              concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>2. Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, 
              and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>3. User Representations</h2>
            <p className="mb-2">By using the Site, you represent and warrant that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
              <li>You are not a minor in the jurisdiction in which you reside.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>4. Vendor Services</h2>
            <p>
              We act as a directory and planning platform connecting couples with wedding vendors. We do not directly employ the vendors listed on our site. 
              Any booking or contract formed is strictly between you and the respective vendor. We are not responsible for the performance, quality, or fulfillment of vendor services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>5. Cancellation and Refunds</h2>
            <p>
              Cancellation policies and refund availability are subject to the individual contracts established between you and your selected vendors. 
              SoulsWed does not issue refunds for vendor services, unless expressly stated in a separate agreement for premium planning services directly provided by us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>6. Modifications and Interruptions</h2>
            <p>
              We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. 
              We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
