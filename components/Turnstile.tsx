'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, any>) => string;
      reset: (id?: string) => void;
    };
  }
}

export default function Turnstile({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.turnstile) {
      setLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (loaded && ref.current && window.turnstile) {
      window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme: 'light',
        callback: onToken,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  if (!siteKey) return null;
  return <div ref={ref} className="my-1" />;
}
