'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type SelectOption<T extends string> = { value: T; label: string };

/**
 * The site's one dropdown: a button showing the current choice and a popover listbox.
 * Arrow keys / Home / End move, Enter or Space picks, Esc or a click outside closes,
 * typing a letter jumps to the next option starting with it.
 */
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  align = 'right',
  className = '',
}: {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (v: T) => void;
  align?: 'left' | 'right';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const current = options.find(o => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, options.findIndex(o => o.value === value)));
    list.current?.focus();
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open, options, value]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };
  const pick = (i: number) => {
    onChange(options[i].value);
    close();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    if (e.key === 'ArrowDown') setActive(a => Math.min(last, a + 1));
    else if (e.key === 'ArrowUp') setActive(a => Math.max(0, a - 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(last);
    else if (e.key === 'Enter' || e.key === ' ') pick(active);
    else if (e.key === 'Escape') close();
    else if (e.key === 'Tab') return close(false);
    else if (e.key.length === 1) {
      const k = e.key.toLowerCase();
      const order = [...options.slice(active + 1), ...options.slice(0, active + 1)];
      const hit = order.find(o => o.label.toLowerCase().startsWith(k));
      if (hit) setActive(options.indexOf(hit));
      else return;
    } else return;
    e.preventDefault();
  };

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`flex h-10 w-full items-center gap-1.5 rounded-xl bg-white px-3.5 text-sm shadow-[var(--shadow-soft)] ring-1 transition ${open ? 'ring-brand/50' : 'ring-line hover:ring-brand/30'}`}
      >
        <span className="text-muted">{label}:</span>
        <span className="truncate font-semibold text-ink">{current.label}</span>
        <svg aria-hidden viewBox="0 0 24 24" className={`ml-auto h-4 w-4 shrink-0 fill-none stroke-muted stroke-[2.5] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={onKey}
          className={`popover absolute top-[calc(100%+8px)] min-w-full p-1.5 whitespace-nowrap outline-none ${align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'}`}
        >
          {options.map((o, i) => {
            const on = o.value === value;
            return (
              <li
                key={o.value}
                id={`${id}-${i}`}
                role="option"
                aria-selected={on}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(i)}
                className={`menu-item ${on ? 'menu-item-on' : i === active ? 'bg-brand-50' : ''}`}
              >
                <span className="flex-1">{o.label}</span>
                <svg aria-hidden viewBox="0 0 24 24" className={`h-4 w-4 fill-none stroke-current stroke-[3] ${on ? '' : 'invisible'}`}>
                  <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
