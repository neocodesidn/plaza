import { createClient } from '@/lib/supabase/server';
import ReportActions from '@/components/admin/ReportActions';

export default async function AdminReportsPage() {
  const supabase = createClient();
  const { data: reports } = await supabase
    .from('reports')
    .select('*, reporter:reporter_id(username), reported:reported_user_id(username)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl mb-1">Laporan</h1>
      <p className="text-seafoam text-sm mb-5">Laporan yang masuk dari user soal trade yang mencurigakan.</p>

      {reports && reports.length > 0 ? (
        <div className="space-y-2">
          {reports.map((r: any) => (
            <div key={r.id} className={`card p-4 ${r.status === 'open' ? 'border-danger/40' : 'opacity-60'}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <span className="text-foam">{r.reporter?.username}</span> melaporkan{' '}
                  <span className="text-foam">{r.reported?.username}</span>
                </p>
                <span className="tag-rarity border-depth3 text-seafoam">{r.status}</span>
              </div>
              <p className="text-seafoam text-sm mt-1">{r.reason}</p>
              {r.status === 'open' && <ReportActions reportId={r.id} />}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-seafoam text-sm">Belum ada laporan.</p>
      )}
    </div>
  );
}
