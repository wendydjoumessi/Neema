import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Send, ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FALLBACK, KB, SUGGEST } from '../data';
import { findDangerSign } from '../safety';
import { useNeema } from '../store';
import { Disclaimer, Pill, SosPill } from '../ui';

export function AskTab({ week }: { week: number }) {
  const s = useNeema();
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, 'up' | 'down' | 'report' | ''>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [s.messages.length, typing]);

  const send = (raw?: string) => {
    const text = (raw ?? draft).trim();
    if (!text || typing) return;
    const id = Date.now();
    setDraft('');
    const danger = findDangerSign(text);
    if (danger) {
      s.setMessages((m) => [
        ...m,
        { id, role: 'user', text },
        { id: id + 1, role: 'alert', text: `You mentioned ${danger}. This is something a midwife should check soon, so I’ll show you the next steps instead of a chat answer.` },
      ]);
      s.openSymptom('chat', danger);
      return;
    }
    // TODO: replace this keyword lookup with the Ask Neema back end (retrieval over the approved content library).
    const low = text.toLowerCase();
    const kb = KB.find((k) => k.keys.some((w) => low.includes(w)));
    const ans = kb ?? FALLBACK;
    s.setMessages((m) => [...m, { id, role: 'user', text }]);
    setTyping(true);
    timer.current = window.setTimeout(() => {
      setTyping(false);
      s.setMessages((m) => [...m, { id: id + 1, role: 'ai', text: ans.text, sources: ans.sources }]);
    }, 900);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  };

  const toggleFb = (id: number, v: 'up' | 'down' | 'report') => setFeedback((f) => ({ ...f, [id]: f[id] === v ? '' : v }));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 [&>*]:shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold leading-8">Ask Neema</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Pill className="bg-neema-lilac text-neema-ink">Neema AI — not a doctor or midwife</Pill>
            <span className="text-[13px] font-medium leading-[18px] text-neema-muted-strong">English · Français</span>
          </div>
          <p className="mt-1 text-neema-muted-strong">
            Answers come only from Neema’s clinician-approved library, WHO guidance and Cameroon MINSANTE guidelines. Neema never diagnoses or prescribes.
          </p>
        </div>

        {s.messages.map((m) => {
          if (m.role === 'user') {
            return <div key={m.id} className="max-w-[82%] self-end rounded-2xl rounded-br-sm bg-neema-dark px-3.5 py-2.5 text-white">{m.text}</div>;
          }
          if (m.role === 'alert') {
            return (
              <div key={m.id} role="status" className="flex flex-col gap-2.5 self-stretch rounded-2xl bg-white p-3.5 shadow-neema-card">
                <div className="text-[13px] font-semibold leading-[18px] text-neema-dark">NEEMA AI</div>
                <div className="font-semibold">Thank you for telling me. You did the right thing.</div>
                <div>{m.text}</div>
                <button type="button" onClick={() => s.openSymptom('chat', s.dangerWord)} className="min-h-[52px] rounded-xl bg-neema-dark font-semibold text-white">
                  See what to do now
                </button>
                <Disclaimer />
              </div>
            );
          }
          const f = feedback[m.id] || '';
          return (
            <div key={m.id} className="flex max-w-[92%] flex-col gap-2.5 self-start rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow-neema-card">
              <div className="text-[13px] font-semibold leading-[18px] text-neema-dark">NEEMA AI</div>
              <div>{m.text}</div>
              <Disclaimer />
              {m.sources && m.sources.length > 0 && (
                <div className="flex flex-col gap-1.5 border-t border-neema-line pt-2">
                  <div className="text-[13px] font-semibold leading-[18px] text-neema-muted">SOURCES</div>
                  {m.sources.map((src, i) => (
                    <div key={src} className="flex items-start gap-2 text-[13px] font-medium leading-[18px]">
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-neema-ochre-soft text-xs font-bold text-neema-ochre-ink">{i + 1}</span>
                      <span>{src}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="-mx-2 -mb-1.5 flex items-center gap-1">
                <button type="button" aria-label="Helpful" aria-pressed={f === 'up'} onClick={() => toggleFb(m.id, 'up')} className={cn('flex h-12 w-12 items-center justify-center rounded-xl', f === 'up' ? 'text-neema-success' : 'text-neema-muted')}>
                  <ThumbsUp className="h-5 w-5" />
                </button>
                <button type="button" aria-label="Not helpful" aria-pressed={f === 'down'} onClick={() => toggleFb(m.id, 'down')} className={cn('flex h-12 w-12 items-center justify-center rounded-xl', f === 'down' ? 'text-neema-dark' : 'text-neema-muted')}>
                  <ThumbsDown className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => toggleFb(m.id, 'report')} className="flex min-h-[48px] items-center gap-1.5 px-2 text-[13px] font-semibold text-neema-muted">
                  <Flag className="h-[18px] w-[18px]" />
                  {f === 'report' ? 'Reported to clinical team' : 'Report a harmful answer'}
                </button>
              </div>
            </div>
          );
        })}
        {s.messages.length === 0 && (
          <p className="rounded-2xl border-2 border-dashed border-neema-border p-4 text-center text-neema-muted-strong">
            Ask anything about week {week}, food, rest or your next visit. Try a suggestion below.
          </p>
        )}
        {typing && <div className="self-start rounded-2xl bg-white px-3.5 py-2.5 text-neema-muted shadow-sm">Neema is finding an approved answer…</div>}
      </div>

      <div className="flex flex-none flex-col gap-2 border-t border-neema-line bg-neema-cream px-4 pb-3 pt-2">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
          {SUGGEST.map((q) => (
            <button key={q} type="button" onClick={() => send(q)} className="min-h-[44px] flex-none whitespace-nowrap rounded-full border border-[#E3C9BE] bg-white px-3.5 text-sm font-medium">
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-white px-2.5 py-2">
          <span className="flex-1 text-[13px] font-medium leading-[18px]">Not monitored for emergencies. Bleeding, severe headache, fits or trouble breathing? Use SOS now.</span>
          <SosPill onClick={() => s.openSos()} className="h-11 min-w-[56px]" />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="neema-ask" className="sr-only">Ask Neema a question</label>
          <input
            id="neema-ask"
            type="text"
            placeholder="Ask a question…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            className="h-[52px] min-w-0 flex-1 rounded-[14px] border border-neema-border bg-white px-3.5 text-base text-neema-ink outline-none focus-visible:ring-2 focus-visible:ring-neema-ochre"
          />
          <button type="button" aria-label="Send" onClick={() => send()} className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[14px] bg-neema-dark text-white">
            <Send className="h-[22px] w-[22px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
