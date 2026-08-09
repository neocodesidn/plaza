'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Field =
  | { key: string; label: string; type: 'text'; placeholder?: string; help?: string }
  | { key: string; label: string; type: 'textarea'; placeholder?: string; help?: string }
  | { key: string; label: string; type: 'color'; help?: string }
  | { key: string; label: string; type: 'checkbox'; help?: string };

export default function SettingsSection({
  fields,
  values,
}: {
  fields: Field[];
  values: Record<string, string>;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [state, setState] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => { init[f.key] = values[f.key] ?? (f.type === 'color' ? '#D97757' : ''); });
    return init;
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const rows = fields.map((f) => ({ key: f.key, value: state[f.key] ?? '', updated_at: new Date().toISOString() }));
    await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });

    setLoading(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="card p-5 space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          {f.type !== 'checkbox' && <label className="text-sm text-seafoam block mb-1">{f.label}</label>}

          {f.type === 'text' && (
            <input
              className="input"
              placeholder={'placeholder' in f ? f.placeholder : undefined}
              value={state[f.key]}
              onChange={(e) => setState((s) => ({ ...s, [f.key]: e.target.value }))}
            />
          )}

          {f.type === 'textarea' && (
            <textarea
              className="input min-h-[100px] font-mono text-xs"
              placeholder={'placeholder' in f ? f.placeholder : undefined}
              value={state[f.key]}
              onChange={(e) => setState((s) => ({ ...s, [f.key]: e.target.value }))}
            />
          )}

          {f.type === 'color' && (
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={state[f.key] || '#D97757'}
                onChange={(e) => setState((s) => ({ ...s, [f.key]: e.target.value }))}
                className="w-12 h-10 border-2 border-foam rounded-md cursor-pointer bg-white"
              />
              <span className="font-mono text-sm text-seafoam">{state[f.key]}</span>
            </div>
          )}

          {f.type === 'checkbox' && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={state[f.key] === 'true'}
                onChange={(e) => setState((s) => ({ ...s, [f.key]: String(e.target.checked) }))}
                className="accent-lure w-4 h-4"
              />
              {f.label}
            </label>
          )}

          {f.help && <p className="text-xs text-seafoam/70 mt-1">{f.help}</p>}
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
        {saved && <span className="text-lure text-sm">Tersimpan.</span>}
      </div>
    </form>
  );
}
