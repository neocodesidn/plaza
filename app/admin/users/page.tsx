import { createClient } from '@/lib/supabase/server';
import UserRowActions from '@/components/admin/UserRowActions';

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: allUsers } = await supabase.from('users').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl mb-1">User</h1>
      <p className="text-seafoam text-sm mb-5">Kelola akses user — mute buat batasin chat, ban buat blokir total.</p>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="border-b border-depth3 text-seafoam text-left">
              <th className="p-3 font-normal">Username</th>
              <th className="p-3 font-normal">Role</th>
              <th className="p-3 font-normal">Status</th>
              <th className="p-3 font-normal">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {allUsers?.map((u: any) => (
              <tr key={u.id} className="border-b border-depth3 last:border-0">
                <td className="p-3">{u.username}</td>
                <td className="p-3 text-seafoam">{u.role}</td>
                <td className="p-3">
                  <span className={`tag-rarity ${u.status === 'active' ? 'border-lure text-lure' : 'border-danger text-danger'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3">
                  {u.role !== 'admin' && <UserRowActions userId={u.id} status={u.status} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
