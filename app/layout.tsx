import { type Metadata } from 'next';
import localInter from 'next/font/local';
import './globals.css';

const inter = localInter({
  src: './fonts/inter/v4.1.ttf',
  weight: '100 900',
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Atlas',
  description: 'A private map of our travels'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en'
      className={inter.variable}
    >
      <body>{children}</body>
    </html>
  );
}
