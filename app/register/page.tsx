'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Turnstile from '@/components/Turnstile';

export default function RegisterPage() {
  const supabase = createClient();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'turnstile_site_key')
      .maybeSingle()
      .then(({ data }) => setTurnstileSiteKey(data?.value ?? ''));
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username, turnstileToken }),
    });
    const data = await res.json();

    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Gagal daftar.');
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-20 card p-8 text-center">
        <h1 className="text-2xl mb-2">Cek email lo</h1>
        <p className="text-seafoam text-sm">Kita udah kirim link konfirmasi ke <span className="text-foam">{email}</span>. Klik link-nya buat aktivin akun.</p>
        <Link href="/login" className="btn-primary inline-block mt-6">Ke halaman login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl mb-6">Daftar akun</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="text-sm text-seafoam block mb-1">Username</label>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="reelmaster99" required />
        </div>
        <div>
          <label className="text-sm text-seafoam block mb-1">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-seafoam block mb-1">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        </div>
        {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} onToken={setTurnstileToken} />}
        {error && <p className="text-danger text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={loading || (!!turnstileSiteKey && !turnstileToken)}>
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
        <p className="text-sm text-seafoam text-center">
          Udah punya akun? <Link href="/login" className="text-lure">Masuk</Link>
        </p>
      </form>
    </div>
  );
}
