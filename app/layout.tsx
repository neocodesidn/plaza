import type { Metadata } from 'next';
import { Fredoka, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AppSidebar from '@/components/AppSidebar';
import Footer from '@/components/Footer';
import AdSlot from '@/components/AdSlot';
import { createClient } from '@/lib/supabase/server';
import { hexToRgbChannels } from '@/lib/color';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-fredoka' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbmono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

export const metadata: Metadata = {
  title: 'ReelTrade — Trade Fish It items',
  description: 'Platform trade & jual-beli item Fish It (Roblox) yang aman. Ajukan trade atau beli langsung, ngobrol, dan ketemuan lewat private server otomatis.',
};

async function getSiteSettings() {
  const supabase = createClient();
  const { data } = await supabase.from('site_settings').select('*');
  const settings: Record<string, string> = {};
  data?.forEach((r) => { settings[r.key] = r.value; });
  return settings;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const clay = settings.theme_primary ? hexToRgbChannels(settings.theme_primary) : null;
  const gold = settings.theme_secondary ? hexToRgbChannels(settings.theme_secondary) : null;
  const siteName = settings.site_name || 'ReelTrade';

  return (
    <html lang="id" className={`${fredoka.variable} ${inter.variable} ${jbmono.variable}`}>
      <head>
        {(clay || gold) && (
          <style
            dangerouslySetInnerHTML={{
              __html: `:root{${clay ? `--clay:${clay};` : ''}${gold ? `--gold:${gold};` : ''}}`,
            }}
          />
        )}
      </head>
      <body className="md:flex min-h-screen">
        <AppSidebar siteName={siteName} />

        <div className="flex flex-col min-h-screen md:min-h-0 flex-1 min-w-0">
          <Navbar siteName={siteName} />

          {settings.ads_header_script && (
            <div className="max-w-6xl mx-auto px-4 md:px-6 pt-3 w-full">
              <AdSlot html={settings.ads_header_script} />
            </div>
          )}

          <main className="max-w-6xl mx-auto px-4 md:px-6 pb-24 w-full flex-1">{children}</main>

          {settings.ads_footer_script && (
            <div className="max-w-6xl mx-auto px-4 md:px-6 pb-6 w-full">
              <AdSlot html={settings.ads_footer_script} />
            </div>
          )}

          <Footer siteName={siteName} />
        </div>
      </body>
    </html>
  );
}
