/** Shown while a shop page streams in: the same skeleton shimmer used by cart and wishlist. */
export default function Loading() {
  return (
    <div className="gutter py-6 sm:py-8" aria-busy="true" aria-label="Loading">
      <div className="skeleton mb-2 h-4 w-40 rounded-lg" />
      <div className="skeleton mb-6 h-9 w-72 max-w-full rounded-xl" />
      <div className="product-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)]">
            <div className="skeleton aspect-square" />
            <div className="space-y-2 p-4">
              <div className="skeleton h-3 w-1/3 rounded" />
              <div className="skeleton h-4 w-4/5 rounded" />
              <div className="skeleton h-6 w-1/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
