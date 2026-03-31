import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Nestwise — SF Rental Intelligence',
  description: 'Find your perfect SF apartment before anyone else. Nestwise scans every listing in real time.',
  robots: 'index, follow',
  openGraph: {
    title: 'Nestwise — SF Rental Intelligence',
    description: 'Find your perfect SF apartment before anyone else.',
    url: 'https://nestwise-sf.vercel.app',
    siteName: 'Nestwise',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nestwise — SF Rental Intelligence',
    description: 'Find your perfect SF apartment before anyone else.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
