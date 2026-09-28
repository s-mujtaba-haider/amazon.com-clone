/** Original Shopora mark (gradient bag tile) + wordmark. Not a copy of any real brand. */
export function Logo({ dark = false, className = '', compact = false }: { dark?: boolean; className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${className}`} aria-label="Shopora">
      <svg aria-hidden viewBox="0 0 40 40" className="h-[1.35em] w-[1.35em] shrink-0">
        <defs>
          <linearGradient id="shopora-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7c5cff" />
            <stop offset="1" stopColor="#ff6b3d" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#shopora-mark)" />
        <path d="M12 15h16l-1.4 15.2a2 2 0 0 1-2 1.8h-9.2a2 2 0 0 1-2-1.8z" fill="#fff" />
        <path d="M15.5 17v-3a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="20" cy="23.5" r="2.2" fill="#5b3df5" />
      </svg>
      {!compact && (
        <span className={dark ? 'text-ink' : 'text-white'}>
          shop<span className="bg-gradient-to-r from-[#9b85ff] to-coral bg-clip-text text-transparent">ora</span>
        </span>
      )}
    </span>
  );
}
