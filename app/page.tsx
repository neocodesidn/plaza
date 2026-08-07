import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="pt-16 md:pt-24">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-lure mb-4">Trade Fish It — aman &amp; diawasi admin</p>
        <h1 className="text-4xl md:text-5xl font-display font-semibold leading-tight">
          Tukeran item Fish It tanpa takut kena tipu.
        </h1>
        <p className="mt-4 text-seafoam text-lg">
          Ajukan trade, ngobrol langsung sama lawan trade lo, dan kalau berdua udah setuju —
          link private server dikirim otomatis biar kalian ketemu di dalam game.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/register" className="btn-primary">Mulai Trade</Link>
          <Link href="/dashboard" className="btn-secondary">Lihat Item</Link>
        </div>
      </div>

      <div className="mt-20 grid md:grid-cols-3 gap-4">
        {[
          { step: 'Tangkap', desc: 'Upload item Fish It lo — ikan, rod, bait, atau skin — lengkap dengan rarity-nya.' },
          { step: 'Tukar', desc: 'Ajukan trade ke item orang lain. Kedua belah pihak harus setuju sebelum lanjut.' },
          { step: 'Temu', desc: 'Setelah confirmed, admin kirim link private server ke chat trade kalian berdua.' },
        ].map((s, i) => (
          <div key={s.step} className="card p-5 relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="line-track h-8" />
              <span className="font-mono text-xs text-catch">0{i + 1}</span>
            </div>
            <h3 className="font-display text-lg mb-1">{s.step}</h3>
            <p className="text-seafoam text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
