import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navigation } from './_components';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Escrow App',
  description: 'A decentralized escrow application',
};

/**
 *
 *The root class has been added because of base-ui https://base-ui.com/react/overview/quick-start#set-up-portals
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 antialiased`}
      >
        <Navigation />
        <div className='root'>{children}</div>
      </body>
    </html>
  );
}
