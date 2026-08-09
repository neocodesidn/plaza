import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyTurnstile } from '@/lib/turnstile';

export async function POST(request: Request) {
  const { email, password, username, turnstileToken } = await request.json();

  const ip = headers().get('x-forwarded-for');
  const captchaOk = await verifyTurnstile(turnstileToken, ip);
  if (!captchaOk) {
    return NextResponse.json({ error: 'Verifikasi captcha gagal, coba lagi.' }, { status: 400 });
  }

  if (!username || username.length < 3) {
    return NextResponse.json({ error: 'Username minimal 3 karakter.' }, { status: 400 });
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
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
