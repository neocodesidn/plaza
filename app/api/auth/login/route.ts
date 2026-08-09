import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyTurnstile } from '@/lib/turnstile';

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  const { email, password, rememberMe, turnstileToken } = await request.json();

  const ip = headers().get('x-forwarded-for');
  const captchaOk = await verifyTurnstile(turnstileToken, ip);
  if (!captchaOk) {
    return NextResponse.json({ error: 'Verifikasi captcha gagal, coba lagi.' }, { status: 400 });
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // "Ingat saya" → cookie bertahan 30 hari. Kalau tidak, jadi session
          // cookie biasa (hilang begitu browser ditutup).
          const finalOptions = rememberMe
            ? { ...options, maxAge: THIRTY_DAYS }
            : { ...options, maxAge: undefined, expires: undefined };
          cookieStore.set({ name, value, ...finalOptions });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
