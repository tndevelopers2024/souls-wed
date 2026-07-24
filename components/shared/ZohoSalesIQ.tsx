"use client";

import Script from "next/script";

/**
 * Embeds the real Zoho SalesIQ live-chat widget (same service the old
 * soulswed.com site used) in place of the old decorative fake chatbot.
 *
 * Zoho requires the `$zoho.salesiq` object to exist BEFORE the widget script
 * runs, otherwise the floating chat bubble never renders — so we define it and
 * then inject the widget script ourselves, guaranteeing the order.
 *
 * Note: Zoho SalesIQ only renders on domains added to your SalesIQ "Brands →
 * Websites" allow-list. On an un-approved domain (e.g. localhost) the bubble may
 * stay hidden even though the script loads; add the domain in the Zoho console.
 */
export default function ZohoSalesIQ() {
  const widgetCode = process.env.NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE;
  if (!widgetCode) return null;

  return (
    <Script id="zsiqchat" strategy="lazyOnload">
      {`
        window.$zoho = window.$zoho || {};
        $zoho.salesiq = $zoho.salesiq || { ready: function () {} };
        (function () {
          var d = document;
          if (d.getElementById("zsiqscript")) return;
          var s = d.createElement("script");
          s.type = "text/javascript";
          s.id = "zsiqscript";
          s.defer = true;
          s.src = "https://salesiq.zohopublic.in/widget?wc=${widgetCode}";
          var t = d.getElementsByTagName("script")[0];
          t.parentNode.insertBefore(s, t);
        })();
      `}
    </Script>
  );
}
