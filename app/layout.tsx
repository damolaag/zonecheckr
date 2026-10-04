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

const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem('zonecheckr-theme');
    var theme = saved === 'light' || saved === 'dark' ? saved : 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (_) {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';
  }
})();`;

const consentScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }

gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});

window.updateGptConsentState = function(consentedToAds, consentedToAnalytics) {
  var statusAds = consentedToAds ? 'granted' : 'denied';
  var statusAnalytics = consentedToAnalytics ? 'granted' : 'denied';

  gtag('consent', 'update', {
    ad_storage: statusAds,
    ad_user_data: statusAds,
    ad_personalization: statusAds,
    analytics_storage: statusAnalytics
  });

  if (window.googletag && window.googletag.cmd) {
    window.googletag.cmd.push(function() {
      if (window.googletag.pubadsReady) {
        window.googletag.pubads().refresh();
      }
    });
  }
};`;


const gtmScript = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W3BRRPPT');`;

const gptScript = `
window.googletag = window.googletag || { cmd: [] };

window.gptTrackingEngine = window.gptTrackingEngine || {
  refreshableSlots: [],
  refreshIntervalMs: 60000,
  isProcessingRefresh: false,
  viewableSlotTracker: {},
  viewabilityObserver: null,
  registeredSlots: {},

  observeSlot: function(divId) {
    var self = this;
    var el = document.getElementById(divId);
    if (!el || !self.viewabilityObserver) return;
    self.viewabilityObserver.observe(el);
  }
};

window.googletag.cmd.push(function() {
  // Banner 1: immediately below the header. Keep this compact on every viewport
  // so the first useful ZoneCheckr content remains visible above the fold.
  var mappingTop = window.googletag
    .sizeMapping()
    .addSize([1024, 0], [[970, 90], [960, 90], [728, 90], [970, 66], [320, 100], [300, 100], [320, 50], [300, 50]])
    .addSize([768, 0], [[728, 90], [320, 100], [300, 100], [320, 50], [300, 50]])
    .addSize([0, 0], [[320, 50], [320, 100], [300, 100], [300, 50]])
    .build();

  // Banner 2: lower homepage placement can accept larger display formats.
  var mappingBody = window.googletag
    .sizeMapping()
    .addSize([1024, 0], [[970, 90], [728, 90], [300, 250], [300, 100], [320, 100], [320, 50], [300, 50], 'fluid'])
    .addSize([768, 0], [[728, 90], [300, 250], [300, 100], [320, 100], [320, 50], [300, 50], 'fluid'])
    .addSize([0, 0], [[300, 250], [320, 100], [320, 50], [300, 100], [300, 50], 'fluid'])
    .build();

  // Banner 3: partner-approved bottom anchor. Keep it compact so it does not
  // cover a large portion of the utility UI on desktop or mobile.
  var mappingAnchor = window.googletag
    .sizeMapping()
    .addSize([768, 0], [[728, 90], [320, 100], [320, 50], [300, 100], [300, 50]])
    .addSize([0, 0], [[320, 100], [320, 50], [300, 100], [300, 50]])
    .build();

  var slotsToRegister = [
    {
      path: '/23043164651/zonecheckr_banner1',
      sizes: [[970, 90], [960, 90], [728, 90], [970, 66], [320, 100], [320, 50], [300, 100], [300, 50]],
      div: 'div-gpt-ad-1790006377572-0',
      mapping: mappingTop
    },
    {
      path: '/23043164651/zonecheckr_banner2',
      sizes: [[970, 90], [728, 90], [300, 250], [300, 100], [320, 100], [320, 50], [300, 50], 'fluid'],
      div: 'div-gpt-ad-1790180731446-0',
      mapping: mappingBody
    },
    {
      path: '/23043164651/zonecheckr_banner3',
      sizes: [[728, 90], [320, 100], [320, 50], [300, 100], [300, 50]],
      div: 'div-gpt-ad-1790006153357-0',
      mapping: mappingAnchor
    },
    {
      // Banner 3 is also used as the inline unit on individual tool/guide pages.
      // A separate div id prevents a duplicate-id/GPT collision with the anchor.
      path: '/23043164651/zonecheckr_banner3',
      sizes: [[970, 90], [728, 90], [336, 280], [300, 250], [320, 100], [320, 50], [300, 100], [300, 50], 'fluid'],
      div: 'div-gpt-ad-1790006153357-inline-0',
      mapping: mappingBody
    }
  ];

  slotsToRegister.forEach(function(config) {
    var slot = window.googletag
      .defineSlot(config.path, config.sizes, config.div)
      .defineSizeMapping(config.mapping)
      .addService(window.googletag.pubads());

    if (slot) {
      window.gptTrackingEngine.refreshableSlots.push(slot);
      window.gptTrackingEngine.registeredSlots[config.div] = slot;
    }
  });

  window.googletag.pubads().addEventListener('slotRenderEnded', function(event) {
    window.gptTrackingEngine.isProcessingRefresh = false;
    console.log('[GPT] Render ended:', event.slot.getSlotElementId(), 'empty:', event.isEmpty, 'size:', event.size);
  });

  window.googletag.pubads().addEventListener('impressionViewable', function(event) {
    console.log('[GPT] Impression viewable:', event.slot.getSlotElementId());
  });

  var visibilityTimers = {};
  window.googletag.pubads().addEventListener('slotVisibilityChanged', function(event) {
    var slotId = event.slot.getSlotElementId();
    if (visibilityTimers[slotId]) clearTimeout(visibilityTimers[slotId]);
    visibilityTimers[slotId] = setTimeout(function() {
      console.log('[GPT] Visibility:', slotId, event.inViewPercentage + '%');
    }, 150);
  });

  // Intentionally avoid GPT lazy loading here. Each mounted AdSlot calls
  // googletag.display() immediately so banner 1, banner 2, inline units and
  // the bottom anchor can request inventory as soon as their DOM node exists.
  // This also prevents lower-page units from waiting several minutes for a
  // lazy-load viewport threshold.
  window.googletag.pubads().setTargeting('sections', ['all']);
  window.googletag.pubads().collapseEmptyDivs(true);
  window.googletag.enableServices();

  if ('IntersectionObserver' in window) {
    window.gptTrackingEngine.viewabilityObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var id = entry.target.id;
        if (entry.intersectionRatio >= 0.5) {
          if (!window.gptTrackingEngine.viewableSlotTracker[id]) {
            window.gptTrackingEngine.viewableSlotTracker[id] = Date.now();
          }
        } else {
          window.gptTrackingEngine.viewableSlotTracker[id] = null;
        }
      });
    }, { threshold: [0, 0.5, 1] });
  }

  if (!window.gptTrackingEngine.refreshTimer) {
    window.gptTrackingEngine.refreshTimer = window.setInterval(function() {
      if (document.hidden) return;
      if (window.gptTrackingEngine.isProcessingRefresh) return;
      if (!window.googletag.pubadsReady) return;

      var slotsEligibleForRefresh = window.gptTrackingEngine.refreshableSlots.filter(function(slot) {
        var divId = slot.getSlotElementId();
        var visibleSince = window.gptTrackingEngine.viewableSlotTracker[divId];
        return visibleSince && Date.now() - visibleSince >= 1000;
      });

      if (slotsEligibleForRefresh.length > 0) {
        window.gptTrackingEngine.isProcessingRefresh = true;
        window.googletag.pubads().refresh(slotsEligibleForRefresh, { changeCorrelator: false });
      }
    }, window.gptTrackingEngine.refreshIntervalMs);
  }
});`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
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
