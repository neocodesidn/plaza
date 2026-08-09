export async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // If no secret is configured, the admin hasn't turned Turnstile on — skip the check.
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    });
    const data = await res.json();
    return !!data.success;
  } catch {
    return false;
  }
}
