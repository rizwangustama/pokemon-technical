import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.scss';
import Providers from './providers';
import CustomCursor from '@/components/ui/CustomCursor';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pokemon V2',
  description: 'Pokemon technical test project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">
        <CustomCursor />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
