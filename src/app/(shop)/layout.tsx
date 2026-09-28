import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { currentUser } from '@/lib/session';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2">
        Skip to main content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      {/* room for the fixed mobile tab bar */}
      <div aria-hidden className="h-[calc(58px+env(safe-area-inset-bottom))] bg-nav md:hidden" />
      <MobileTabBar signedIn={!!user} />
    </>
  );
}
