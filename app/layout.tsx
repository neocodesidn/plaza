import type { Metadata } from 'next';
import { Fredoka, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-fredoka' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbmono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

export const metadata: Metadata = {
  title: 'ReelTrade — Trade Fish It items',
  description: 'Platform trade item Fish It (Roblox) yang aman. Ajukan trade, ngobrol langsung, dan ketemuan lewat private server yang diverifikasi admin.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fredoka.variable} ${inter.variable} ${jbmono.variable}`}>
      <body>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 md:px-6 pb-24">{children}</main>
      </body>
    </html>
  );
}
