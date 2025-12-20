/**
 * Tracking Snippet Generator
 * 
 * Generates installation snippets for tracking sites
 */

import "server-only";

export interface SnippetOptions {
  publicKey: string;
  domain: string;
  apiUrl?: string;
}

/**
 * Generate tracking snippet for installation
 */
export function generateTrackingSnippet(options: SnippetOptions): string {
  const { publicKey, domain, apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://app.optiq.io" } = options;

  return `<!-- Optiq Tracking Script -->
<script>
  (function() {
    window.optiq = window.optiq || [];
    window.optiq.publicKey = "${publicKey}";
    window.optiq.apiUrl = "${apiUrl}";
    
    // Track page view
    window.optiq.track = function(eventType, properties) {
      var event = {
        publicKey: window.optiq.publicKey,
        eventId: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        type: eventType || 'PAGE_VIEW',
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer || null,
        title: document.title || null,
        properties: properties || {},
        occurredAt: new Date().toISOString()
      };
      
      // Send to tracking endpoint
      fetch(window.optiq.apiUrl + '/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true
      }).catch(function(err) {
        console.error('Optiq tracking error:', err);
      });
    };
    
    // Auto-track page view
    window.optiq.track('PAGE_VIEW');
    
    // Track conversions
    window.optiq.conversion = function(value, properties) {
      window.optiq.track('CONVERSION', {
        ...properties,
        value: value
      });
    };
  })();
</script>
<!-- End Optiq Tracking Script -->`;
}

/**
 * Generate React/Next.js snippet
 */
export function generateReactSnippet(options: SnippetOptions): string {
  const { publicKey, apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://app.optiq.io" } = options;

  return `// Install in your _app.tsx or layout.tsx
import { useEffect } from 'react';
import { usePathname } from 'next/navigation'; // or 'next/router' for Pages Router

export function OptiqTracking() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Initialize Optiq
    window.optiq = {
      publicKey: "${publicKey}",
      apiUrl: "${apiUrl}",
      track: (eventType, properties) => {
        const event = {
          publicKey: window.optiq.publicKey,
          eventId: \`evt_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`,
          type: eventType || 'PAGE_VIEW',
          url: window.location.href,
          path: window.location.pathname,
          referrer: document.referrer || null,
          title: document.title || null,
          properties: properties || {},
          occurredAt: new Date().toISOString()
        };
        
        fetch(window.optiq.apiUrl + '/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
          keepalive: true
        }).catch(err => console.error('Optiq tracking error:', err));
      },
      conversion: (value, properties) => {
        window.optiq.track('CONVERSION', { ...properties, value });
      }
    };
  }, []);
  
  // Track page views on route change
  useEffect(() => {
    window.optiq?.track('PAGE_VIEW');
  }, [pathname]);
  
  return null;
}`;
}

/**
 * Generate installation instructions
 */
export function generateInstallInstructions(options: SnippetOptions): {
  html: string;
  react: string;
  verification: string;
} {
  return {
    html: `## HTML Installation

Add this snippet to your website's <head> tag, just before the closing </head>:

\`\`\`html
${generateTrackingSnippet(options)}
\`\`\`

The script will automatically track page views and provide methods for tracking conversions.`,

    react: `## React/Next.js Installation

1. Create a new component file \`components/OptiqTracking.tsx\`:

\`\`\`tsx
${generateReactSnippet(options)}
\`\`\`

2. Add to your root layout or _app.tsx:

\`\`\`tsx
import { OptiqTracking } from '@/components/OptiqTracking';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <OptiqTracking />
        {children}
      </body>
    </html>
  );
}
\`\`\``,

    verification: `## Verify Installation

1. Open your website in a browser
2. Open the browser console (F12)
3. Type: \`window.optiq\`
4. You should see the Optiq tracking object

To track a conversion:
\`\`\`javascript
window.optiq.conversion(99.99, { productId: '123', category: 'shoes' });
\`\`\`

Events will appear in your Optiq dashboard within a few minutes.`
  };
}
