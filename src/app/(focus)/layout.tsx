import Link from 'next/link';

/** Distraction-free chrome for sign-in, sign-up and checkout. */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="mt-10 border-t border-line bg-gradient-to-b from-[#f7f7f7] to-white py-6 text-center text-xs text-muted">
        <div className="space-x-6">
          <Link href="/" className="link">Conditions of Use</Link>
          <Link href="/" className="link">Privacy Notice</Link>
          <Link href="/" className="link">Help</Link>
        </div>
        <p className="mt-2">Shopora is a portfolio demo. No real payments are taken.</p>
      </footer>
    </>
  );
}

