import Link from 'next/link';

/** Distraction-free chrome for sign-in, sign-up and checkout. */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-line bg-white py-5 text-center text-xs text-muted">
        <div className="space-x-6">
          <Link href="/" className="link">Conditions of Use</Link>
          <Link href="/" className="link">Privacy Notice</Link>
          <Link href="/" className="link">Help</Link>
        </div>
        <p className="mt-2">Kyro is a portfolio demo. No real payments are taken.</p>
      </footer>
    </>
  );
}

