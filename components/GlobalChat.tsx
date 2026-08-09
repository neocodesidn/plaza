'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Msg = { id: string; sender_id: string; message: string; created_at: string };

export default function GlobalChat({
  myId,
  myStatus,
  isAdmin,
  initialMessages,
  usernames: initialUsernames,
}: {
  myId: string;
  myStatus: string;
  isAdmin: boolean;
  initialMessages: Msg[];
  usernames: Record<string, string>;
}) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [usernames, setUsernames] = useState<Record<string, string>>(initialUsernames);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel('global-chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'global_messages' },
        async (payload) => {
          const msg = payload.new as Msg;
          if (!usernames[msg.sender_id]) {
            const { data } = await supabase.from('users').select('username').eq('id', msg.sender_id).single();
            if (data) setUsernames((prev) => ({ ...prev, [msg.sender_id]: data.username }));
          }
          setMessages((prev) => [...prev, msg]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'global_messages' },
        (payload) => setMessages((prev) => prev.filter((m) => m.id !== (payload.old as Msg).id))
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const body = text;
    setText('');
    await supabase.from('global_messages').insert({ sender_id: myId, message: body });
  }

  async function removeMessage(id: string) {
    await supabase.from('global_messages').delete().eq('id', id);
  }

  return (
    <div className="card flex flex-col h-[560px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={`group max-w-[85%] ${m.sender_id === myId ? 'ml-auto text-right' : ''}`}>
            <div className="text-[10px] text-seafoam/50 font-mono">{usernames[m.sender_id] ?? '...'}</div>
            <div className="flex items-center gap-2">
              <div className={`inline-block px-3 py-2 rounded-xl text-sm ${m.sender_id === myId ? 'bg-lure text-white ml-auto' : 'bg-deep border border-depth3 text-foam'}`}>
                {m.message}
              </div>
              {isAdmin && (
                <button onClick={() => removeMessage(m.id)} className="text-danger text-xs opacity-0 group-hover:opacity-100 transition">
                  hapus
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="border-t border-depth3 p-3 flex gap-2">
        {myStatus === 'active' ? (
          <>
            <input className="input" placeholder="Ketik pesan ke semua orang..." value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn-primary !py-2">Kirim</button>
          </>
        ) : (
          <p className="text-danger text-sm">Akun lo sedang {myStatus === 'muted' ? 'dimute' : 'dibanned'}, gak bisa chat.</p>
        )}
      </form>
    </div>
  );
}
