'use client';

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="block w-full bg-ink-2 py-3.5 text-center text-sm font-semibold text-white/80 transition hover:bg-ink-3 hover:text-white"
    >
      ↑ Back to top
    </button>
  );
}
