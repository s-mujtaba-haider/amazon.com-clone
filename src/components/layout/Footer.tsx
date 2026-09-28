import Link from 'next/link';
import { Logo } from './Logo';
import { BackToTop } from './BackToTop';

const COLS = [
  { title: 'Shop', links: [['Today’s Deals', '/s?deals=1&sort=discount'], ['Best Sellers', '/s?sort=rating'], ['Electronics', '/s?category=smartphones'], ['Home & Kitchen', '/s?category=kitchen-accessories'], ['Fashion', '/s?category=womens-dresses']] },
  { title: 'Your account', links: [['Sign in', '/signin'], ['Create account', '/register'], ['Your orders', '/orders'], ['Wishlist', '/wishlist'], ['Cart', '/cart']] },
  { title: 'Help', links: [['Shipping & delivery', '/'], ['Returns & refunds', '/orders'], ['Payment options', '/'], ['Contact us', '/']] },
  { title: 'Company', links: [['About Shopora', '/'], ['Careers', '/'], ['Sustainability', '/'], ['Press', '/']] },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <BackToTop />
      <div className="gutter grid gap-10 py-12 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo className="text-2xl" />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Everything you love, delivered fast. Real reviews, easy returns and a checkout that takes seconds.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 text-xs text-white/70">
            {['Free delivery $35+', '30-day returns', 'Secure checkout'].map(t => (
              <li key={t} className="rounded-full bg-white/[.07] px-3 py-1.5 ring-1 ring-white/10">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLS.map(col => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-bold">{col.title}</h3>
              <ul className="space-y-2.5 text-sm text-white/60">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="gutter flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Shopora · A portfolio demo, not affiliated with any real retailer. No real payments are taken.</p>
          <p>Product data &amp; images: DummyJSON</p>
        </div>
      </div>
    </footer>
  );
}
