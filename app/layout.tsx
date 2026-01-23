import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
      <head>
        <link
          href='https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.0.3/Vazirmatn-Variable.css'
          rel='stylesheet'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
