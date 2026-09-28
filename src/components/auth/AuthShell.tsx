import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { getProducts } from '@/lib/products';

const PERKS = ['Track every order in one place', 'Save favourites to your wishlist', 'Reorder in a single tap', 'Checkout in seconds'];

/** Split-screen frame for sign in / sign up: brand panel on large screens, form on the right. */
export function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  const showcase = getProducts([124, 78, 190, 8]);
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-ink via-ink-3 to-brand-700 p-10 text-white lg:flex lg:flex-col xl:p-14">
        <span aria-hidden className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand/40 blur-3xl" />
        <span aria-hidden className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-coral/25 blur-3xl" />
        <Link href="/" className="relative w-fit text-3xl">
          <Logo />
        </Link>
        <div className="relative my-auto max-w-lg">
          <h2 className="text-4xl leading-tight font-extrabold tracking-tight xl:text-5xl">
            Shopping that feels <span className="bg-gradient-to-r from-[#b9a8ff] to-coral bg-clip-text text-transparent">effortless.</span>
          </h2>
          <ul className="mt-8 space-y-3">
            {PERKS.map(p => (
              <li key={p} className="flex items-center gap-3 text-white/85">
                <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs">✓</span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-10 grid grid-cols-4 gap-3">
            {showcase.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.id}
                src={p.thumbnail}
                alt=""
                className={`aspect-square rounded-2xl bg-white/95 object-contain p-2 shadow-2xl ${i % 2 ? 'translate-y-4' : ''}`}
              />
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/50">Portfolio demo · No real payments are taken.</p>
      </aside>

      <div className="flex flex-col px-4 py-6 sm:px-8">
        <Link href="/" className="mx-auto mb-6 text-3xl lg:hidden">
          <Logo dark />
        </Link>
        <div className="m-auto w-full max-w-[420px]">
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-1.5 mb-6 text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
