import Link from 'next/link';

export default function Footer({ siteName }: { siteName: string }) {
  return (
    <footer className="border-t-2 border-foam mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-foam">
            <span className="w-3 h-3 rounded-full bg-lure border-2 border-foam" />
            {siteName}
          </div>
          <p className="text-seafoam text-sm mt-2 max-w-xs">
            Platform trade item Fish It yang aman — setiap trade diawasi sampai selesai,
            ketemuan lewat private server yang diverifikasi admin.
          </p>
        </div>

        <div>
          <p className="font-display text-sm text-foam mb-3">Navigasi</p>
          <ul className="space-y-2 text-sm text-seafoam">
            <li><Link href="/dashboard" className="hover:text-lure transition">Item &amp; Trade</Link></li>
            <li><Link href="/chat" className="hover:text-lure transition">Global Chat</Link></li>
            <li><Link href="/" className="hover:text-lure transition">Cara Kerja</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm text-foam mb-3">Keamanan</p>
          <ul className="space-y-2 text-sm text-seafoam">
            <li>Trade cuma jalan kalau kedua user setuju</li>
            <li>Link private server dikirim otomatis oleh sistem</li>
            <li>Laporkan user mencurigakan lewat chat trade</li>
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-foam">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-seafoam">
          <span>© {new Date().getFullYear()} {siteName}. Bukan produk resmi Roblox atau developer Fish It.</span>
          <span className="font-mono">dibuat buat komunitas Fish It Indonesia 🎣</span>
        </div>
      </div>
    </footer>
  );
}
