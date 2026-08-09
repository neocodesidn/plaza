'use client';

import { useEffect, useRef } from 'react';

export default function AdSlot({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || !html?.trim()) return;

    container.innerHTML = html;

    // Browsers don't execute <script> tags inserted via innerHTML, so we
    // manually recreate each one — this is what actually makes ad network
    // snippets (Adsterra, etc.) run.
    const scripts = Array.from(container.querySelectorAll('script'));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    });

    return () => {
      container.innerHTML = '';
    };
  }, [html]);

  if (!html?.trim()) return null;
  return <div ref={ref} />;
}
