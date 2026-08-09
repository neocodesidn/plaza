'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Turnstile from '@/components/Turnstile';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe, turnstileToken }),
    });
    const data = await res.json();

    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Gagal masuk.');
      return;
    }
    router.push(params.get('next') || '/dashboard');
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl mb-6">Masuk</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="text-sm text-seafoam block mb-1">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-seafoam block mb-1">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <label className="flex items-center gap-2 text-sm text-seafoam">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-lure w-4 h-4" />
          Ingat saya selama 30 hari
        </label>
        {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} onToken={setTurnstileToken} />}
        {error && <p className="text-danger text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={loading || (!!turnstileSiteKey && !turnstileToken)}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
        <p className="text-sm text-seafoam text-center">
          Belum punya akun? <Link href="/register" className="text-lure">Daftar</Link>
        </p>
      </form>
    </div>
  );
}
