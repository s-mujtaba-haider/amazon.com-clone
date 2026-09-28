import Link from 'next/link';
import { Logo } from './Logo';
import { BackToTop } from './BackToTop';

const COLS = [
  { title: 'Get to Know Us', links: [['About Shopora', '/'], ['Careers', '/'], ['Sustainability', '/'], ['Press Center', '/']] },
  { title: 'Shop With Us', links: [['Today’s Deals', '/s?deals=1&sort=discount'], ['Best Sellers', '/s?sort=rating'], ['Electronics', '/s?category=smartphones'], ['Home & Kitchen', '/s?category=kitchen-accessories']] },
  { title: 'Payment Products', links: [['Shopora Card', '/'], ['Gift Cards', '/'], ['Shop with Points', '/'], ['Reload Your Balance', '/']] },
  { title: 'Let Us Help You', links: [['Your Account', '/orders'], ['Your Orders', '/orders'], ['Shipping Rates & Policies', '/'], ['Returns & Replacements', '/orders']] },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto text-white">
      <BackToTop />
      <div className="bg-nav-2">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
          {COLS.map(col => (
            <div key={col.title}>
              <h3 className="mb-2 font-bold">{col.title}</h3>
              <ul className="space-y-2 text-sm text-[#ddd]">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-3 border-t border-[#3a4553] py-8">
          <Logo className="text-2xl" />
          <p className="text-xs text-[#ddd]">English · $ USD · United States</p>
        </div>
      </div>
      <div className="bg-nav py-6 text-center text-xs text-[#ddd]">
        <p>
          Shopora is a portfolio demo inspired by large online marketplaces. It is not affiliated with any real retailer. No real payments are taken.
        </p>
        <p className="mt-1">Product data and images: DummyJSON (dummyjson.com).</p>
      </div>
    </footer>
  );
}
