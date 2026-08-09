'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'secret'];
const CATEGORIES = ['fish', 'rod', 'bait', 'skin', 'other'];

export default function AddItemForm({ userId }: { userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('fish');
  const [rarity, setRarity] = useState('common');
  const [rap, setRap] = useState('');
  const [listingType, setListingType] = useState<'trade' | 'sell'>('trade');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function selectFile(f: File | null) {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (listingType === 'sell' && (!price || Number(price) <= 0)) {
      setError('Isi harga jualnya dulu.');
      setLoading(false);
      return;
    }

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
      rap: rap ? parseInt(rap, 10) : 0,
      listing_type: listingType,
      price: listingType === 'sell' ? Number(price) : null,
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setName('');
    setRap('');
    setPrice('');
    setListingType('trade');
    selectFile(null);
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

      <div>
        <label className="text-sm text-seafoam block mb-1">RAP (Recent Average Price, opsional)</label>
        <input className="input" type="number" min={0} placeholder="mis. 15000" value={rap} onChange={(e) => setRap(e.target.value)} />
      </div>

      <div>
        <label className="text-sm text-seafoam block mb-1">Mau ditrade atau dijual?</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setListingType('trade')}
            className={`px-3 py-2 rounded-md text-sm border-2 border-foam transition ${listingType === 'trade' ? 'bg-lure text-white' : 'bg-white text-seafoam'}`}
          >
            Trade (barter)
          </button>
          <button
            type="button"
            onClick={() => setListingType('sell')}
            className={`px-3 py-2 rounded-md text-sm border-2 border-foam transition ${listingType === 'sell' ? 'bg-lure text-white' : 'bg-white text-seafoam'}`}
          >
            Jual
          </button>
        </div>
      </div>

      {listingType === 'sell' && (
        <div>
          <label className="text-sm text-seafoam block mb-1">Harga jual</label>
          <input className="input" type="number" min={1} placeholder="mis. 25000" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      )}

      {/* Drag & drop image uploader */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) selectFile(dropped);
        }}
        className={`cursor-pointer rounded-md border-2 border-dashed p-4 text-center transition ${
          dragActive ? 'border-lure bg-lure/5' : 'border-foam/40 hover:border-foam'
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className="mx-auto max-h-32 rounded-md border-2 border-foam" />
        ) : (
          <p className="text-seafoam text-sm">Klik buat pilih gambar, atau drag &amp; drop di sini</p>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => selectFile(e.target.files?.[0] ?? null)} />
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Batal</button>
      </div>
    </form>
  );
}
