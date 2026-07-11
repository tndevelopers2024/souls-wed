export const metadata = {
  title: "Privacy Policy | SoulsWed",
  description: "Privacy Policy and data protection guidelines for SoulsWed.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-400/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 font-medium">Last Updated: July 2026</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 space-y-8 text-sm md:text-base text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>1. Introduction</h2>
            <p>
              Welcome to SoulsWed ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. 
              If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>2. Information We Collect</h2>
            <p className="mb-2">We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products and services.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Personal Info Provided by You:</strong> We collect names; phone numbers; email addresses; and other similar information.</li>
              <li><strong>Payment Data:</strong> We collect data necessary to process your payment if you make purchases.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our website for a variety of business purposes described below. 
              We process your personal information for these purposes in reliance on our legitimate business interests, 
              in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>4. Will Your Information Be Shared With Anyone?</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
              Specifically, we may need to process your data or share your personal information with wedding vendors (venues, photographers, etc.) in order to facilitate your wedding planning.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>5. How Long Do We Keep Your Information?</h2>
            <p>
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, 
              unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--sw-navy)", fontFamily: "var(--font-heading)" }}>6. How Do We Keep Your Information Safe?</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
              However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
