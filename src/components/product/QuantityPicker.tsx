'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * The site's one quantity control (product page and cart): a −/+ stepper whose number flips
 * when it changes, plus a popover grid of every allowed quantity. Arrow keys move through the
 * grid, Enter picks, Esc or a click outside closes.
 * `onRemove` turns the − button into a bin at quantity 1 (used in the cart).
 */
export function QuantityPicker({
  value,
  max,
  onChange,
  onRemove,
  size = 'md',
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(value);
  const [dir, setDir] = useState<1 | -1>(1);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const options = Array.from({ length: max }, (_, i) => i + 1);
  const sm = size === 'sm';

  const set = (n: number) => {
    const next = Math.min(max, Math.max(1, n));
    if (next === value) return;
    setDir(next > value ? 1 : -1);
    onChange(next);
  };

  useEffect(() => {
    if (!open) return;
    setActive(value);
    list.current?.focus();
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open, value]);

  useEffect(() => {
    if (open) list.current?.querySelector(`[data-n="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const close = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) trigger.current?.focus();
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const cols = 5;
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
    if (e.key in moves) {
      e.preventDefault();
      setActive(a => Math.min(max, Math.max(1, a + moves[e.key])));
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      setActive(e.key === 'Home' ? 1 : max);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      set(active);
      close();
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') e.preventDefault();
      close(e.key === 'Escape');
    }
  };

  const removeMode = !!onRemove && value <= 1;
  const step = `flex ${sm ? 'h-8 w-8 text-base' : 'h-9 w-9 text-lg'} items-center justify-center rounded-lg font-bold text-ink transition hover:bg-brand-50 hover:text-brand active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent`;

  const stepper = (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className={`${step} ${removeMode ? 'hover:bg-[#fff1f1] hover:text-deal' : ''}`}
        onClick={() => (removeMode ? onRemove() : set(value - 1))}
        disabled={!removeMode && value <= 1}
        aria-label={removeMode ? 'Remove item' : 'Decrease quantity'}
      >
        {removeMode ? (
          <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          '−'
        )}
      </button>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`Quantity ${value}, choose quantity`}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`flex ${sm ? 'h-8 min-w-[3.5rem]' : 'h-9 min-w-[4.25rem]'} items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-white px-2.5 font-extrabold text-ink shadow-[var(--shadow-soft)] ring-1 transition ${open ? 'ring-brand/50' : 'ring-line hover:ring-brand/30'}`}
      >
        <span key={value} className={`tabular-nums ${dir === 1 ? 'animate-[qty-up_.3s_cubic-bezier(.2,.8,.2,1)]' : 'animate-[qty-down_.3s_cubic-bezier(.2,.8,.2,1)]'}`}>
          {value}
        </span>
        <svg aria-hidden viewBox="0 0 24 24" className={`h-3.5 w-3.5 fill-none stroke-muted stroke-[2.5] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className={step} onClick={() => set(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  );

  return (
    <div ref={root} className={`relative ${sm ? 'inline-block' : 'mt-4'}`}>
      {sm ? (
        <div className="rounded-xl bg-[#f5f6fa] p-0.5 ring-1 ring-line">{stepper}</div>
      ) : (
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-[#fafbfe] p-1.5 pl-3.5 ring-1 ring-line transition focus-within:ring-brand/50">
          <span className="text-sm font-medium text-muted">Quantity</span>
          {stepper}
        </div>
      )}

      {open && (
        <div className={`popover absolute top-[calc(100%+8px)] p-3 ${sm ? 'left-0 w-[17rem] origin-top-left' : 'inset-x-0'}`}>
          <p className="popover-label flex items-center justify-between">
            <span>Choose quantity</span>
            <span>Max {max}</span>
          </p>
          <ul
            ref={list}
            id={`${id}-list`}
            role="listbox"
            tabIndex={-1}
            aria-label="Quantity"
            aria-activedescendant={`${id}-opt-${active}`}
            onKeyDown={onListKey}
            className="grid max-h-56 grid-cols-5 gap-1.5 overflow-y-auto outline-none"
          >
            {options.map((n, i) => (
              <li
                key={n}
                id={`${id}-opt-${n}`}
                data-n={n}
                role="option"
                aria-selected={n === value}
                onPointerEnter={() => setActive(n)}
                onClick={() => {
                  set(n);
                  close();
                }}
                style={{ animationDelay: `${Math.min(i, 14) * 18}ms` }}
                className={`flex h-10 animate-[pop-in_.25s_cubic-bezier(.2,.8,.2,1)_both] cursor-pointer items-center justify-center rounded-xl text-sm font-bold tabular-nums transition-colors ${
                  n === value ? 'bg-brand text-white shadow-[0_6px_14px_-6px_rgba(91,61,245,.7)]' : n === active ? 'bg-brand-50 text-brand-700 ring-1 ring-brand/30' : 'bg-[#f5f6fa] text-ink'
                }`}
              >
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
