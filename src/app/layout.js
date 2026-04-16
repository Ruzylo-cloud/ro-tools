import { AuthProvider } from '@/components/AuthProvider';
import { ToastProvider } from '@/components/Toast';
import './globals.css';

// NOTE: Server-boot migrations run via Next.js instrumentation hook
// (see ../../instrumentation.js). Do not re-import or re-fire here.

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata = {
  title: 'RO Tools — Restaurant Operator Tools',
  description: 'Generate catering flyers, marketing materials, and branded assets for Jersey Mike\'s operators.',
  icons: {
    icon: '/jmvg-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#EE3227" />
        {/* RT-271: PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RO Tools" />
        {/* RT-269: Preconnect hints for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* RT-264: font-display:swap via &display=swap */}
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800;900&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* RT-283: Skip to content link */}
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        {/* RT-DM-INIT: Enterprise Theme Engine initialization — prevents flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var p = localStorage.getItem('mc-theme-pref') || 'default';
              var m = localStorage.getItem('mc-theme-mode') || 'auto';
              
              var apply = function(pref, mode) {
                var finalMode = mode === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode;
                if (pref === 'default') {
                  document.documentElement.setAttribute('data-theme', finalMode);
                } else {
                  var theme = pref;
                  if (pref === 'ultra-pro-gloss') {
                    theme = finalMode === 'dark' ? 'ultra-pro-gloss-dark' : 'ultra-pro-gloss-light';
                  } else if (pref === 'hybrid-v1-balanced') {
                    theme = finalMode === 'dark' ? 'hybrid-v1-balanced-dark' : 'hybrid-v1-balanced-light';
                  } else if (pref === 'hybrid-v3-highpop') {
                    theme = finalMode === 'dark' ? 'hybrid-v3-highpop-dark' : 'hybrid-v3-highpop-light';
                  } else if (pref === 'hybrid-v3') {
                    theme = finalMode === 'dark' ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                }
              };
              apply(p, m);
            } catch(e) { console.debug('[layout] theme init failed:', e); }
          })();
        `}} />
        {/* RT-270: Service worker registration */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function(e) { console.debug('[layout] SW registration failed (non-fatal):', e); });
            });
          }
        `}} />
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
