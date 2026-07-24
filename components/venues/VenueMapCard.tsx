import { MapPin } from "lucide-react";

interface VenueMapCardProps {
  /** Venue or vendor name, used as the map query fallback. */
  name: string;
  city?: string;
  location?: string;
  /** Explicit Google Maps link set by the vendor, if any. */
  mapLink?: string;
}

/**
 * Booking.com-style map card — an embedded map with a "Show on map" button.
 *
 * Uses the keyless maps.google.com embed so no API key is required. If a
 * GOOGLE_MAPS_API_KEY is ever added, swap the src for the official Embed API.
 */
export default function VenueMapCard({ name, city, location, mapLink }: VenueMapCardProps) {
  const query = [name, location, city].filter(Boolean).join(", ");
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
  const openHref = mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div
      className="rounded-lg border overflow-hidden h-full flex flex-col"
      style={{ borderColor: "var(--sw-light-gray)", background: "var(--sw-surface)" }}
    >
      <div className="relative flex-1 min-h-[180px] w-full bg-slate-100">
        <iframe
          src={embedSrc}
          title={`Map showing ${name}`}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="p-4 flex items-start gap-2.5">
        <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--sw-primary)" }} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold leading-snug" style={{ color: "var(--sw-navy)" }}>
            {name}
          </p>
          {(location || city) && (
            <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--sw-steel)" }}>
              {[location, city].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <a
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2.5 rounded font-bold text-xs text-white transition-colors hover:brightness-95"
          style={{ background: "var(--sw-primary)" }}
        >
          Show on map
        </a>
      </div>
    </div>
  );
}
