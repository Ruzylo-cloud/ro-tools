import { AuthProvider } from '@/components/AuthProvider';
import './globals.css';

export const metadata = {
  title: 'RO Tools — Restaurant Operator Tools',
  description: 'Generate catering flyers, marketing materials, and branded assets for Jersey Mike\'s operators.',
  icons: {
    icon: '/nfl-x-jm-revised.jpeg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
