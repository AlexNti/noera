import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from './_components';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
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
      <body className={`${spaceGrotesk.variable} min-h-screen bg-[image:var(--gradient-primary)]`}>
        <Navigation />
        <div className='root'>{children}</div>
      </body>
    </html>
  );
}
