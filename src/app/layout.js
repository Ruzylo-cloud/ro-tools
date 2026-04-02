import { AuthProvider } from '@/components/AuthProvider';
import { ToastProvider } from '@/components/Toast';
import './globals.css';

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
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
