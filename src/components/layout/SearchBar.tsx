'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

type Cat = { slug: string; label: string; thumb?: string };
type Suggestion = { id: number; title: string; category: string; thumbnail: string; price: number };

const TRENDING = ['iPhone', 'Laptop', 'Perfume', 'Watch', 'Sunglasses', 'Sofa', 'Mascara', 'Headphones'];

/** Bold the parts of `text` that match any search term. */
function Highlight({ text, q }: { text: string; q: string }) {
  const terms = q.trim().split(/\s+/).filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!terms.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${terms.join('|')})`, 'ig'));
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <mark key={i} className="bg-transparent font-extrabold text-brand">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function DeptPicker({ categories, value, onChange, onOpen }: { categories: Cat[]; value: string; onChange: (slug: string) => void; onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const all: Cat[] = [{ slug: '', label: 'All departments' }, ...categories];
  const current = categories.find(c => c.slug === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', onDown);
    // focus the selected option when opening
    requestAnimationFrame(() => ref.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus());
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      ref.current?.querySelector<HTMLButtonElement>('button')?.focus();
      return;
    }
    const opts = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [])];
    const i = opts.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    const cols = window.innerWidth >= 1024 ? 3 : 2;
    const move = { ArrowDown: cols, ArrowUp: -cols, ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (move) {
      e.preventDefault();
      opts[Math.max(0, Math.min(opts.length - 1, i + move))]?.focus();
    }
  };

  return (
    <div ref={ref} className="relative hidden shrink-0 sm:block" onKeyDown={onKeyDown}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Search in: ${current?.label ?? 'All departments'}`}
        onClick={() => {
          if (!open) onOpen();
          setOpen(o => !o);
        }}
        className={`flex h-full items-center gap-1.5 rounded-l-full border-r border-line pr-3 pl-4 text-xs font-bold transition-colors ${open ? 'bg-brand-50 text-brand-700' : 'bg-[#f3f4f8] text-[#334155] hover:bg-[#e9ebf2]'}`}
      >
        {current?.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.thumb} alt="" className="h-5 w-5 object-contain mix-blend-multiply" />
        ) : (
          <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" strokeLinejoin="round" />
          </svg>
        )}
        <span className="max-w-24 truncate">{current?.label ?? 'All'}</span>
        <svg aria-hidden viewBox="0 0 24 24" className={`h-3.5 w-3.5 fill-none stroke-current stroke-[2.5] transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          id={panelId}
          role="listbox"
          aria-label="Departments"
          className="absolute top-[calc(100%+10px)] left-0 z-[60] w-[min(640px,calc(100vw-2rem))] origin-top-left animate-[pop-in_.18s_ease-out] rounded-3xl bg-white p-3 text-ink shadow-[var(--shadow-lift)] ring-1 ring-black/5"
        >
          <p className="px-2 pt-1 pb-2 text-[11px] font-bold tracking-wider text-muted uppercase">Search in</p>
          <div className="grid max-h-[min(420px,60vh)] grid-cols-2 gap-1.5 overflow-y-auto pr-1 lg:grid-cols-3">
            {all.map(c => {
              const on = c.slug === value;
              return (
                <button
                  key={c.slug || 'all'}
                  type="button"
                  role="option"
                  aria-selected={on}
                  onClick={() => {
                    onChange(c.slug);
                    setOpen(false);
                  }}
                  className={`group flex items-center gap-2.5 rounded-2xl p-2 text-left text-sm font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-brand ${on ? 'bg-brand text-white' : 'hover:bg-brand-50 focus-visible:bg-brand-50'}`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${on ? 'bg-white/20' : 'bg-[#f3f4f8]'}`}>
                    {c.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.thumb} alt="" className={`h-7 w-7 object-contain transition group-hover:scale-110 ${on ? '' : 'mix-blend-multiply'}`} />
                    ) : (
                      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                        <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1 truncate">{c.label}</span>
                  {on && <span aria-hidden>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function SearchBar({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [cat, setCat] = useState(params.get('category') ?? '');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const boxRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the box in sync when navigating between result pages.
  useEffect(() => {
    setQ(params.get('q') ?? '');
    setCat(params.get('category') ?? '');
  }, [params]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      const sp = new URLSearchParams({ q: term });
      if (cat) sp.set('category', cat);
      fetch(`/api/suggest?${sp}`, { signal: ctrl.signal })
        .then(r => r.json())
        .then((d: Suggestion[]) => {
          setSuggestions(d);
          setActive(-1);
        })
        .catch(() => {});
    }, 120);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, cat]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function go(term: string) {
    const sp = new URLSearchParams();
    if (term.trim()) sp.set('q', term.trim());
    if (cat) sp.set('category', cat);
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/s?${sp.toString()}`);
  }

  const term = q.trim();
  const catLabel = categories.find(c => c.slug === cat)?.label;
  const showSuggestions = open && term.length >= 2;
  const showTrending = open && term.length < 2;
  // option 0 = "search for <term>", 1..n = products
  const optionCount = showSuggestions ? suggestions.length + 1 : 0;

  return (
    <form
      ref={boxRef}
      role="search"
      className="relative flex h-11 w-full rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.2)] transition focus-within:ring-4 focus-within:ring-brand/40"
      onSubmit={e => {
        e.preventDefault();
        if (active > 0) {
          setOpen(false);
          router.push(`/dp/${suggestions[active - 1].id}`);
        } else go(q);
      }}
    >
      <DeptPicker categories={categories} value={cat} onChange={setCat} onOpen={() => setOpen(false)} />
      <input
        ref={inputRef}
        value={q}
        onChange={e => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={e => {
          if (e.key === 'Escape') return setOpen(false);
          if (!optionCount) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive(a => Math.min(a + 1, optionCount - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive(a => Math.max(a - 1, -1));
          }
        }}
        placeholder={catLabel ? `Search in ${catLabel}` : 'Search products, brands and more'}
        aria-label="Search Shopora"
        role="combobox"
        aria-expanded={showSuggestions || showTrending}
        aria-controls={listId}
        aria-autocomplete="list"
        className="min-w-0 flex-1 rounded-l-full bg-transparent px-4 text-[15px] text-ink outline-none placeholder:text-[#94a3b8] sm:rounded-none sm:px-3"
      />
      {q && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setQ('');
            inputRef.current?.focus();
          }}
          className="my-auto mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-[#f1f3f8] hover:text-ink"
        >
          ×
        </button>
      )}
      <button type="submit" aria-label="Search" className="m-1 flex w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#7c5cff] transition hover:brightness-110 active:scale-95 sm:w-14">
        <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-white stroke-[2.5]">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" strokeLinecap="round" />
        </svg>
      </button>

      {(showSuggestions || showTrending) && (
        <div className="absolute top-[calc(100%+10px)] right-0 left-0 z-50 origin-top animate-[pop-in_.16s_ease-out] overflow-hidden rounded-3xl bg-white text-ink shadow-[var(--shadow-lift)] ring-1 ring-black/5">
          {showTrending ? (
            <div className="p-4">
              <p className="mb-2.5 text-[11px] font-bold tracking-wider text-muted uppercase">Trending searches</p>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map(t => (
                  <button
                    key={t}
                    type="button"
                    onMouseDown={e => {
                      e.preventDefault();
                      setQ(t);
                      go(t);
                    }}
                    className="chip"
                  >
                    <span aria-hidden className="text-coral">↗</span>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul id={listId} role="listbox" className="py-2">
              <li
                role="option"
                aria-selected={active === 0}
                onMouseDown={e => {
                  e.preventDefault();
                  go(q);
                }}
                onMouseEnter={() => setActive(0)}
                className={`mx-2 flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm ${active === 0 ? 'bg-brand-50' : ''}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2.5]">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="m15.5 15.5 5 5" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1 truncate">
                  Search for <b>&ldquo;{term}&rdquo;</b>
                  {catLabel && <span className="text-muted"> in {catLabel}</span>}
                </span>
                <kbd className="hidden rounded-md bg-[#f1f3f8] px-1.5 py-0.5 text-[11px] text-muted sm:block">Enter</kbd>
              </li>
              {suggestions.length > 0 && <li aria-hidden className="mx-5 my-1.5 border-t border-line" />}
              {suggestions.map((s, i) => (
                <li
                  key={s.id}
                  role="option"
                  aria-selected={active === i + 1}
                  onMouseDown={e => {
                    e.preventDefault();
                    setOpen(false);
                    router.push(`/dp/${s.id}`);
                  }}
                  onMouseEnter={() => setActive(i + 1)}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={`mx-2 flex animate-[fade-up_.25s_ease-out_both] cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 text-sm ${active === i + 1 ? 'bg-brand-50' : ''}`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f4f8]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.thumbnail} alt="" className="h-8 w-8 object-contain mix-blend-multiply" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">
                      <Highlight text={s.title} q={term} />
                    </span>
                    <span className="block text-xs text-muted">in {s.category}</span>
                  </span>
                  <b className="shrink-0 text-sm">${s.price.toFixed(2)}</b>
                </li>
              ))}
              {suggestions.length === 0 && <li className="px-5 py-3 text-sm text-muted">No product matches yet. Press Enter to search anyway.</li>}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
