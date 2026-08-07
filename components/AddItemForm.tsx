'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'secret'];
const CATEGORIES = ['fish', 'rod', 'bait', 'skin', 'other'];

export default function AddItemForm({ userId }: { userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('fish');
  const [rarity, setRarity] = useState('common');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    let image_url: string | null = null;
    if (file) {
      const path = `${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('item-images').upload(path, file);
      if (uploadError) {
        setError('Upload gambar gagal: ' + uploadError.message);
        setLoading(false);
        return;
      }
      image_url = supabase.storage.from('item-images').getPublicUrl(path).data.publicUrl;
    }

    const { error: insertError } = await supabase.from('items').insert({
      owner_id: userId,
      name,
      category,
      rarity,
      image_url,
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setName('');
    setFile(null);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        + Tambah Item
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-3 max-w-md">
      <input className="input" placeholder="Nama item (mis. Shark)" value={name} onChange={(e) => setName(e.target.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={rarity} onChange={(e) => setRarity(e.target.value)}>
          {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      {error && <p className="text-danger text-sm">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Batal</button>
      </div>
    </form>
  );
}
