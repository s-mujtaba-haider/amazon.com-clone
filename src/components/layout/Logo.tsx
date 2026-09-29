/**
 * Kyro mark: a gradient tile holding a "K" whose upper arm shoots off into a spark, plus the wordmark.
 * The gradient is a CSS background (not an SVG <linearGradient>) so repeated logos never clash on ids.
 * Hovering the logo spins the spark and tilts the tile.
 */
export function Logo({ dark = false, className = '', compact = false }: { dark?: boolean; className?: string; compact?: boolean }) {
  return (
    <span className={`group/logo inline-flex items-center gap-2 font-extrabold tracking-tight ${className}`} aria-label="Kyro">
      <span
        aria-hidden
        className="relative inline-flex h-[1.4em] w-[1.4em] shrink-0 items-center justify-center rounded-[30%] bg-[linear-gradient(135deg,#7c5cff_0%,#b24dff_50%,#ff6b3d_100%)] shadow-[0_6px_18px_-6px_rgba(124,92,255,.8)] transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover/logo:-rotate-6 group-hover/logo:scale-110"
      >
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <path d="M14 11v18" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M26.5 29 18.2 20.2l6.3-6.6" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
          <path
            className="origin-[29px_10px] transition-transform duration-700 ease-[cubic-bezier(.34,1.56,.64,1)] [transform-box:view-box] group-hover/logo:rotate-180 group-hover/logo:scale-125"
            d="M29 5.5c.5 2.6 1.9 4 4.5 4.5-2.6.5-4 1.9-4.5 4.5-.5-2.6-1.9-4-4.5-4.5 2.6-.5 4-1.9 4.5-4.5Z"
            fill="#ffd166"
          />
        </svg>
      </span>
      {!compact && (
        <span className={`leading-none ${dark ? 'text-ink' : 'text-white'}`}>
          kyr<span className="bg-gradient-to-r from-[#9b85ff] to-coral bg-clip-text text-transparent">o</span>
          <span className="text-coral">.</span>
        </span>
      )}
    </span>
  );
}
