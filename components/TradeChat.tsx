'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Msg = { id: string; sender_id: string; message: string; created_at: string };

export default function TradeChat({
  tradeId,
  myId,
  initialMessages,
  usernames,
}: {
  tradeId: string;
  myId: string;
  initialMessages: Msg[];
  usernames: Record<string, string>;
}) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`trade-${tradeId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'trade_messages', filter: `trade_id=eq.${tradeId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Msg])
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tradeId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const body = text;
    setText('');
    await supabase.from('trade_messages').insert({ trade_id: tradeId, sender_id: myId, message: body });
  }

  return (
    <div className="card flex flex-col h-[420px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[80%] ${m.sender_id === myId ? 'ml-auto text-right' : ''}`}>
            <div className={`inline-block px-3 py-2 rounded-xl text-sm ${m.sender_id === myId ? 'bg-lure text-deep' : 'bg-deep border border-depth3 text-foam'}`}>
              {m.message}
            </div>
            <div className="text-[10px] text-seafoam/50 mt-0.5 font-mono">{usernames[m.sender_id] ?? '...'}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="border-t border-depth3 p-3 flex gap-2">
        <input className="input" placeholder="Ketik pesan..." value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn-primary !py-2">Kirim</button>
      </form>
    </div>
  );
}
