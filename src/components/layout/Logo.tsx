/** Original wordmark (not a copy of any real brand's logo). */
export function Logo({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-baseline font-extrabold tracking-tight ${className}`} aria-label="Shopora">
      <span className={dark ? 'text-[#0f1111]' : 'text-white'}>shop</span>
      <span className="text-accent">ora</span>
      <span className={`ml-0.5 text-[0.55em] font-semibold ${dark ? 'text-muted' : 'text-gray-300'}`}>.shop</span>
    </span>
  );
}
