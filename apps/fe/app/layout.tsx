import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from './_components';
import { Space_Grotesk } from 'next/font/google';
import { CopilotKit } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';

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
        <CopilotKit publicApiKey='ck_pub_a9a0cde8c3468af576d90d7518013b87'>
          <Navigation />
          <div className='root'>{children}</div>
        </CopilotKit>
      </body>
    </html>
  );
}
