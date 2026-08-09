import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: me } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') redirect('/dashboard');

  const [{ data: confirmedTrades }, { data: openReports }] = await Promise.all([
    supabase.from('trades').select('id').eq('status', 'confirmed'),
    supabase.from('reports').select('id').eq('status', 'open'),
  ]);

  const counts: Record<string, number> = {
    '/admin/trades': confirmedTrades?.length ?? 0,
    '/admin/reports': openReports?.length ?? 0,
  };

  return (
    <div className="pt-8 flex flex-col md:flex-row gap-8">
      <AdminSidebar counts={counts} />
      <div className="flex-1 min-w-0 space-y-8">{children}</div>
    </div>
  );
}
