import { createClient } from '@/lib/supabase/server';
import DeleteItemButton from '@/components/admin/DeleteItemButton';

export default async function AdminItemsPage() {
  const supabase = createClient();
  const { data: allItems } = await supabase
    .from('items')
    .select('*, owner:owner_id(username)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl mb-1">Item</h1>
      <p className="text-seafoam text-sm mb-5">Semua item yang diupload user. Hapus kalau ada yang spam/scam.</p>

      {allItems && allItems.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[620px]">
            <thead>
              <tr className="border-b-2 border-foam text-seafoam text-left">
                <th className="p-3 font-normal">Item</th>
                <th className="p-3 font-normal">Pemilik</th>
                <th className="p-3 font-normal">Rarity</th>
                <th className="p-3 font-normal">RAP</th>
                <th className="p-3 font-normal">Status</th>
                <th className="p-3 font-normal">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allItems.map((it: any) => (
                <tr key={it.id} className="border-b border-depth3 last:border-0">
                  <td className="p-3">{it.name}</td>
                  <td className="p-3 text-seafoam">{it.owner?.username}</td>
                  <td className="p-3 text-seafoam">{it.rarity}</td>
                  <td className="p-3 text-seafoam font-mono text-xs">{it.rap ? it.rap.toLocaleString('id-ID') : '—'}</td>
                  <td className="p-3">
                    <span className="tag-rarity border-lure text-lure">{it.status}</span>
                  </td>
                  <td className="p-3"><DeleteItemButton itemId={it.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-seafoam text-sm">Belum ada item.</p>
      )}
    </div>
  );
}
