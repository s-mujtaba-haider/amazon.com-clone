'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

type Cat = { slug: string; label: string };
type Suggestion = { id: number; title: string; category: string };

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
      fetch(`/api/suggest?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
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
  }, [q]);

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
    router.push(`/s?${sp.toString()}`);
  }

  const catLabel = categories.find(c => c.slug === cat)?.label ?? 'All';
  const showList = open && suggestions.length > 0;

  return (
    <form
      ref={boxRef}
      role="search"
      className="relative flex h-11 w-full rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.2)] transition focus-within:ring-4 focus-within:ring-brand/40"
      onSubmit={e => {
        e.preventDefault();
        go(active >= 0 ? suggestions[active].title : q);
      }}
    >
      <label className="relative hidden shrink-0 cursor-pointer items-center rounded-l-full border-r border-line bg-[#f3f4f8] pr-2.5 pl-4 text-xs font-semibold text-[#334155] hover:bg-[#e9ebf2] sm:flex">
        <span className="max-w-24 truncate">{catLabel}</span>
        <svg aria-hidden viewBox="0 0 10 6" className="ml-1 h-1.5 w-2.5 fill-current">
          <path d="M0 0h10L5 6z" />
        </svg>
        <select
          aria-label="Search in"
          value={cat}
          onChange={e => setCat(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        >
          <option value="">All Departments</option>
          {categories.map(c => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <input
        value={q}
        onChange={e => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={e => {
          if (!showList) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive(a => Math.min(a + 1, suggestions.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive(a => Math.max(a - 1, -1));
          } else if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
        placeholder="Search products, brands and more"
        aria-label="Search Shopora"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        className="min-w-0 flex-1 rounded-l-full bg-transparent px-4 text-[15px] text-ink outline-none placeholder:text-[#94a3b8] sm:rounded-none sm:px-3"
      />
      <button type="submit" aria-label="Go" className="m-1 flex w-12 shrink-0 items-center justify-center rounded-full bg-brand transition hover:bg-brand-600 sm:w-14">
        <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-white stroke-[2.5]">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" strokeLinecap="round" />
        </svg>
      </button>

      {showList && (
        <ul id={listId} role="listbox" className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white py-2 text-ink shadow-[var(--shadow-lift)]">
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === active}
              onMouseDown={e => {
                e.preventDefault();
                setQ(s.title);
                setOpen(false);
                router.push(`/dp/${s.id}`);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-2.5 px-4 py-2 text-sm ${i === active ? 'bg-brand-50' : ''}`}
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-none stroke-muted stroke-2">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m15.5 15.5 5 5" />
              </svg>
              <span className="truncate font-semibold">{s.title}</span>
              <span className="ml-auto shrink-0 rounded-full bg-[#f1f3f8] px-2 py-0.5 text-[11px] text-muted">{s.category}</span>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
