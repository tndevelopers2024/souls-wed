import Image from "next/image";
import { Mail } from "lucide-react";
import "./maintenance.css";

export default function MaintenancePage() {
  return (
    <div className="maintenance-wrapper">
      <div className="bg-wrapper">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="maintenance-container">
        <div className="logo">
          <Image
            src="/logo/logo-by-soulswed.png"
            alt="SoulsWed"
            width={200}
            height={64}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>

        <div className="pill-badge">
          <span className="dot"></span>
          MAINTENANCE MODE
        </div>

        <h1>
          Refining the <br />
          <span className="italic-accent">Perfect Experience</span>
        </h1>

        <p className="message">
          Website under renovation. We&apos;ll be back by August 2026!
        </p>

        <a href="mailto:info@soulswed.com" className="contact">
          <Mail className="w-4 h-4" />
          info@soulswed.com
        </a>
      </div>
    </div>
  );
}
