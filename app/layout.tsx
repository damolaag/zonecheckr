import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomAnchorAd } from "@/components/BottomAnchorAd";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — DNS & Domain Diagnostic Tools`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — DNS & Domain Diagnostic Tools`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — DNS & Domain Diagnostic Tools`,
    description: siteConfig.description,
  },
  icons: {
    icon: "/brand/favicon.svg",
    shortcut: "/brand/favicon.svg",
    apple: "/brand/favicon-192.png",
  },
};

// Dark is the default; a saved choice from the theme switch still wins.
const themeScript = `
(function () {
  var theme = 'dark';
  try {
    var saved = localStorage.getItem('zonecheckr-theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (_) {}
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();`;

// Google Consent Mode v2.
// Visitors in the EEA, UK and Switzerland start with everything denied until a
// consent banner (e.g. GAM Privacy & messaging) grants it. Everywhere else
// analytics and ads storage are granted by default, so GA4 records sessions.
// Previously everything was denied for everyone and nothing ever sent an
// update, which is why GA showed no traffic while GTM was firing.
const consentScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }

gtag('consent', 'default', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted'
});

gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'],
  wait_for_update: 500
});

gtag('set', 'ads_data_redaction', true);

// Kept for any consent tool already wired to call it from GTM.
window.updateGptConsentState = function(consentedToAds, consentedToAnalytics) {
  var statusAds = consentedToAds ? 'granted' : 'denied';
  gtag('consent', 'update', {
    ad_storage: statusAds,
    ad_user_data: statusAds,
    ad_personalization: statusAds,
    analytics_storage: consentedToAnalytics ? 'granted' : 'denied'
  });
  // Applies to the next ad request; no forced refresh, so ads on screen stay put.
  window.googletag = window.googletag || { cmd: [] };
  window.googletag.cmd.push(function() {
    if (window.googletag.setConfig) {
      window.googletag.setConfig({
        privacyTreatments: { treatments: consentedToAds ? [] : ['disablePersonalization'] }
      });
    }
  });
};`;

const gtmScript = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W3BRRPPT');`;

// GPT page setup and viewability-based refresh.
// Page slots are defined, displayed and destroyed by <AdSlot>, which remounts
// on every route change, so each page view gets fresh ad requests. The bottom
// anchor stays mounted and is refreshed on each route change. Otherwise a slot
// is only refreshed after it has been at least 50% in view for 60 seconds of
// visible-tab time; slots scrolled out of view keep their current ad instead
// of going blank. An unfilled slot retries at most 3 times per page, 60
// seconds apart. Add ?adsdebug=1 to log activity.
const gptScript = `
window.googletag = window.googletag || { cmd: [] };

window.zcAds = window.zcAds || (function() {
  var REFRESH_AFTER_MS = 60000;
  var EMPTY_RETRY_MS = 60000;
  var MAX_EMPTY_RETRIES = 3;
  var STUCK_MS = 20000;
  var TICK_MS = 1000;
  var debug = /[?&]adsdebug=1/.test(location.search);
  var slots = {};

  function log() {
    if (debug) console.log.apply(console, ['[ads]'].concat([].slice.call(arguments)));
  }

  function wrapperOf(divId) {
    var el = document.getElementById(divId);
    return el && el.closest ? el.closest('.gam-ad-slot') : null;
  }

  function tick() {
    if (document.hidden || !window.googletag.pubadsReady) return;
    var now = Date.now();
    Object.keys(slots).forEach(function(divId) {
      var s = slots[divId];
      if (!s.rendered) return;
      if (s.pendingSince) {
        if (now - s.pendingSince > STUCK_MS) s.pendingSince = 0;
        return;
      }
      if (s.empty && s.emptyRetries >= MAX_EMPTY_RETRIES) return;
      if (s.alwaysInView || s.inView >= 50) s.visibleMs += TICK_MS;
      if (s.visibleMs >= (s.empty ? EMPTY_RETRY_MS : REFRESH_AFTER_MS)) {
        if (s.empty) s.emptyRetries++;
        s.visibleMs = 0;
        s.pendingSince = now;
        log('refresh', divId);
        window.googletag.pubads().refresh([s.slot]);
      }
    });
  }

  return {
    started: false,
    // alwaysInView: fixed placements (the bottom anchor) count as on screen,
    // so an unfilled anchor keeps retrying even while it is hidden.
    register: function(slot, alwaysInView) {
      slots[slot.getSlotElementId()] = {
        slot: slot, inView: 0, visibleMs: 0, rendered: false,
        filled: false, empty: false, emptyRetries: 0, pendingSince: 0,
        alwaysInView: !!alwaysInView
      };
    },
    // Fresh ad for a slot right now, e.g. the anchor on a route change.
    refreshNow: function(divId) {
      var s = slots[divId];
      if (!s || !window.googletag.pubadsReady) return;
      s.visibleMs = 0;
      s.emptyRetries = 0;
      s.pendingSince = Date.now();
      log('refresh (route change)', divId);
      window.googletag.pubads().refresh([s.slot]);
    },
    unregister: function(divId) { delete slots[divId]; },
    start: function() {
      if (this.started) return;
      this.started = true;
      var pubads = window.googletag.pubads();

      pubads.addEventListener('slotRenderEnded', function(e) {
        var divId = e.slot.getSlotElementId();
        var s = slots[divId];
        if (!s || s.slot !== e.slot) return;
        s.rendered = true;
        s.pendingSince = 0;
        s.visibleMs = 0;
        s.empty = e.isEmpty;
        if (!e.isEmpty) {
          s.filled = true;
          s.emptyRetries = 0;
        }
        var wrapper = wrapperOf(divId);
        if (wrapper) wrapper.setAttribute('data-ad-state', e.isEmpty ? (s.filled ? 'refilling' : 'empty') : 'filled');
        log('render', divId, e.isEmpty ? 'empty' : e.size);
      });

      pubads.addEventListener('slotVisibilityChanged', function(e) {
        var s = slots[e.slot.getSlotElementId()];
        if (s && s.slot === e.slot) s.inView = e.inViewPercentage;
      });

      window.setInterval(tick, TICK_MS);
    }
  };
})();

window.googletag.cmd.push(function() {
  var googletag = window.googletag;
  var lazyLoad = { fetchMarginPercent: 150, renderMarginPercent: 50, mobileScaling: 2 };

  if (googletag.setConfig) {
    googletag.setConfig({ targeting: { sections: ['all'] }, lazyLoad: lazyLoad });
  } else {
    googletag.pubads().setTargeting('sections', ['all']);
    googletag.pubads().enableLazyLoad(lazyLoad);
  }

  window.zcAds.start();
  googletag.enableServices();
});`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: consentScript }} />
        <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
        <script
          async
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: gptScript }} />
      </head>
      <body suppressHydrationWarning>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W3BRRPPT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomAnchorAd />
      </body>
    </html>
  );
}
