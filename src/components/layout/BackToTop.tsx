'use client';

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="block w-full bg-nav-3 py-4 text-center text-sm hover:bg-[#485769]"
    >
      Back to top
    </button>
  );
}
