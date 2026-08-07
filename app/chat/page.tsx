import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GlobalChat from '@/components/GlobalChat';

export default async function ChatPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('users').select('status, role').eq('id', user.id).single();

  const { data: messages } = await supabase
    .from('global_messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(200);

  const senderIds = Array.from(new Set((messages ?? []).map((m) => m.sender_id)));
  const { data: senders } = senderIds.length
    ? await supabase.from('users').select('id, username').in('id', senderIds)
    : { data: [] as any[] };

  const usernames: Record<string, string> = {};
  senders?.forEach((s) => { usernames[s.id] = s.username; });

  return (
    <div className="pt-8 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4">Global Chat</h1>
      <GlobalChat
        myId={user.id}
        myStatus={profile?.status ?? 'active'}
        isAdmin={profile?.role === 'admin'}
        initialMessages={messages ?? []}
        usernames={usernames}
      />
    </div>
  );
}
